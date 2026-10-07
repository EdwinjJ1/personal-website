"""Evan 的工位：程序化建模 + 分通道渲染。

    blender -b --factory-startup -P blender/scene.py -- --out build/passes --width 3200 [--passes albedo,id,...]

输出：
  albedo.png / emit.png / id.png / normal.png / depth.png   （自发光材质直出，不受光照影响）
  light_<组>.exr                                             （白模 + 单组灯光，线性）
  beauty.png                                                 （Cycles 成品，参考用）
  scene.json                                                 （热点包围盒、可贴 DOM 的四边形、ID 颜色表）
风格化不在这里做，见 pipeline/stylize.py。
"""
import json
import os
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import LIGHT_GROUPS, MATS, SURFACES, ZMAX, lin, rgb, set_mode  # noqa: E402
from layout import build  # noqa: E402


# ───────────────────────── 渲染 ─────────────────────────
def override_mat(kind):
    mat = bpy.data.materials.new(f"__{kind}")
    try:
        mat.use_nodes = True
    except Exception:
        pass
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    if kind == "clay":
        n = nt.nodes.new("ShaderNodeBsdfDiffuse")
        n.inputs["Color"].default_value = (0.8, 0.8, 0.8, 1)
        nt.links.new(n.outputs[0], out.inputs["Surface"])
        return mat
    em = nt.nodes.new("ShaderNodeEmission")
    nt.links.new(em.outputs[0], out.inputs["Surface"])
    if kind == "id":
        nt.links.new(nt.nodes.new("ShaderNodeObjectInfo").outputs["Color"], em.inputs["Color"])
    elif kind == "normal":
        geo, vt, mad = nt.nodes.new("ShaderNodeNewGeometry"), nt.nodes.new("ShaderNodeVectorTransform"), nt.nodes.new("ShaderNodeVectorMath")
        vt.vector_type, vt.convert_from, vt.convert_to = "NORMAL", "WORLD", "CAMERA"
        mad.operation = "MULTIPLY_ADD"
        mad.inputs[1].default_value, mad.inputs[2].default_value = (0.5, 0.5, 0.5), (0.5, 0.5, 0.5)
        nt.links.new(geo.outputs["Normal"], vt.inputs[0])
        nt.links.new(vt.outputs[0], mad.inputs[0])
        nt.links.new(mad.outputs[0], em.inputs["Color"])
    elif kind == "depth":
        cd, m1, m2 = nt.nodes.new("ShaderNodeCameraData"), nt.nodes.new("ShaderNodeMath"), nt.nodes.new("ShaderNodeMath")
        m1.operation, m2.operation = "DIVIDE", "SUBTRACT"
        m1.inputs[1].default_value, m2.inputs[0].default_value = ZMAX, 1.0
        nt.links.new(cd.outputs["View Z Depth"], m1.inputs[0])
        nt.links.new(m1.outputs[0], m2.inputs[1])
        nt.links.new(m2.outputs[0], em.inputs["Color"])
    return mat


def assign_ids():
    """每个网格一个唯一纯色（通道取 16 的倍数，解码时四舍五入即可）。"""
    table, levels = [], list(range(16, 256, 16))
    n = len(levels)
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    assert len(meshes) < n ** 3, "ID 颜色不够用了"
    for i, ob in enumerate(meshes):
        k = i + 1
        c = (levels[k % n], levels[(k // n) % n], levels[(k // (n * n)) % n])
        ob.color = tuple(lin(v / 255) for v in c) + (1.0,)
        table.append({"color": c, "object": ob.name, "hot": ob.get("hot")})
    return table


def set_world(scene, hexcol, strength):
    w = scene.world or bpy.data.worlds.new("world")
    scene.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = rgb(hexcol)
    bg.inputs["Strength"].default_value = strength


def render_pass(scene, name, out, *, mode="albedo", override=None, lights=(), world=("#000000", 0.0), samples=24,
                transform="Standard", fmt="PNG", depth="8", denoise=False, box_filter=False):
    set_mode(mode)
    bpy.context.view_layer.material_override = override
    for ob in bpy.data.objects:
        if ob.type == "LIGHT":
            ob.hide_render = ob["group"] not in lights
    set_world(scene, *world)
    cy = scene.cycles
    cy.samples, cy.use_denoising, cy.use_adaptive_sampling = samples, denoise, False
    cy.pixel_filter_type, cy.filter_width = ("BOX", 0.01) if box_filter else ("BLACKMAN_HARRIS", 1.5)
    scene.view_settings.view_transform, scene.view_settings.look = transform, "None"
    ims = scene.render.image_settings
    try:
        ims.media_type = "IMAGE"
    except Exception:
        pass
    ims.file_format, ims.color_mode, ims.color_depth = fmt, "RGB", depth
    if fmt == "OPEN_EXR":
        ims.exr_codec = "ZIP"
    scene.render.filepath = os.path.join(out, name)
    bpy.ops.render.render(write_still=True)
    print("PASS", name)


def export_json(scene, out, ids):
    cam, W, H = scene.camera, scene.render.resolution_x, scene.render.resolution_y
    dg = bpy.context.evaluated_depsgraph_get()

    def px(v):
        c = world_to_camera_view(scene, cam, v)
        return [round(c.x * W, 1), round((1 - c.y) * H, 1)]

    hots = {}
    for ob in bpy.data.objects:
        if ob.type != "MESH" or not ob.get("hot"):
            continue
        ev = ob.evaluated_get(dg)
        pts = [px(ev.matrix_world @ v.co) for v in ev.to_mesh().vertices]
        h = hots.setdefault(ob["hot"], [1e9, 1e9, -1e9, -1e9])
        h[0], h[1] = min(h[0], *(p[0] for p in pts)), min(h[1], *(p[1] for p in pts))
        h[2], h[3] = max(h[2], *(p[0] for p in pts)), max(h[3], *(p[1] for p in pts))
    data = {
        "width": W, "height": H,
        "hots": {k: {"bbox": [round(x, 1) for x in v]} for k, v in hots.items()},
        "surfaces": {k: [px(ob.matrix_world @ c) for c in corners] for k, (ob, corners) in SURFACES.items()},
        "ids": ids,
    }
    with open(os.path.join(out, "scene.json"), "w") as f:
        json.dump(data, f, ensure_ascii=False)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    opt = dict(zip(argv[::2], argv[1::2]))
    out = os.path.abspath(opt.get("--out", "build/passes"))
    width = int(opt.get("--width", 1600))
    want = set(opt.get("--passes", "albedo,emit,id,normal,depth,lights,beauty").split(","))
    os.makedirs(out, exist_ok=True)

    scene = bpy.context.scene
    build(scene)
    scene.render.engine = "CYCLES"
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = width, width * 9 // 16, 100
    scene.view_settings.exposure, scene.display_settings.display_device = 0.0, "sRGB"
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for dev in prefs.devices:
            dev.use = True
        scene.cycles.device = "GPU"
    except Exception as e:
        print("GPU 不可用，回退 CPU：", e)

    ids = assign_ids()
    bpy.context.view_layer.update()
    export_json(scene, out, ids)
    sky = ("#cfeaff", 0.5)
    if "albedo" in want:
        render_pass(scene, "albedo", out, mode="albedo", world=sky, samples=24)
    if "emit" in want:
        render_pass(scene, "emit", out, mode="emit", samples=24)
    if "id" in want:
        render_pass(scene, "id", out, override=override_mat("id"), samples=1, box_filter=True)
    if "normal" in want:
        render_pass(scene, "normal", out, override=override_mat("normal"), samples=16, transform="Raw")
    if "depth" in want:
        render_pass(scene, "depth", out, override=override_mat("depth"), samples=16, transform="Raw", depth="16")
    if "lights" in want:
        clay = override_mat("clay")
        for g in LIGHT_GROUPS:
            render_pass(scene, f"light_{g}", out, mode="beauty", override=clay, lights=(g,), world=sky if g == "sky" else ("#000000", 0.0),
                        samples=96, transform="Raw", fmt="OPEN_EXR", depth="16", denoise=True)
    if "beauty" in want:
        render_pass(scene, "beauty", out, mode="beauty", lights=LIGHT_GROUPS, world=sky, samples=128, denoise=True)
    if "--save" in opt:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(opt["--save"]))


main()
