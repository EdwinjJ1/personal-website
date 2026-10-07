"""场景内容：高层 loft 里的一张大木桌。

俯视机位、铺满物件、墙上软木板 + 剪报，右侧黑钢框落地窗外是楼群。
每个可点的东西带 hot 名字，前端按它开面板：
  board / press / monitor / keyboard / mask（切换宇宙）/ zine-echo / zine-roundtable / zine-athena / zine-preuni
  notebook（博客）/ phone / trophy / hypha / roundtable / camera + photos（摄影）/ mosi / news（报纸）/ projects（手柄）/ friends（杯子）/ music（唱片）/ contact / fries
"""
import math
import random

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector

from kit import M, T, add, ball, box, cyl, light, plane, slab, torus

WY = 0.58  # 后墙内表面
rng = random.Random(7)
R = math.radians


def tex(image, emit=0.0, rough=0.7):
    return M("tex_" + image, "#ffffff", rough, emit=emit, image=image)


def empty(name, loc, rot=(0, 0, 0), parent=None):
    ob = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler, ob.parent = loc, Euler(rot), parent
    return ob


def decal(name, w, h, xy, image, yaw=0.0, z=0.002, hot=None, thick=0.0, edge="#f4f1ea"):
    """平放在桌面上的印刷品；thick>0 时下面垫一块有厚度的本体（书、刊物）。"""
    x, y = xy
    if thick:
        box(name + "_body", (w, h, thick), (x, y, T + z + thick / 2), M("edge_" + edge, edge, 0.8), rot=(0, 0, R(yaw)), hot=hot)
        z += thick + 0.0008
    return plane(name, w, h, (x, y, T + z), tex(image), rot=(-math.pi / 2, 0, R(yaw)), hot=hot)


def rod(name, p0, p1, r, mat, hot=None, seg=12):
    p0, p1 = Vector(p0), Vector(p1)
    return cyl(name, r, (p1 - p0).length, (p0 + p1) / 2, mat, rot=(p1 - p0).to_track_quat("Z", "Y").to_euler(), seg=seg, hot=hot)


def tbox(name, size, loc, mat, roof):
    """带 UV 的楼体：四个立面贴窗格，屋顶单独一个材质。"""
    bm = bmesh.new()
    bm.loops.layers.uv.verify()  # 没有 UV 层的话 calc_uvs 不生效
    bmesh.ops.create_cube(bm, size=1.0, calc_uvs=True)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    bm.normal_update()
    for f in bm.faces:
        f.material_index = 1 if f.normal.z > 0.5 else 0
    ob = add(name, bm, mat, loc)
    ob.data.materials.append(roof)
    return ob


# ───────────────────────── 房间 ─────────────────────────
def build_room():
    box("floor", (9, 5.4, 0.1), (0, -2.0, -0.05), M("floor", "#8f939b", 0.6))  # 到墙为止，窗外直接是楼群
    slab("rug", 3.5, 2.0, 0.012, 0.12, (0.0, -0.1, 0.007), M("rug", "#22384f", 0.95))
    slab("rug_in", 3.2, 1.7, 0.004, 0.08, (0.0, -0.1, 0.015), M("rug_in", "#2f5673", 0.95))

    wx0, wx1, wz0, wz1 = 0.72, 2.10, 0.12, 2.60
    box("wall_body", (wx0 + 2.7, 0.12, 2.9), ((wx0 - 2.7) / 2, WY + 0.07, 1.45), M("wall", "#e6e1d8", 0.9))
    plane("wall_brick", 3.32, 2.2, ((wx0 - 2.6) / 2, WY, 1.1), tex("brick.png", rough=0.9))
    box("wall_right", (0.6, 0.12, 2.9), (wx1 + 0.3, WY + 0.07, 1.45), M("wall", "#e6e1d8"))
    box("wall_sill", (wx1 - wx0, 0.12, wz0), ((wx0 + wx1) / 2, WY + 0.07, wz0 / 2), M("wall", "#e6e1d8"))
    box("baseboard", (3.3, 0.02, 0.09), ((wx0 - 2.6) / 2, WY - 0.01, 0.045), M("steel", "#17181c", 0.4))

    # 黑钢框落地窗：3 列 × 4 行
    steel = M("steel", "#17181c", 0.4)
    for i in range(4):
        x = wx0 + (wx1 - wx0) * i / 3
        box(f"mullion_v{i}", (0.05, 0.07, wz1 - wz0), (x, WY + 0.02, (wz0 + wz1) / 2), steel)
    for j in range(5):
        z = wz0 + (wz1 - wz0) * j / 4
        box(f"mullion_h{j}", (wx1 - wx0 + 0.05, 0.07, 0.05), ((wx0 + wx1) / 2, WY + 0.02, z), steel)
    box("pilaster", (0.09, 0.05, 2.9), (wx0 - 0.02, WY - 0.02, 1.45), steel)


def build_city():
    """窗外楼群：房间在 150 m 高处，往下看是屋顶和立面。太阳方向那条走廊留空，别挡光。"""
    box("ground", (1200, 1200, 1), (200, 300, -150.5), M("street", "#3a4558", 0.9))
    walls = [tex(f"facade_{i}.png", rough=0.5) for i in range(4)]
    roofs = [M(f"roof{i}", c, 0.8) for i, c in enumerate(("#5b6578", "#7b8597", "#454d5e", "#9aa3b2"))]
    sun_az = Vector((0.55, 0.65)).normalized()
    n = 0
    for gy in range(24):
        y = 92 + gy * 23 + rng.uniform(-4, 4)
        for gx in range(-2, 34):
            x = gx * 23 + rng.uniform(-5, 5) + (gy % 2) * 9
            if not (-12 < x < 1.02 * y + 30) or rng.random() < 0.2:
                continue
            rel = Vector((x - 1.4, y - WY))
            if abs(rel.x * sun_az.y - rel.y * sun_az.x) < 22 and rel.dot(sun_az) > 0:
                continue
            w, d = rng.uniform(12, 19), rng.uniform(12, 19)
            top = rng.uniform(-132, -45) if rng.random() < 0.72 else rng.uniform(-45, 45)
            if y < 170:
                top = min(top, -62)
            h = top + 150
            k = rng.randrange(4)
            tbox(f"tower{n}", (w, d, h), (x, y, -150 + h / 2), walls[k], roofs[k])
            n += 1


# ───────────────────────── 墙面 ─────────────────────────
def build_wall_stuff():
    y = WY - 0.02
    cx, cz, w, h = -0.72, 1.45, 1.56, 0.765
    box("board_back", (w + 0.03, 0.02, h + 0.03), (cx, y, cz), M("cork", "#d39a5c", 0.9), hot="board")
    plane("board_face", w, h, (cx, y - 0.0105, cz), tex("board.png", rough=0.9), hot="board", surface="board")
    wood = M("board_frame", "#7a4b2a", 0.6)
    for bx, bz, sx, sz in ((cx, cz - h / 2 - 0.012, w + 0.07, 0.03), (cx, cz + h / 2 + 0.012, w + 0.07, 0.03),
                           (cx - w / 2 - 0.012, cz, 0.03, h + 0.07), (cx + w / 2 + 0.012, cz, 0.03, h + 0.07)):
        box(f"board_frame{bx:.2f}{bz:.2f}", (sx, 0.035, sz), (bx, y - 0.004, bz), wood, hot="board")

    # 剪报 + 招聘海报（板子和窗之间，叠着贴）
    prints = [("clip_0", 0.30, 1.63, 0.250, 0.320, -4), ("clip_1", 0.55, 1.57, 0.235, 0.265, 5), ("poster", 0.31, 1.24, 0.260, 0.366, 3),
              ("clip_2", 0.56, 1.25, 0.235, 0.300, -3), ("clip_3", 0.45, 0.98, 0.220, 0.248, 6)]
    for i, (name, px, pz, pw, ph, tilt) in enumerate(prints):
        plane(f"wall_{name}", pw, ph, (px, WY - 0.004 - i * 0.0015, pz), tex(name + ".png", rough=0.9), rot=(0, R(tilt), 0), hot="press")
        box(f"tape_{name}", (0.05, 0.002, 0.018), (px, WY - 0.012 - i * 0.0015, pz + ph / 2 - 0.004), M("tape", "#f5e6a8", 0.7), rot=(0, R(tilt + 8), 0), hot="press")

    # 回声霓虹标：挂在窗格上，背后是楼群
    nx, nz = 1.64, 1.50
    cyl("neon_disc", 0.19, 0.02, (nx, WY - 0.012, nz), M("neon_disc", "#18181b", 0.4), rot=(math.pi / 2, 0, 0), seg=64)
    glow = M("neon_bar", "#f4fbff", 0.3, emit=6.0)
    for dx, bh in ((-0.07, 0.14), (0.0, 0.25), (0.07, 0.18)):
        rod(f"neon_bar{dx:+.2f}", (nx + dx, WY - 0.04, nz - bh / 2), (nx + dx, WY - 0.04, nz + bh / 2), 0.019, glow, seg=20)
        for s in (-1, 1):
            ball(f"neon_cap{dx:+.2f}{s}", 0.019, (nx + dx, WY - 0.04, nz + s * bh / 2), glow)
    light("neon_light", "POINT", "rgb", 4, "#dff3ff", (nx, WY - 0.22, nz), size=0.12)
    # 贴墙灯带
    light("strip_L", "AREA", "rgb", 9, "#ff4fd8", (-1.0, WY - 0.07, 0.80), rot=(math.pi, 0, 0), size=1.3, size_y=0.04)
    light("strip_R", "AREA", "rgb", 8, "#3de0ff", (0.2, WY - 0.07, 0.80), rot=(math.pi, 0, 0), size=0.9, size_y=0.04)


# ───────────────────────── 桌面 ─────────────────────────
def build_desk():
    slab("desk", 2.5, 1.04, 0.045, 0.03, (0, 0, T - 0.0225), M("desk_edge", "#7a4b2a", 0.5))
    plane("desk_top", 2.46, 1.0, (0, 0, T + 0.0006), tex("wood.png", rough=0.5), rot=(-math.pi / 2, 0, 0))
    steel = M("steel", "#17181c", 0.4)
    for x in (-1.1, 1.1):
        for yy in (-0.42, 0.42):
            box(f"leg{x}{yy}", (0.05, 0.05, T - 0.045), (x, yy, (T - 0.045) / 2), steel)


def keyboard(name, loc, yaw, case_col, caps, rows=5, cols=15, hot="keyboard"):
    u = 0.0205
    root = empty(name, loc, (R(3), 0, R(yaw)))
    box(f"{name}_case", (cols * u + 0.016, rows * u + 0.016, 0.022), (0, 0, 0.011), M(f"{name}_case", case_col, 0.5), hot=hot, parent=root)
    bms = {c: bmesh.new() for c in set(caps.values())}
    for r in range(rows):
        c = 0
        while c < cols:
            wide = 6 if (r == rows - 1 and c == 4) else 1
            key = "space" if wide > 1 else ("accent" if (c in (0, cols - 1) or (r == 0 and c % 4 == 0) or rng.random() < 0.07) else "main")
            m = Matrix.Translation(((c + wide / 2) * u - cols * u / 2, (rows / 2 - r - 0.5) * u, 0.028)) @ Matrix.Diagonal((u * wide - 0.003, u - 0.003, 0.012, 1))
            bmesh.ops.create_cube(bms[caps[key]], size=1.0, matrix=m)
            c += wide
    for col, bm in bms.items():
        add(f"{name}_caps_{col}", bm, M(f"cap_{col}", col, 0.45), hot=hot, parent=root)


def build_monitor():
    dark, silver = M("mon_body", "#1d1f24", 0.4), M("silver", "#c9ccd2", 0.3, metal=0.6)
    root = empty("mon_root", (-0.58, 0.30, T), (0, 0, R(10)))
    tilt = empty("mon_tilt", (0, 0, 0.275), (R(-12), 0, 0), parent=root)
    box("mon_body", (0.66, 0.028, 0.42), (0, 0.016, 0), dark, hot="monitor", parent=tilt)
    plane("mon_screen", 0.62, 0.3875, (0, 0.0015, 0.004), tex("screen.png", emit=1.0, rough=0.2), hot="monitor", surface="screen", parent=tilt)
    box("mon_neck", (0.05, 0.03, 0.22), (0, 0.06, 0.12), silver, hot="monitor", parent=root)
    slab("mon_base", 0.26, 0.17, 0.012, 0.03, (0, 0.05, 0.006), silver, hot="monitor").parent = root
    lt = light("screen_light", "AREA", "screen", 6, "#ffb07a", (0, -0.06, 0), rot=(-math.pi / 2, 0, 0), size=0.6, size_y=0.36)
    lt.parent = tilt
    decal("sticky_a", 0.085, 0.071, (-0.80, 0.08), "sticky_1.png", yaw=-9, hot="monitor")
    decal("sticky_b", 0.085, 0.071, (-0.40, 0.07), "sticky_0.png", yaw=7, hot="keyboard")


def build_left():
    # 耳机
    hp, pad = M("hp", "#2a2d35", 0.5), M("hp_pad", "#2b6be4", 0.7)
    for i, (x, y) in enumerate(((-1.13, 0.33), (-0.95, 0.27))):
        cyl(f"hp_cup{i}", 0.055, 0.04, (x, y, T + 0.02), hp)
        torus(f"hp_pad{i}", 0.04, 0.014, (x, y, T + 0.044), pad, seg=28, sub=10)
    torus("hp_band", 0.105, 0.009, (-1.04, 0.30, T + 0.012), hp, rot=(0, 0, R(-18 + 180)), arc=math.pi, seg=28, sub=8)
    torus("hp_cable", 0.11, 0.004, (-1.06, 0.14, T + 0.004), M("cable", "#17181c"), rot=(0, 0, R(200)), arc=math.pi * 1.2, seg=28, sub=6)
    # 马克杯
    mx, my = -1.12, -0.02
    cyl("mug", 0.047, 0.095, (mx, my, T + 0.0475), M("mug", "#ffffff", 0.4), hot="friends")
    cyl("mug_band", 0.0475, 0.02, (mx, my, T + 0.07), M("mug_band", "#2b6be4", 0.4), hot="friends")
    cyl("mug_coffee", 0.040, 0.004, (mx, my, T + 0.094), M("coffee", "#4a2c1a", 0.3), hot="friends")
    torus("mug_handle", 0.03, 0.009, (mx - 0.05, my + 0.01, T + 0.05), M("mug", "#ffffff"), rot=(math.pi / 2, 0, R(160)), seg=20, sub=8, hot="friends")
    # 唱片：从封套里抽出来一半，点开是黑胶播放器
    sx, sy, vx, vy = -0.968, -0.06, -0.923, -0.03
    box("vinyl_sleeve", (0.18, 0.18, 0.004), (sx, sy, T + 0.004), M("vinyl_sleeve", "#8e4ec6", 0.7), rot=(0, 0, R(8)), hot="music")
    box("vinyl_stripe", (0.18, 0.03, 0.001), (sx + 0.006, sy - 0.045, T + 0.0066), M("vinyl_stripe", "#f5b301", 0.6), rot=(0, 0, R(8)), hot="music")
    cyl("vinyl_disc", 0.085, 0.003, (vx, vy, T + 0.0085), M("vinyl_disc", "#16161a", 0.3), seg=64, hot="music")
    torus("vinyl_groove", 0.061, 0.0012, (vx, vy, T + 0.0098), M("vinyl_groove", "#34363f", 0.3), seg=64, sub=6, hot="music")
    cyl("vinyl_label", 0.034, 0.001, (vx, vy, T + 0.0105), M("vinyl_label", "#f5b301", 0.5), seg=40, hot="music")   # 不挖中心孔：墨线一描就把标签糊掉了
    # 键盘 + 鼠标
    keyboard("kb", (-0.64, -0.13, T + 0.002), 5, "#22242a", {"main": "#2f323b", "accent": "#ff7a3d", "space": "#f4f1ea"})
    ball("mouse", 0.05, (-0.27, -0.15, T + 0.022), M("mouse", "#22242a", 0.4), scale=(0.72, 1.18, 0.5), hot="keyboard")
    ball("mouse_wheel", 0.008, (-0.27, -0.115, T + 0.045), M("mouse_wheel", "#ff7a3d", 0.3, emit=2.0), scale=(0.5, 1.4, 0.6), hot="keyboard")
    # 报纸（新闻）+ 回声刊物
    decal("newspaper", 0.25, 0.327, (-1.05, -0.34), "newspaper.png", yaw=11, hot="news", thick=0.007, edge="#e8e2d0")
    decal("zine_echo", 0.205, 0.28, (-0.70, -0.37), "zine_echo.png", yaw=-7, hot="zine-echo", thick=0.006)
    # 工牌（模思智能）
    bx, by, yaw = -0.14, 0.07, 14
    box("badge", (0.075, 0.105, 0.004), (bx, by, T + 0.004), M("badge", "#ffffff", 0.5), rot=(0, 0, R(yaw)), hot="mosi")
    box("badge_head", (0.075, 0.03, 0.001), (bx - 0.009, by + 0.036, T + 0.0066), M("badge_head", "#111216", 0.5), rot=(0, 0, R(yaw)), hot="mosi")
    box("badge_photo", (0.034, 0.038, 0.001), (bx + 0.003, by - 0.012, T + 0.0066), M("badge_photo", "#bfe6ff", 0.5), rot=(0, 0, R(yaw)), hot="mosi")
    torus("badge_strap", 0.055, 0.004, (bx - 0.025, by + 0.10, T + 0.005), M("strap", "#2b6be4", 0.6), hot="mosi", seg=28, sub=6).scale = (0.8, 1.0, 1.0)


def build_center():
    # 笔架
    px, py = 0.00, 0.36
    box("pen_rack", (0.21, 0.07, 0.07), (px, py, T + 0.035), M("pen_rack", "#22242a", 0.5))
    for i, col in enumerate(("#e5484d", "#2b6be4", "#f5b301", "#30a46c", "#8e4ec6", "#ff7a3d", "#17181c", "#3de0ff")):
        x = px - 0.084 + i * 0.024
        tip = (x + rng.uniform(-0.012, 0.012), py + rng.uniform(0.0, 0.03), T + 0.17 + rng.uniform(-0.01, 0.02))
        rod(f"pen{i}", (x, py, T + 0.04), tip, 0.008, M(f"pen{i}", col, 0.4), seg=10)
    # 回声圆台：点它切换宇宙
    ex, ey = 0.32, 0.26
    cyl("echo_puck", 0.088, 0.045, (ex, ey, T + 0.0225), M("puck", "#18181b", 0.35), seg=56, hot="zine-echo")
    torus("echo_ring", 0.082, 0.006, (ex, ey, T + 0.012), M("puck_ring", "#ff7a3d", 0.3, emit=4.0), hot="zine-echo", seg=56, sub=8)
    bar = M("puck_bar", "#ffffff", 0.3, emit=3.0)
    for dx, ln in ((-0.03, 0.045), (0.0, 0.086), (0.03, 0.06)):
        box(f"echo_bar{dx:+.2f}", (0.016, ln, 0.004), (ex + dx, ey, T + 0.047), bar, hot="zine-echo")
        for s in (-1, 1):
            cyl(f"echo_cap{dx:+.2f}{s}", 0.008, 0.004, (ex + dx, ey + s * ln / 2, T + 0.047), bar, seg=16, hot="zine-echo")
    light("puck_light", "POINT", "rgb", 1.5, "#ff9a5a", (ex, ey, T + 0.12), size=0.1)
    # 蜘蛛面具：点它切换宇宙（致敬参考站）
    mx, my = 0.10, 0.05
    root = empty("mask_root", (mx, my, T + 0.002), (R(-14), 0, R(-10)))
    ball("mask", 1.0, (0, 0, 0), M("mask_red", "#d81f2a", 0.45), scale=(0.088, 0.112, 0.062), half=True, hot="mask", parent=root)
    for sd in (-1, 1):
        ball(f"mask_eye_rim{sd}", 1.0, (sd * 0.035, -0.016, 0.045), M("mask_rim", "#101014", 0.4), scale=(0.031, 0.046, 0.008), rot=(R(-12), R(sd * 24), R(sd * 24)), hot="mask", parent=root)
        ball(f"mask_eye{sd}", 1.0, (sd * 0.035, -0.018, 0.0535), M("mask_eye", "#ffffff", 0.3), scale=(0.022, 0.035, 0.006), rot=(R(-12), R(sd * 24), R(sd * 24)), hot="mask", parent=root)
    decal("sticky_c", 0.085, 0.071, (0.26, 0.06), "sticky_2.png", yaw=-7, hot="mask")
    # 薯条（彩蛋）
    fx, fy = 0.27, -0.17
    cyl("plate", 0.085, 0.012, (fx, fy, T + 0.006), M("plate", "#ffffff", 0.3), r2=0.115, hot="fries")
    fry = bmesh.new()
    for _ in range(30):
        a, d = rng.uniform(0, math.tau), rng.uniform(0, 0.06)
        m = Matrix.Translation((math.cos(a) * d, math.sin(a) * d, rng.uniform(0.012, 0.036))) @ Euler((rng.uniform(-0.5, 0.5), rng.uniform(-0.5, 0.5), rng.uniform(0, math.tau))).to_matrix().to_4x4() @ Matrix.Diagonal((0.012, 0.07, 0.012, 1))
        bmesh.ops.create_cube(fry, size=1.0, matrix=m)
    add("fries", fry, M("fries", "#ffc93c", 0.6), (fx, fy, T + 0.008), hot="fries")
    # 摊开的笔记本 + 笔
    decal("notebook", 0.44, 0.308, (-0.16, -0.33), "notebook.png", yaw=3, hot="notebook", thick=0.012, edge="#2f9e77")
    rod("nb_pen", (-0.02, -0.46, T + 0.022), (0.13, -0.36, T + 0.022), 0.006, M("nb_pen", "#e5484d", 0.4))
    # 手柄
    gx, gy, gm = 0.20, -0.38, M("pad", "#f4f1ea", 0.5)
    box("pad_body", (0.11, 0.055, 0.03), (gx, gy, T + 0.018), gm, rot=(0, 0, R(-12)), hot="projects")
    for s in (-1, 1):
        ball(f"pad_grip{s}", 0.04, (gx + s * 0.058, gy - 0.012 - s * 0.012, T + 0.02), gm, scale=(0.9, 1.25, 0.6), rot=(0, 0, R(-12)), hot="projects")
        cyl(f"pad_stick{s}", 0.011, 0.012, (gx + s * 0.028, gy - 0.004 - s * 0.006, T + 0.038), M("pad_stick", "#22242a"), seg=14, hot="projects")
    for i, col in enumerate(("#e5484d", "#2b6be4", "#f5b301", "#30a46c")):
        a = i * math.pi / 2
        cyl(f"pad_btn{i}", 0.006, 0.006, (gx + 0.045 + math.cos(a) * 0.012, gy + 0.004 + math.sin(a) * 0.012, T + 0.035), M(f"pad_btn{i}", col, 0.3), seg=10, hot="projects")


def build_right():
    # 奖杯：Athena 金杯 + 一只小银杯
    gold, silver, base = M("gold", "#f5b301", 0.25, metal=0.9), M("silver", "#c9ccd2", 0.3, metal=0.6), M("trophy_base", "#3b2a20", 0.5)
    for name, (tx, ty), s, mat in (("gold", (0.64, 0.36), 1.0, gold), ("silver", (0.80, 0.30), 0.72, silver)):
        box(f"tr_base_{name}", (0.11 * s, 0.11 * s, 0.045 * s), (tx, ty, T + 0.0225 * s), base, hot="trophy")
        cyl(f"tr_stem_{name}", 0.014 * s, 0.08 * s, (tx, ty, T + 0.085 * s), mat, r2=0.028 * s, seg=20, hot="trophy")
        cyl(f"tr_cup_{name}", 0.032 * s, 0.11 * s, (tx, ty, T + 0.18 * s), mat, r2=0.07 * s, hot="trophy")
        for sd in (-1, 1):
            torus(f"tr_handle_{name}{sd}", 0.036 * s, 0.007 * s, (tx + sd * 0.064 * s, ty, T + 0.185 * s), mat, rot=(math.pi / 2, 0, 0), hot="trophy", seg=20, sub=8)
    # 台灯
    white = M("lamp", "#f4f1ea", 0.4)
    cyl("lamp_base", 0.075, 0.016, (1.02, 0.42, T + 0.008), white)
    rod("lamp_arm1", (1.02, 0.42, T + 0.01), (0.99, 0.40, T + 0.36), 0.009, white)
    rod("lamp_arm2", (0.99, 0.40, T + 0.36), (0.86, 0.30, T + 0.44), 0.009, white)
    ball("lamp_joint", 0.016, (0.99, 0.40, T + 0.36), M("steel", "#17181c"))
    head = Vector((0.83, 0.28, T + 0.41))
    aim = (Vector((0.70, 0.12, T)) - head).normalized()
    cyl("lamp_shade", 0.085, 0.11, head, white, rot=aim.to_track_quat("-Z", "Y").to_euler(), r2=0.035, seg=32)
    cyl("lamp_bulb", 0.05, 0.004, head + aim * 0.056, M("lamp_bulb", "#fff1cf", 0.3, emit=5.0), rot=aim.to_track_quat("-Z", "Y").to_euler(), seg=24)
    lt = light("lamp_light", "AREA", "lamp", 16, "#ffe2b0", head + aim * 0.07, size=0.1)
    lt.rotation_euler = aim.to_track_quat("-Z", "Y").to_euler()
    # 蘑菇盆栽（Hypha · 灵境菌络）
    hx, hy = 1.14, 0.22
    cyl("pot", 0.06, 0.09, (hx, hy, T + 0.045), M("pot", "#e9d9c2", 0.7), r2=0.08, hot="hypha")
    cyl("soil", 0.075, 0.006, (hx, hy, T + 0.089), M("soil", "#5a3d2b", 0.9), hot="hypha")
    for dx, dy, s in ((0.0, 0.0, 1.0), (0.045, -0.03, 0.62), (-0.04, -0.035, 0.5)):
        cyl(f"shroom_stem{s}", 0.017 * s, 0.11 * s, (hx + dx, hy + dy, T + 0.09 + 0.055 * s), M("shroom_stem", "#fff6e6", 0.6), r2=0.012 * s, seg=16, hot="hypha")
        ball(f"shroom_cap{s}", 0.062 * s, (hx + dx, hy + dy, T + 0.09 + 0.105 * s), M("shroom_cap", "#e5484d", 0.4), scale=(1, 1, 0.72), half=True, hot="hypha")
        for k in range(5):
            a = k * math.tau / 5 + s
            ball(f"shroom_dot{s}{k}", 0.011 * s, (hx + dx + math.cos(a) * 0.034 * s, hy + dy + math.sin(a) * 0.034 * s, T + 0.09 + 0.136 * s), M("shroom_dot", "#ffffff", 0.5), scale=(1, 1, 0.5), hot="hypha")
    # 小圆桌模型（Roundtable）
    rx, ry = 0.98, 0.02
    wood = M("rt_wood", "#7a4b2a", 0.5)
    cyl("rt_foot", 0.06, 0.01, (rx, ry, T + 0.005), wood, hot="roundtable")
    cyl("rt_leg", 0.016, 0.07, (rx, ry, T + 0.04), wood, seg=16, hot="roundtable")
    cyl("rt_top", 0.125, 0.016, (rx, ry, T + 0.083), M("rt_top", "#f4e3c1", 0.5), seg=48, hot="roundtable")
    cyl("rt_inlay", 0.058, 0.004, (rx, ry, T + 0.092), M("rt_inlay", "#2b6be4", 0.4), seg=32, hot="roundtable")
    for i, col in enumerate(("#e5484d", "#f5b301", "#30a46c", "#2b6be4", "#8e4ec6", "#ff7a3d")):
        a = i * math.tau / 6 + 0.3
        px, py, pm = rx + math.cos(a) * 0.095, ry + math.sin(a) * 0.095, M(f"pawn{i}", col, 0.4)
        cyl(f"pawn_body{i}", 0.018, 0.045, (px, py, T + 0.113), pm, r2=0.01, seg=16, hot="roundtable")
        ball(f"pawn_head{i}", 0.015, (px, py, T + 0.146), pm, hot="roundtable")
    # 刊物三本，扇形摊开
    decal("zine_roundtable", 0.205, 0.28, (0.50, -0.05), "zine_roundtable.png", yaw=-13, hot="zine-roundtable", thick=0.006)
    decal("zine_athena", 0.205, 0.28, (0.71, -0.17), "zine_athena.png", yaw=9, hot="zine-athena", thick=0.006, z=0.008)
    decal("zine_preuni", 0.205, 0.28, (0.50, -0.34), "zine_preuni.png", yaw=-3, hot="zine-preuni", thick=0.006)
    # 手机（回声手机端）
    box("phone_body", (0.082, 0.172, 0.009), (0.86, -0.39, T + 0.0045), M("phone", "#111216", 0.3), rot=(0, 0, R(-18)), hot="phone")
    plane("phone_screen", 0.074, 0.159, (0.86, -0.39, T + 0.0096), tex("phone.png", emit=0.8, rough=0.2), rot=(-math.pi / 2, 0, R(-18)), hot="phone", surface="phone")
    # 相机
    cxm, cym, cyaw = 1.12, -0.16, R(-28)
    cam_b = M("cam_body", "#22242a", 0.5)
    box("cam_body", (0.15, 0.07, 0.095), (cxm, cym, T + 0.0475), cam_b, rot=(0, 0, cyaw), hot="camera")
    box("cam_top", (0.065, 0.055, 0.028), (cxm, cym, T + 0.108), cam_b, rot=(0, 0, cyaw), hot="camera")
    off, lens_rot = Vector((math.sin(cyaw), -math.cos(cyaw), 0)), Euler((math.pi / 2, 0, cyaw))
    cyl("cam_lens", 0.044, 0.08, Vector((cxm, cym, T + 0.0475)) + off * 0.072, M("cam_lens", "#3a3d45", 0.3), rot=lens_rot, hot="camera")
    cyl("cam_ring", 0.045, 0.012, Vector((cxm, cym, T + 0.0475)) + off * 0.098, M("cam_ring", "#e5484d", 0.3), rot=lens_rot, hot="camera")
    cyl("cam_glass", 0.034, 0.004, Vector((cxm, cym, T + 0.0475)) + off * 0.113, M("cam_glass", "#6fb7ff", 0.1), rot=lens_rot, hot="camera")
    # 名片 + 三张拍立得（真照片，点开是摄影集）
    decal("bizcard", 0.105, 0.06, (1.00, -0.31), "bizcard.png", yaw=-16, hot="contact", thick=0.001)
    decal("polaroid_a", 0.098, 0.118, (0.99, -0.44), "polaroid_a.png", yaw=12, hot="photos")
    decal("polaroid_b", 0.098, 0.118, (1.10, -0.43), "polaroid_b.png", yaw=-6, z=0.004, hot="photos")
    decal("polaroid_c", 0.098, 0.118, (1.19, -0.35), "polaroid_c.png", yaw=-24, z=0.006, hot="photos")


def build_plant():
    x, y = 1.82, -0.42
    cyl("planter", 0.16, 0.38, (x, y, 0.19), M("planter", "#17181c", 0.5), r2=0.2)
    cyl("planter_soil", 0.19, 0.01, (x, y, 0.375), M("soil", "#5a3d2b"))
    for i in range(10):
        a, L, lean = i * 2.4, rng.uniform(0.5, 0.9), rng.uniform(0.3, 0.7)
        tip = Vector((x + math.cos(a) * math.sin(lean) * L, y + math.sin(a) * math.sin(lean) * L, 0.38 + L * math.cos(lean)))
        rod(f"stem{i}", (x, y, 0.38), tip, 0.008, M("stem", "#2a7a45", 0.6), seg=8)
        ball(f"leaf{i}", 0.16, tip, M("leaf_a" if i % 2 else "leaf_b", "#2f9e57" if i % 2 else "#45c178", 0.6), scale=(1.0, 0.6, 0.06), rot=(0, lean - 1.1, a))


def build_lights_and_camera(scene):
    d = Vector((-0.55, -0.65, -0.45)).normalized()  # 傍晚的低太阳，从右后方穿过窗格
    sun = light("sun", "SUN", "sun", 4.0, "#ffd9a8", angle=1.2)
    sun.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    light("fill", "AREA", "sky", 150, "#f2f6ff", (0.0, -1.3, 3.7), rot=(R(14), 0, 0), size=3.4)
    light("fill_left", "AREA", "sky", 40, "#fff3e4", (-2.8, -0.6, 2.4), rot=(R(40), 0, R(-80)), size=2.0)

    cam_d = bpy.data.cameras.new("cam")
    cam_d.lens, cam_d.sensor_width, cam_d.clip_end = 23.0, 36.0, 2000
    cam = bpy.data.objects.new("cam", cam_d)
    scene.collection.objects.link(cam)
    cam.location = (0.0, -1.70, 2.56)
    cam.rotation_euler = (Vector((0.05, 0.14, 1.06)) - Vector(cam.location)).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam


def build(scene):
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    build_room()
    build_city()
    build_wall_stuff()
    build_desk()
    build_monitor()
    build_left()
    build_center()
    build_right()
    build_plant()
    build_lights_and_camera(scene)
