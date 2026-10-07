"""建模小工具：材质登记（beauty/albedo/emit 三套出口）、基本体、贴 DOM 用的四边形登记、灯光。"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Euler, Matrix, Vector

ROOT = os.path.dirname(os.path.abspath(__file__))
T = 0.75          # 桌面高度
WALL_Y = 0.74     # 后墙内表面
ZMAX = 9.0        # depth 通道的归一化距离
LIGHT_GROUPS = ("sun", "sky", "screen", "rgb", "lamp")
rng = random.Random(42)


# ───────────────────────── 基础工具 ─────────────────────────
def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def rgb(hexstr):
    h = hexstr.lstrip("#")
    return tuple(lin(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)


MATS = {}


def M(name, hexcol="#888888", rough=0.6, emit=0.0, image=None, metal=0.0):
    """登记一个材质；每个材质带三套出口：beauty / albedo（纯色自发光）/ emit（只留发光体）。"""
    if name in MATS:
        return MATS[name]["mat"]
    mat = bpy.data.materials.new(name)
    try:
        mat.use_nodes = True
    except Exception:
        pass
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    col = rgb(hexcol)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = col
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Emission Color"].default_value = col
    bsdf.inputs["Emission Strength"].default_value = emit
    alb = nt.nodes.new("ShaderNodeEmission")
    alb.inputs["Color"].default_value = col
    emi = nt.nodes.new("ShaderNodeEmission")
    emi.inputs["Color"].default_value = col if emit > 0 else (0, 0, 0, 1)
    if image:
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(os.path.join(ROOT, "tex", image))
        targets = [(bsdf, "Base Color"), (bsdf, "Emission Color"), (alb, "Color")] + ([(emi, "Color")] if emit > 0 else [])
        for node, sock in targets:
            nt.links.new(tex.outputs["Color"], node.inputs[sock])
    mat.diffuse_color = col
    MATS[name] = {"mat": mat, "out": out, "beauty": bsdf, "albedo": alb, "emit": emi}
    return mat


def set_mode(mode):
    for m in MATS.values():
        nt = m["mat"].node_tree
        for l in list(m["out"].inputs["Surface"].links):
            nt.links.remove(l)
        nt.links.new(m[mode].outputs[0], m["out"].inputs["Surface"])


def add(name, bm, mat=None, loc=(0, 0, 0), rot=(0, 0, 0), hot=None, parent=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler = loc, Euler(rot)
    if mat:
        me.materials.append(mat)
    if hot:
        ob["hot"] = hot
    if parent:
        ob.parent = parent
    return ob


def box(name, size, loc, mat, rot=(0, 0, 0), hot=None, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    return add(name, bm, mat, loc, rot, hot, parent)


def cyl(name, r, h, loc, mat, rot=(0, 0, 0), r2=None, seg=40, hot=None, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    for f in bm.faces:
        f.smooth = abs(f.normal.z) < 0.9
    return add(name, bm, mat, loc, rot, hot, parent)


def ball(name, r, loc, mat, scale=(1, 1, 1), rot=(0, 0, 0), hot=None, parent=None, half=False):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=18, radius=r)
    if half:
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0), plane_no=(0, 0, -1), clear_outer=True)
        bmesh.ops.holes_fill(bm, edges=bm.edges)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    for f in bm.faces:
        f.smooth = len(f.verts) <= 4
    return add(name, bm, mat, loc, rot, hot, parent)


def torus(name, R, r, loc, mat, rot=(0, 0, 0), hot=None, parent=None, arc=math.tau, seg=40, sub=12):
    bm = bmesh.new()
    closed = abs(arc - math.tau) < 1e-6
    n = seg if closed else seg + 1
    rings = []
    for i in range(n):
        a = arc * i / seg
        c = Vector((math.cos(a) * R, math.sin(a) * R, 0))
        rings.append([bm.verts.new(c + Vector((math.cos(a) * math.cos(b), math.sin(a) * math.cos(b), math.sin(b))) * r)
                      for b in (math.tau * j / sub for j in range(sub))])
    for i in range(seg if not closed else n):
        a, b = rings[i], rings[(i + 1) % n]
        for j in range(sub):
            bm.faces.new((a[j], b[j], b[(j + 1) % sub], a[(j + 1) % sub])).smooth = True
    return add(name, bm, mat, loc, rot, hot, parent)


def slab(name, w, d, h, radius, loc, mat, rot=(0, 0, 0), hot=None, front_bulge=0.0):
    """圆角板（俯视轮廓带圆角，可选前沿外凸），用作桌面、鼠标垫、地毯。"""
    pts = []
    for cx, cy, a0 in ((w / 2 - radius, d / 2 - radius, 0), (-w / 2 + radius, d / 2 - radius, 90),
                       (-w / 2 + radius, -d / 2 + radius, 180), (w / 2 - radius, -d / 2 + radius, 270)):
        for k in range(9):
            a = math.radians(a0 + 90 * k / 8)
            pts.append((cx + math.cos(a) * radius, cy + math.sin(a) * radius))
    if front_bulge:
        pts = [(x, y - front_bulge * max(0.0, 1 - (2 * x / w) ** 2) if y < 0 else y) for x, y in pts]
    bm = bmesh.new()
    top = [bm.verts.new((x, y, h / 2)) for x, y in pts]
    bot = [bm.verts.new((x, y, -h / 2)) for x, y in pts]
    bm.faces.new(top)
    bm.faces.new(bot[::-1])
    n = len(pts)
    for i in range(n):
        bm.faces.new((top[i], bot[i], bot[(i + 1) % n], top[(i + 1) % n])).smooth = True
    return add(name, bm, mat, loc, rot, hot)


SURFACES = {}


def plane(name, w, h, loc, mat, rot=(0, 0, 0), hot=None, surface=None, parent=None):
    """竖直朝 -Y 的矩形；surface 给了名字就登记四角（TL,TR,BR,BL），前端把 DOM 贴上去。"""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    co = [(-w / 2, 0, h / 2), (-w / 2, 0, -h / 2), (w / 2, 0, -h / 2), (w / 2, 0, h / 2)]
    f = bm.faces.new([bm.verts.new(c) for c in co])
    for l, t in zip(f.loops, ((0, 1), (0, 0), (1, 0), (1, 1))):
        l[uv].uv = t
    ob = add(name, bm, mat, loc, rot, hot, parent)
    if surface:
        SURFACES[surface] = (ob, [Vector(co[0]), Vector(co[3]), Vector(co[2]), Vector(co[1])])
    return ob


def curved_panel(name, w, h, R, loc, mat, rot=(0, 0, 0), hot=None, surface=None, thick=0.0, seg=28):
    """曲面屏：弧长 w，两侧朝观看者（-Y）弯。"""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    ang = (w / 2) / R
    cols = []
    for i in range(seg + 1):
        a = -ang + 2 * ang * i / seg
        x, y = R * math.sin(a), -(R - R * math.cos(a))
        cols.append((bm.verts.new((x, y, h / 2)), bm.verts.new((x, y, -h / 2))))
    for i in range(seg):
        f = bm.faces.new((cols[i][0], cols[i][1], cols[i + 1][1], cols[i + 1][0]))
        f.smooth = True
        for l, t in zip(f.loops, ((i / seg, 1), (i / seg, 0), ((i + 1) / seg, 0), ((i + 1) / seg, 1))):
            l[uv].uv = t
    ob = add(name, bm, mat, loc, rot, hot)
    if thick:
        mod = ob.modifiers.new("solid", "SOLIDIFY")
        mod.thickness, mod.offset = thick, -1
    if surface:
        xe, ye = R * math.sin(ang), -(R - R * math.cos(ang))
        SURFACES[surface] = (ob, [Vector((-xe, ye, h / 2)), Vector((xe, ye, h / 2)), Vector((xe, ye, -h / 2)), Vector((-xe, ye, -h / 2))])
    return ob


def light(name, kind, group, energy, color, loc=(0, 0, 0), rot=(0, 0, 0), size=0.2, size_y=None, angle=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy, ld.color = energy, rgb(color)[:3]
    if kind == "AREA":
        ld.shape = "RECTANGLE" if size_y else "SQUARE"
        ld.size = size
        if size_y:
            ld.size_y = size_y
    if kind == "SUN" and angle:
        ld.angle = math.radians(angle)
    if kind == "POINT":
        ld.shadow_soft_size = size
    ob = bpy.data.objects.new(name, ld)
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler = loc, Euler(rot)
    ob["group"] = group
    return ob


