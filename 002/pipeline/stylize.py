# /// script
# dependencies = ["numpy", "pillow", "opencv-python-headless"]
# ///
"""把 Blender 的分通道渲染合成 10 种印刷/漫画风格，并导出前端要用的热点图。

    uv run pipeline/stylize.py build/passes site/assets [--only comic,noir]

输入：albedo / emit / id / normal / depth + light_<组>.exr + scene.json
输出：styles/<名字>.webp（及半尺寸 @1x）、hot.png（R 通道 = 热点序号 × 8）、scene.json
"""
import json
import os
import sys
from pathlib import Path

os.environ["OPENCV_IO_ENABLE_OPENEXR"] = "1"
import cv2  # noqa: E402
import numpy as np  # noqa: E402
from PIL import Image  # noqa: E402

ZMAX = 9.0
STYLES = ["comic", "noir", "pop", "anime", "watercolor", "punk", "neon", "sketch", "pixel", "void"]


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)


def luma(a):
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


def mix(a, b, t):
    t = t[..., None] if (np.ndim(t) == 2 and np.ndim(a) == 3) else t
    return a * (1 - t) + b * t


def sat(a, k):
    g = luma(a)[..., None]
    return np.clip(g + (a - g) * k, 0, 1)


def blur(a, r):
    return cv2.GaussianBlur(a, (0, 0), max(r, 0.01))


def dilate(m, r):
    k = max(1, int(round(r)))
    return cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 1, 2 * k + 1)))


class Ctx:
    """一次渲染的全部通道 + 常用派生量。s 是相对 1600 宽的缩放，所有像素尺寸都乘它。"""

    def __init__(self, src):
        src = Path(src)
        rd = lambda n, flag=cv2.IMREAD_UNCHANGED: cv2.imread(str(src / n), flag)
        self.A = rd("albedo.png")[..., ::-1].astype(np.float32) / 255
        self.E = rd("emit.png")[..., ::-1].astype(np.float32) / 255
        self.H, self.W = self.A.shape[:2]
        self.s = self.W / 1600
        idi = np.rint(rd("id.png")[..., ::-1].astype(np.float32) / 16).astype(np.int32)
        self.K = idi[..., 0] + idi[..., 1] * 16 + idi[..., 2] * 256
        n = rd("normal.png")[..., ::-1].astype(np.float32) / 255 * 2 - 1
        self.N = n / np.maximum(np.linalg.norm(n, axis=-1, keepdims=True), 1e-4)
        d = rd("depth.png").astype(np.float32)
        d = (d[..., 0] if d.ndim == 3 else d) / 65535
        self.Z = (1 - d) * ZMAX
        self.L = {g: np.clip(rd(f"light_{g}.exr")[..., 2::-1].astype(np.float32), 0, 50) for g in ("sun", "sky", "screen", "rgb", "lamp")}
        self.meta = json.loads((src / "scene.json").read_text())
        self.key = {o["object"]: (o["color"][0] // 16) + (o["color"][1] // 16) * 16 + (o["color"][2] // 16) * 256 for o in self.meta["ids"]}
        self.rs = np.random.RandomState(5)
        yy, xx = np.mgrid[0:self.H, 0:self.W].astype(np.float32)
        self.xx, self.yy = xx, yy
        self.wall = self.mask("wall_")
        self.city = self.mask("tower", "ground")
        self.floor = self.mask("floor", "rug")
        self.desk = self.mask("desk")
        self.hotmask = np.isin(self.K, [self.key[o["object"]] for o in self.meta["ids"] if o["hot"]])
        self._edges()

    def mask(self, *prefixes):
        keys = [k for n, k in self.key.items() if n.startswith(prefixes)]
        return np.isin(self.K, keys)

    def noise(self, cell, amp=1.0):
        """低频平滑噪声，范围约 ±amp。"""
        h, w = int(self.H / (cell * self.s)) + 2, int(self.W / (cell * self.s)) + 2
        return cv2.resize(self.rs.uniform(-1, 1, (h, w)).astype(np.float32), (self.W, self.H), interpolation=cv2.INTER_CUBIC) * amp

    def grain(self, amp):
        return self.rs.normal(0, amp, (self.H, self.W)).astype(np.float32)

    def _edges(self):
        K, N, Z, A = self.K, self.N, self.Z, self.A
        outer = np.zeros(K.shape, bool)
        inner = np.zeros(K.shape, bool)
        detail = np.zeros(K.shape, bool)
        la = luma(A)
        for ax in (0, 1):
            kr, nr, zr, lr, ar = (np.roll(v, 1, ax) for v in (K, N, Z, la, A))
            outer |= K != kr
            outer |= np.abs(Z - zr) > 0.03 * np.minimum(Z, zr) + 0.006
            inner |= (N * nr).sum(-1) < 0.82
            detail |= (np.abs(la - lr) > 0.13) | (np.abs(A - ar).sum(-1) > 0.34)
        far = self.city
        inner &= ~far
        self.e_outer = (outer & ~far).astype(np.float32)
        self.e_inner = (inner & ~outer).astype(np.float32)
        self.e_detail = (detail & ~outer & ~inner).astype(np.float32)
        self.e_city = ((outer | detail) & far).astype(np.float32)

    def lines(self, w_outer=1.5, w_inner=0.8, w_detail=0.55, wobble=0.9, vary=True, city=0.5):
        """墨线 alpha：外轮廓粗、结构线中、印刷细节细；粗细沿线随噪声变化，整体带一点手抖。"""
        s = self.s
        a = dilate(self.e_outer, w_outer * s)
        if vary:
            a = np.maximum(a, dilate(self.e_outer, w_outer * 1.9 * s) * (self.noise(26) > 0.1))
        a = np.maximum(a, dilate(self.e_inner, w_inner * s) if w_inner * s >= 1 else self.e_inner * min(1, w_inner * s + 0.4))
        if w_detail:
            a = np.maximum(a, blur(self.e_detail, 0.5 * s) * min(1.0, w_detail * 1.6))
        if city:
            a = np.maximum(a, blur(self.e_city, 0.45 * s) * city)
        a = np.clip(blur(a, 0.42 * s) * 1.25, 0, 1)
        if wobble:
            mx = (self.xx + self.noise(18, wobble * s)).astype(np.float32)
            my = (self.yy + self.noise(18, wobble * s)).astype(np.float32)
            a = cv2.remap(a, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        return a

    def light(self, sun=1.0, sky=1.0, screen=1.0, rgb=1.0, lamp=1.0):
        return self.L["sun"] * sun + self.L["sky"] * sky + self.L["screen"] * screen + self.L["rgb"] * rgb + self.L["lamp"] * lamp

    def halftone(self, tone, cell, angle=45.0, soft=0.0):
        """tone 0..1 = 网点覆盖率。返回 0..1 的墨量。"""
        c, sn = np.cos(np.radians(angle)), np.sin(np.radians(angle))
        cell = cell * self.s
        u, v = (self.xx * c + self.yy * sn) / cell, (-self.xx * sn + self.yy * c) / cell
        d = np.hypot(u - np.floor(u) - 0.5, v - np.floor(v) - 0.5)
        r = np.sqrt(np.clip(tone, 0, 1)) * 0.72
        e = max(soft, 0.6 / cell)
        return np.clip((r - d) / e + 0.5, 0, 1)

    def hatch(self, tone, spacing, angle=45.0, wobble=1.2):
        c, sn = np.cos(np.radians(angle)), np.sin(np.radians(angle))
        sp = spacing * self.s
        t = (self.xx * c + self.yy * sn + self.noise(40, wobble * self.s)) / sp
        f = np.abs(t - np.floor(t) - 0.5) * 2
        return np.clip((np.clip(tone, 0, 1) * 0.9 - f) * sp * 0.5 + 0.5, 0, 1)

    def paper(self, color, amp=0.035, fiber=0.02):
        tex = 1 + self.noise(60, amp) + self.noise(7, amp * 0.6) + self.grain(fiber)
        return np.clip(hexc(color)[None, None] * tex[..., None], 0, 1)

    def glow(self, radius, gain=1.0):
        return blur(self.E, radius * self.s) * gain

    def tone(self, lit, lo=0.02, hi=0.9):
        g = luma(lit)
        return np.clip((g - lo) / (hi - lo), 0, 1)

    def brickline(self):
        """墙上的砖缝（来自 albedo 的明度细节），0..1。"""
        la = luma(self.A)
        return np.clip((blur(la, 3 * self.s) - la) * 9, 0, 1) * self.wall


# ───────────────────────── 十种风格 ─────────────────────────
def comic(C):
    lit = C.light(sun=1.0, sky=0.9, screen=1.1, rgb=1.2, lamp=1.0)
    t = C.tone(lit, 0.03, 0.75)
    base = sat(C.A, 1.35)
    wallc = hexc("#ffd23f")[None, None] * (0.86 + 0.14 * luma(C.A)[..., None])
    base = np.where(C.wall[..., None], mix(wallc, base, 0.25), base)
    base = np.where(C.floor[..., None], sat(base * hexc("#8fb6ff") * 1.5, 1.2), base)
    shade = base * hexc("#6a5fb0") * 1.15
    mid = (t < 0.42).astype(np.float32)
    out = mix(base, shade, blur(mid, 0.6 * C.s))
    dots = C.halftone(np.clip(0.62 - t, 0, 0.5) * 1.25, 5.2, 30)          # 暗部本戴点
    out = mix(out, shade * 0.62, dots * (t < 0.62))
    out = mix(out, out * 0.35, C.hatch(np.clip(0.2 - t, 0, 1) * 4, 5, -40) * (t < 0.2))
    sunpatch = np.clip(luma(C.L["sun"]) * 0.9, 0, 1)                       # 太阳照到的地方提亮发黄
    out = mix(out, np.clip(out * 1.12 + hexc("#fff3b0") * 0.16, 0, 1), sunpatch)
    out = mix(out, hexc("#fff8d8")[None, None], C.halftone(np.clip(sunpatch - 0.55, 0, 1) * 0.5, 6.5, 60) * 0.5)
    out = np.clip(out + C.glow(10, 0.5) + C.E * 0.25, 0, 1)
    k = int(round(2.2 * C.s))                                             # 套色错位
    out = np.stack([np.roll(out[..., 0], (k // 2, k), (0, 1)), out[..., 1], np.roll(out[..., 2], (-k // 2, -k), (0, 1))], -1)
    out = out * (C.paper("#fff6e0", 0.03, 0.015) * 0.5 + 0.5)
    return mix(out, hexc("#14121c")[None, None], C.lines(1.7, 0.9, 0.6))


def noir(C):
    lit = C.light(sun=2.2, sky=0.22, screen=0.9, rgb=0.2, lamp=1.6)
    g = (luma(C.A) * 0.55 + 0.45) * C.tone(lit, 0.0, 0.8)
    g = np.where(C.city, luma(C.A) * 1.25 - 0.12, g)
    g = np.maximum(g, luma(C.E) * 1.2) + C.noise(50, 0.05)
    white, mid = g > 0.5, (g > 0.2) & (g <= 0.5)
    v = white.astype(np.float32)
    v = np.maximum(v, mid * (1 - C.hatch(np.full_like(g, 0.62), 4.2, 45)))
    v = np.where(mid & (g < 0.33), v * (1 - C.hatch(np.full_like(g, 0.5), 4.2, -45)), v)
    v = blur(v.astype(np.float32), 0.5 * C.s)
    ln = C.lines(1.6, 0.8, 0.5, city=0.35)
    v = np.where(blur(white.astype(np.float32), 2 * C.s) > 0.45, v * (1 - ln), np.maximum(v, ln * 0.92))  # 白底黑线，黑底白线
    v = np.clip(v + C.grain(0.05), 0, 1)
    vig = 1 - 0.35 * (((C.xx / C.W - 0.5) ** 2 + (C.yy / C.H - 0.5) ** 2) * 2.2)
    return (np.clip(v * vig, 0, 1)[..., None] * hexc("#f2efe6") + (1 - v[..., None]) * hexc("#0c0c10") * 0.9).clip(0, 1)


def pop(C):
    lit = C.light(sun=1.1, sky=1.0, screen=1.0, rgb=0.6, lamp=1.0)
    t = C.tone(lit, 0.03, 0.7)
    hsv = cv2.cvtColor(C.A, cv2.COLOR_RGB2HSV)
    h, s_, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    pal = [("#e8212b", 0), ("#ff7a00", 28), ("#ffd400", 52), ("#19a84a", 130), ("#1b4fd8", 220), ("#e8212b", 360), ("#ff4fa3", 320)]
    out = np.zeros_like(C.A)
    best = np.full(h.shape, 1e9, np.float32)
    for hx, hue in pal:
        d = np.minimum(np.abs(h - hue), 360 - np.abs(h - hue))
        m = d < best
        out[m], best[m] = hexc(hx), d[m]
    out = np.where((s_ < 0.22)[..., None], np.where((v > 0.55)[..., None], hexc("#fffbea"), hexc("#16161a")), out)
    out = np.where((v < 0.2)[..., None], hexc("#16161a"), out)
    wall = mix(hexc("#fff1c9")[None, None], hexc("#e8212b")[None, None], C.halftone(np.full_like(t, 0.34) + (C.yy / C.H) * 0.2, 9, 45))
    out = np.where(C.wall[..., None], mix(wall, hexc("#16161a")[None, None], C.brickline() * 0.25), out)
    out = np.where(C.floor[..., None], mix(hexc("#1b4fd8")[None, None], hexc("#fffbea")[None, None], C.halftone(np.full_like(t, 0.22), 8, 15)), out)
    dots = C.halftone(np.clip(0.6 - t, 0, 0.55) * 1.3, 7.5, 45)
    out = mix(out, hexc("#16161a")[None, None], dots * 0.85 * ~C.wall)
    hi = C.halftone(np.clip(luma(C.L["sun"]) - 0.5, 0, 1) * 0.6, 7.5, 45)
    out = mix(out, hexc("#fffbea")[None, None], hi * 0.7)
    out = np.clip(out + C.E * 0.2, 0, 1)
    return mix(out, hexc("#101014")[None, None], C.lines(2.4, 1.1, 0.7, wobble=0.5))


def anime(C):
    lit = C.light(sun=1.0, sky=1.1, screen=1.2, rgb=1.4, lamp=1.0)
    t = C.tone(lit, 0.03, 0.7)
    base = np.clip(sat(C.A, 1.15) * 0.86 + 0.14, 0, 1)
    scr = mix(hexc("#cdb8ff")[None, None], hexc("#ffb86b")[None, None], ((np.floor(C.xx / (46 * C.s)) + np.floor(C.yy / (46 * C.s))) % 2))
    scr = mix(scr, hexc("#7a5cd6")[None, None], C.halftone(np.full_like(t, 0.2), 4.2, 45) * 0.8)
    base = np.where(C.wall[..., None], mix(scr, base, 0.18), base)
    base = np.where(C.floor[..., None], mix(base, hexc("#5b46b8")[None, None], 0.55), base)
    out = mix(base, base * hexc("#b9a2ee") * 0.98, blur((t < 0.4).astype(np.float32), 0.5 * C.s))
    out = mix(out, out * hexc("#8f7fd0"), (t < 0.16).astype(np.float32))
    sun = np.clip(luma(C.L["sun"]) * 0.9, 0, 1)
    out = np.clip(out + sun[..., None] * hexc("#fff0c2") * 0.22, 0, 1)
    ln = C.lines(1.25, 0.7, 0.5, wobble=0.3, vary=False)
    out = mix(out, hexc("#3a2466")[None, None], ln)
    rim = blur(C.e_outer, 1.2 * C.s) * (t > 0.6) * (np.roll(ln, int(2 * C.s), 0) < 0.3)  # 受光边的高光描线
    out = mix(out, np.ones(3, np.float32)[None, None], np.clip(rim * 1.6, 0, 1) * 0.8)
    out = np.clip(out + C.glow(16, 0.9) * hexc("#ffd0f0") + C.glow(40, 0.5) * hexc("#b9e8ff"), 0, 1)
    sp = np.zeros((C.H, C.W), np.float32)                                # 十字星
    for _ in range(26):
        x, y, r = C.rs.randint(0, C.W), C.rs.randint(0, C.H), int(C.rs.randint(6, 18) * C.s)
        cv2.line(sp, (x - r, y), (x + r, y), 1.0, max(1, int(C.s)))
        cv2.line(sp, (x, y - r), (x, y + r), 1.0, max(1, int(C.s)))
    return np.clip(out + blur(sp, 0.8 * C.s)[..., None] * 0.9, 0, 1)


def watercolor(C):
    lit = C.light(sun=0.9, sky=1.1, screen=0.9, rgb=0.6, lamp=0.8)
    t = blur(C.tone(lit, 0.03, 0.7), 5 * C.s)
    mx, my = C.xx + C.noise(30, 5 * C.s), C.yy + C.noise(30, 5 * C.s)
    base = cv2.remap(blur(C.A, 2.2 * C.s), mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)   # 颜色洇出轮廓
    base = np.clip(sat(base, 0.92) * 0.8 + 0.2, 0, 1)
    wash = mix(hexc("#ffd9e4")[None, None], hexc("#bfe9e4")[None, None], np.clip(C.noise(220, 0.9) + 0.5, 0, 1))
    base = np.where(C.wall[..., None], mix(wash, base, 0.3), base)
    base = np.where(C.floor[..., None], mix(base, hexc("#c7c4ee")[None, None], 0.6), base)
    out = base * mix(hexc("#8fa6d8")[None, None] * 1.05, np.ones(3, np.float32)[None, None], np.clip(t * 1.5, 0, 1))
    out = out * (1 + C.noise(26, 0.07) + C.noise(4, 0.035))[..., None]                                  # 颜料沉淀
    gl = luma(base)
    pool = np.clip(np.abs(blur(gl, 1.2 * C.s) - blur(gl, 4 * C.s)) * 9, 0, 1)                          # 水渍边
    out = out * (1 - pool[..., None] * 0.3)
    out = mix(out, np.ones(3, np.float32)[None, None], np.clip((t - 0.72) * 2.4 + C.noise(40, 0.25), 0, 1) * 0.75)  # 留白
    out = out * C.paper("#fffaf0", 0.03, 0.03)
    ln = C.lines(0.9, 0.5, 0.35, wobble=1.8, vary=True, city=0.2)
    return mix(np.clip(out, 0, 1), hexc("#4a4660")[None, None], ln * 0.62)


def punk(C):
    lit = C.light(sun=1.4, sky=0.8, screen=1.0, rgb=0.4, lamp=1.2)
    g = (luma(C.A) * 0.7 + 0.3) * C.tone(lit, 0.0, 0.7) + C.noise(14, 0.06)
    xer = 1 - C.halftone(np.clip(1 - g * 1.25, 0, 1), 3.2, 0)                 # 复印机粗网
    xer = np.where(g < 0.16, 0, np.where(g > 0.82, 1, xer)).astype(np.float32)
    out = xer[..., None] * hexc("#f4f0e4")[None, None] + (1 - xer[..., None]) * hexc("#111014")
    pal = [hexc(c) for c in ("#ff2e88", "#f8f400", "#00d4ff", "#39ff14", "#ff6a00")]
    ids = {o["hot"]: None for o in C.meta["ids"] if o["hot"]}
    for i, name in enumerate(ids):                                             # 每个可点物件一块荧光色
        m = np.isin(C.K, [C.key[o["object"]] for o in C.meta["ids"] if o["hot"] == name])
        out = np.where(m[..., None], out * pal[i % len(pal)] * 1.05, out)
    out = np.where(C.wall[..., None], out * mix(hexc("#f8f400")[None, None], hexc("#ff2e88")[None, None], ((C.xx + C.yy) / (90 * C.s) % 2 < 1).astype(np.float32)), out)
    out = np.where(C.floor[..., None], out * hexc("#00d4ff"), out)
    hm = C.hotmask.astype(np.float32)
    cut = np.clip(dilate(hm, 5 * C.s) - hm, 0, 1)                             # 剪贴的白边 + 黑影
    sh = np.clip(np.roll(dilate(hm, 5 * C.s), (int(6 * C.s), int(6 * C.s)), (0, 1)) - dilate(hm, 5 * C.s), 0, 1)
    out = mix(out, hexc("#111014")[None, None], sh * 0.85)
    out = mix(out, hexc("#fffdf5")[None, None], cut)
    sc = np.zeros((C.H, C.W), np.float32)                                      # 涂鸦划痕
    for _ in range(40):
        p = C.rs.randint(0, [C.W, C.H], (1, 2)) + np.cumsum(C.rs.randint(-60, 60, (7, 2)) * C.s, 0)
        cv2.polylines(sc, [p.astype(np.int32)], False, 1.0, max(1, int(1.6 * C.s)))
    out = mix(out, hexc("#111014")[None, None], sc * 0.7 * ~C.hotmask)
    out = np.clip(out + C.E * 0.2 + C.grain(0.05)[..., None], 0, 1)
    return mix(out, hexc("#0c0b10")[None, None], C.lines(2.0, 0.9, 0.6, wobble=1.6))


def neon(C):
    lit = C.light(sun=0.0, sky=0.05, screen=2.4, rgb=3.2, lamp=0.5)
    out = (C.A * 0.9 + 0.1) * (np.clip(lit, 0, 1.4) * 0.8 + 0.07) * hexc("#8aa0ff") * 1.25
    out = np.where(C.wall[..., None], out + hexc("#1a1140") * 0.55, out)
    grid = ((C.xx % (56 * C.s) < 1.5 * C.s) | (C.yy % (56 * C.s) < 1.5 * C.s)).astype(np.float32)
    out = out + (grid * C.wall)[..., None] * hexc("#6b3cff") * 0.35
    out = np.where(C.city[..., None], C.A * hexc("#5b6cff") * 0.5 + (luma(C.A) > 0.7)[..., None] * hexc("#ffd27a") * 0.9, out)
    ln = C.lines(1.2, 0.7, 0.45, wobble=0.0, vary=False, city=0.25)
    hue = mix(hexc("#00f0ff")[None, None], hexc("#ff2bd6")[None, None], np.clip(C.xx / C.W + C.noise(300, 0.15), 0, 1))
    out = out * (1 - ln[..., None] * 0.6) + hue * ln[..., None] * 0.95 + hue * blur(ln, 5 * C.s)[..., None] * 0.9
    out = out + C.E * 1.1 + C.glow(8, 1.2) + C.glow(36, 0.9) * hexc("#ff9cf0")
    out = out * (0.86 + 0.14 * (np.floor(C.yy / (2 * C.s)) % 2))[..., None]   # 扫描线
    return np.clip(out, 0, 1)


def sketch(C):
    lit = C.light(sun=1.3, sky=0.9, screen=0.8, rgb=0.3, lamp=1.0)
    t = C.tone(lit, 0.02, 0.75) * (luma(C.A) * 0.5 + 0.5)
    out = C.paper("#e8d5ac", 0.06, 0.03)
    out = out * (1 - (1 - luma(C.A))[..., None] * 0.22 * hexc("#ffe7c2"))    # 淡淡一层赭石
    ink = hexc("#3d2616")[None, None]
    out = mix(out, ink, C.hatch(np.clip(0.75 - t, 0, 1) * 0.9, 5.5, 42, 2.0) * 0.8 * (t < 0.7))
    out = mix(out, ink, C.hatch(np.clip(0.45 - t, 0, 1) * 1.3, 5.5, -48, 2.0) * 0.8 * (t < 0.45))
    out = mix(out, ink, C.hatch(np.clip(0.22 - t, 0, 1) * 2.5, 4.0, 5, 2.0) * 0.8 * (t < 0.22))
    red = hexc("#a8402a")[None, None]
    out = mix(out, red, blur(C.e_outer * C.hotmask, 1.2 * C.s) * 0.35)        # 可点物件勾一道红粉笔
    out = mix(out, ink, C.lines(1.2, 0.75, 0.55, wobble=2.2, city=0.4) * 0.92)
    vig = np.clip(1 - 0.5 * (((C.xx / C.W - 0.5) ** 2 + (C.yy / C.H - 0.5) ** 2) * 2.4), 0, 1)
    return np.clip(out * vig[..., None] * (1 + C.noise(160, 0.05))[..., None], 0, 1)


PIXEL_PAL = ["#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179", "#29366f", "#3b5dc9", "#41a6f6", "#73eff7",
             "#f4f4f4", "#94b0c2", "#566c86", "#333c57", "#c2814f", "#8a5a34", "#ffe9b0", "#ff5d8f", "#7a4b2a", "#e8d5ac", "#d39a5c", "#f6f1e3"]


def pixel(C):
    lit = C.light(sun=1.0, sky=1.0, screen=1.1, rgb=1.0, lamp=1.0)
    t = C.tone(lit, 0.03, 0.7)
    lv = np.where(t > 0.5, 1.0, np.where(t > 0.22, 0.74, 0.5))[..., None]
    full = np.clip(sat(C.A, 1.25) * lv + C.E * 0.3, 0, 1)
    cw = 400
    ch = cw * C.H // C.W
    small = cv2.resize(full, (cw, ch), interpolation=cv2.INTER_AREA)
    ks = cv2.resize(C.K.astype(np.float32), (cw, ch), interpolation=cv2.INTER_NEAREST)
    edge = (ks != np.roll(ks, 1, 0)) | (ks != np.roll(ks, 1, 1))
    cm = cv2.resize(C.city.astype(np.float32), (cw, ch), interpolation=cv2.INTER_NEAREST) > 0.5
    small = np.where((edge & ~cm)[..., None], small * 0.3, small)
    bayer = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32) / 16 - 0.5
    small = np.clip(small + np.tile(bayer, (ch // 4 + 1, cw // 4 + 1))[:ch, :cw, None] * 0.09, 0, 1)
    pal = np.stack([hexc(c) for c in PIXEL_PAL])
    idx = np.argmin(((small[:, :, None, :] - pal[None, None]) ** 2).sum(-1), -1)
    return cv2.resize(pal[idx], (C.W, C.H), interpolation=cv2.INTER_NEAREST)


def void(C):
    lit = C.light(sun=1.2, sky=0.9, screen=0.8, rgb=0.3, lamp=1.0)
    t = C.tone(lit, 0.02, 0.7)
    out = np.ones_like(C.A) * hexc("#fbfaf6")
    la = luma(C.A)
    blot = blur(((la < 0.2) & ~C.city).astype(np.float32), 0.8 * C.s) > 0.5    # 深色块直接涂黑，像墨渍
    stip = (C.rs.uniform(0, 1, (C.H, C.W)) < np.clip(0.55 - t, 0, 1) * 0.5).astype(np.float32)
    stip = blur(dilate(stip, 0.6 * C.s), 0.5 * C.s)                             # 暗部点画
    out = mix(out, hexc("#111114")[None, None], np.clip(stip * 1.4, 0, 1) * ~C.wall * 0.9)
    out = np.where(blot[..., None], hexc("#111114"), out)
    acc = (luma(C.E) > 0.25) | C.mask("zine_echo", "echo_ring", "mug_band", "cam_ring", "shroom_cap")
    out = np.where(acc[..., None], hexc("#ff5a1f"), out)                        # 只留一个橙色
    dash = ((C.xx + C.yy) % (9 * C.s) < 4.5 * C.s)                              # 远处楼群画成虚线
    ln = C.lines(1.5, 0.8, 0.5, wobble=0.5, city=0.0)
    ln = np.maximum(ln, blur(C.e_city, 0.5 * C.s) * 0.75 * dash)
    ln = np.maximum(ln, C.brickline() * 0.3)
    out = np.where(blot[..., None], mix(out, np.ones(3, np.float32)[None, None] * 0.98, ln * 0.9), mix(out, hexc("#111114")[None, None], ln))
    return np.clip(out, 0, 1)


RENDER = {n: globals()[n] for n in STYLES}


def export_hot(C, out):
    """热点图：R = 序号×8（0 = 无）；顺带算每个热点的可见包围盒和中心。"""
    names = sorted({o["hot"] for o in C.meta["ids"] if o["hot"]})
    hot = np.zeros((C.H, C.W), np.uint8)
    info = {}
    for i, name in enumerate(names, 1):
        m = np.isin(C.K, [C.key[o["object"]] for o in C.meta["ids"] if o["hot"] == name])
        if not m.any():
            continue
        hot[m] = i * 8
        ys, xs = np.nonzero(m)
        info[name] = {"index": i, "bbox": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], "center": [float(xs.mean()), float(ys.mean())]}
    half = cv2.resize(hot, (C.W // 2, C.H // 2), interpolation=cv2.INTER_NEAREST)
    Image.fromarray(np.stack([half, half, half], -1)).save(out / "hot.png", optimize=True)
    scene = {"width": C.W, "height": C.H, "styles": STYLES, "hots": info, "surfaces": C.meta["surfaces"]}
    (out / "scene.json").write_text(json.dumps(scene, ensure_ascii=False))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    src, out = Path(args[0]), Path(args[1])
    only = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--only=")), STYLES)
    (out / "styles").mkdir(parents=True, exist_ok=True)
    C = Ctx(src)
    export_hot(C, out)
    for name in only:
        C.rs = np.random.RandomState(5)
        img = (np.clip(RENDER[name](C), 0, 1) * 255 + 0.5).astype(np.uint8)
        im = Image.fromarray(img)
        im.save(out / "styles" / f"{name}.webp", quality=84, method=5)
        im.resize((C.W // 2, C.H // 2), Image.NEAREST if name == "pixel" else Image.LANCZOS).save(out / "styles" / f"{name}@1x.webp", quality=80, method=5)
        print("STYLE", name)


if __name__ == "__main__":
    main()
