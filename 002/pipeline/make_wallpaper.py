# /// script
# dependencies = ["numpy", "pillow"]
# ///
"""原创壁纸：橙色枫树 + 日落海面。两块屏幕各渲一张（超宽 / 竖屏），供 Blender 贴到屏幕上。

用法：uv run pipeline/make_wallpaper.py <输出目录>
"""
import math
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SKY = [(0.0, (38, 118, 160)), (0.35, (92, 178, 196)), (0.62, (255, 214, 140)), (0.78, (255, 150, 70)), (1.0, (240, 96, 52))]
SEA = [(0.0, (255, 170, 92)), (0.25, (70, 160, 170)), (1.0, (24, 78, 110))]
TRUNK = (26, 30, 58)
FOLIAGE = [(232, 70, 28), (255, 106, 31), (255, 138, 42), (255, 176, 71), (198, 48, 30)]


def gradient(w, h, stops):
    ys = np.linspace(0, 1, h)[:, None]
    out = np.zeros((h, 1, 3), np.float32)
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = (ys >= p0) & (ys <= p1)
        t = np.clip((ys - p0) / max(p1 - p0, 1e-6), 0, 1)
        seg = np.array(c0, np.float32) * (1 - t) + np.array(c1, np.float32) * t
        out = np.where(m[..., None], seg[:, None, :], out)
    return Image.fromarray(np.repeat(out, w, axis=1).astype(np.uint8))


def bezier(p0, p1, p2, p3, n=60):
    for i in range(n + 1):
        t = i / n
        a, b, c, d = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3
        yield (a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1], t)


def limb(draw, pts, w0, w1, fill):
    for x, y, t in bezier(*pts):
        r = w0 * (1 - t) + w1 * t
        draw.ellipse((x - r, y - r, x + r, y + r), fill=fill)


def canopy(draw, rng, cx, cy, rx, ry, n, s):
    for _ in range(n):
        a, d = rng.uniform(0, math.tau), rng.random() ** 0.6
        x, y = cx + math.cos(a) * rx * d, cy + math.sin(a) * ry * d * 0.8
        r = rng.uniform(0.25, 1.0) * s
        col = FOLIAGE[min(len(FOLIAGE) - 1, int(rng.random() ** 1.3 * len(FOLIAGE)))]
        if y < cy - ry * 0.25:  # 顶部受光更亮
            col = FOLIAGE[rng.choice([2, 3, 1])]
        draw.ellipse((x - r, y - r * 0.8, x + r, y + r * 0.8), fill=col)


def render(w, h, seed=7):
    rng = random.Random(seed)
    u = min(w, h)
    horizon = int(h * 0.62)
    img = gradient(w, horizon, SKY)
    full = Image.new("RGB", (w, h))
    full.paste(img, (0, 0))
    full.paste(gradient(w, h - horizon, SEA), (0, horizon))

    # 云
    clouds = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(clouds)
    for _ in range(26):
        cx, cy = rng.uniform(-0.1, 1.1) * w, rng.uniform(0.04, 0.42) * h
        for _ in range(9):
            r = rng.uniform(0.03, 0.09) * u
            x, y = cx + rng.uniform(-0.12, 0.12) * u, cy + rng.uniform(-0.03, 0.03) * u
            cd.ellipse((x - r * 1.6, y - r * 0.7, x + r * 1.6, y + r * 0.7), fill=(255, 236, 224, rng.randint(70, 150)))
    full.paste(clouds.filter(ImageFilter.GaussianBlur(u * 0.012)), (0, 0), clouds.filter(ImageFilter.GaussianBlur(u * 0.012)))

    d = ImageDraw.Draw(full, "RGBA")
    # 太阳 + 光晕 + 海面倒影
    sx, sy, sr = w * 0.60, horizon - u * 0.03, u * 0.085
    for k in range(6, 0, -1):
        rr = sr * (1 + k * 0.35)
        d.ellipse((sx - rr, sy - rr, sx + rr, sy + rr), fill=(255, 226, 150, 22))
    d.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=(255, 244, 196, 255))
    for i in range(14):
        yy = horizon + (i + 0.5) * (h - horizon) / 16
        half = sr * (0.5 + i * 0.22) * rng.uniform(0.6, 1.0)
        d.rounded_rectangle((sx - half, yy, sx + half, yy + u * 0.006), radius=u * 0.003, fill=(255, 206, 130, 150))

    # 远山
    for base, col, amp in [(0.0, (60, 90, 140), 0.16), (0.02, (40, 62, 110), 0.11)]:
        pts, x = [(0, horizon)], 0.0
        while x < w:
            pts.append((x, horizon - rng.uniform(0.25, 1.0) * amp * u * (0.5 + 0.5 * math.sin(x / w * 5 + base * 40))))
            x += rng.uniform(0.04, 0.09) * w
        pts += [(w, horizon), (0, horizon)]
        d.polygon(pts, fill=col)

    # 前景山丘
    hill = [(w * 0.18, h), (w * 0.34, h * 0.86), (w * 0.52, h * 0.80), (w * 0.72, h * 0.83), (w, h * 0.74), (w, h)]
    d.polygon(hill, fill=(22, 46, 78))
    for _ in range(140):
        x = rng.uniform(0.24, 1.0) * w
        y = h * (0.80 + 0.2 * rng.random() ** 2) + (0.06 * h if x < w * 0.4 else 0)
        r = rng.uniform(0.004, 0.012) * u
        d.ellipse((x - r * 2, y - r, x + r * 2, y + r), fill=rng.choice(FOLIAGE[1:4]) + (230,))

    # 树干：从右下向左上扭出去
    bx, by = w * 0.66, h * 0.86
    limb(d, [(bx, by), (bx - u * 0.02, by - u * 0.22), (bx + u * 0.16, by - u * 0.30), (bx + u * 0.02, by - u * 0.46)], u * 0.035, u * 0.022, TRUNK)
    top = (bx + u * 0.02, by - u * 0.46)
    limb(d, [top, (top[0] - u * 0.12, top[1] - u * 0.10), (top[0] - u * 0.30, top[1] - u * 0.02), (top[0] - u * 0.46, top[1] - u * 0.10)], u * 0.022, u * 0.008, TRUNK)
    limb(d, [top, (top[0] + u * 0.05, top[1] - u * 0.14), (top[0] + u * 0.18, top[1] - u * 0.14), (top[0] + u * 0.28, top[1] - u * 0.20)], u * 0.02, u * 0.007, TRUNK)
    limb(d, [top, (top[0] - u * 0.02, top[1] - u * 0.12), (top[0] - u * 0.10, top[1] - u * 0.22), (top[0] - u * 0.16, top[1] - u * 0.26)], u * 0.016, u * 0.006, TRUNK)
    # 树冠
    for cx, cy, rx, ry, n in [(-0.34, -0.14, 0.26, 0.11, 420), (-0.10, -0.26, 0.24, 0.12, 420), (0.20, -0.20, 0.20, 0.10, 320), (-0.52, -0.06, 0.12, 0.06, 160), (0.02, -0.12, 0.14, 0.06, 160)]:
        canopy(d, rng, top[0] + cx * u, top[1] + cy * u, rx * u, ry * u, n, u * 0.022)
    # 落叶
    for _ in range(70):
        x, y, r = rng.uniform(0, w), rng.uniform(0.05, 0.95) * h, rng.uniform(0.004, 0.009) * u
        d.ellipse((x - r * 1.6, y - r, x + r * 1.6, y + r), fill=rng.choice(FOLIAGE[:4]) + (235,))
    return full


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    out.mkdir(parents=True, exist_ok=True)
    render(2370, 1000).save(out / "wallpaper-wide.png")
    render(1000, 1740, seed=11).save(out / "wallpaper-tall.png")
    print("ok", out)
