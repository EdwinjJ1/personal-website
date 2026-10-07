# /// script
# dependencies = ["numpy", "pillow"]
# ///
"""场景里所有“印刷品”的贴图：软木板、剪报、海报、项目刊物、笔记本、屏幕、砖墙、木纹、楼体。

用法：uv run pipeline/textures.py blender/tex
内容全部来自简历；改文案改这里，然后重跑 Blender。
"""
import json
import math
import random
import re
import sys
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from make_wallpaper import render as wallpaper

SUP = "/System/Library/Fonts/Supplemental/"
FONTS = {
    "impact": SUP + "Impact.ttf", "black": SUP + "Arial Black.ttf", "hand": SUP + "Bradley Hand Bold.ttf",
    "marker": "/System/Library/Fonts/MarkerFelt.ttc", "mono": SUP + "Courier New Bold.ttf", "serif": SUP + "Times New Roman Bold.ttf",
    "din": SUP + "DIN Condensed Bold.ttf", "slab": SUP + "Rockwell.ttc", "cjk": "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "sans": "/System/Library/Fonts/HelveticaNeue.ttc", "body": SUP + "Georgia.ttf",
}
INK, PAPER, NEWS = (24, 24, 28), (255, 250, 240), (238, 232, 216)
RED, BLUE, YELLOW, GREEN, PINK, ORANGE = (229, 72, 77), (43, 107, 228), (255, 214, 64), (48, 164, 108), (255, 170, 196), (255, 122, 61)


@lru_cache(maxsize=None)
def font(name, size):
    return ImageFont.truetype(FONTS[name], size, index=2 if name in ("slab",) else 0)


def fit(draw, text, name, box_w, size):
    """从 size 往下缩，直到一行放得进 box_w。"""
    while size > 8 and draw.textlength(text, font=font(name, size)) > box_w:
        size -= 2
    return font(name, size)


def paper(w, h, color, grain=7, seed=0):
    rs = np.random.RandomState(seed)
    a = np.clip(np.array(color, np.float32)[None, None] + rs.normal(0, grain, (h, w, 1)), 0, 255)
    return Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))


def wrap(d, text, fnt, width):
    """按宽度折行：英文按词，中文按字。"""
    lines, line = [], ""
    for token in re.findall(r"[A-Za-z0-9'’\-.,:;!?%$¥()\"/×·+&]+|\s+|.", text):
        token = " " if token.isspace() else token
        if d.textlength(line + token, font=fnt) > width and line.strip():
            lines.append(line.rstrip())
            line = token.lstrip()
        else:
            line += token
    if line.strip():
        lines.append(line.rstrip())
    return lines


def body(d, box, text, name="body", size=25, fill=(44, 42, 40), gap=1.24, max_lines=99):
    """在框里排一段真实正文；放不下的行直接不画（不拿灰条充数）。返回排完后的 y。"""
    x0, y0, x1, y1 = box
    fnt, y = font(name, size), y0
    for ln in wrap(d, text, fnt, x1 - x0)[:max_lines]:
        if y + size > y1:
            break
        d.text((x0, y), ln, font=fnt, fill=fill)
        y += size * gap
    return y


def dots(gray, tint, bg):
    """灰度数组（0..1，1 = 亮）→ 报纸网点图。"""
    h, w = gray.shape
    cell = max(5, w // 46)
    yy, xx = np.mgrid[0:h, 0:w]
    u, v = (xx * 0.707 + yy * 0.707) / cell, (-xx * 0.707 + yy * 0.707) / cell
    dist = np.hypot(u - np.floor(u) - 0.5, v - np.floor(v) - 0.5)
    mask = (dist < np.sqrt(np.clip(1 - gray, 0, 1)) * 0.62)[..., None]
    return Image.fromarray(np.where(mask, np.array(tint, np.uint8), np.array(bg, np.uint8)).astype(np.uint8))


def halftone(w, h, seed, tint=INK, bg=NEWS, kind="city", image=None):
    """“新闻照片”。给了 image 就用真图打网点；否则按 kind 画一个图标式的构图。"""
    if image is not None:
        src = ImageOps.autocontrast(ImageOps.fit(image.convert("L"), (w, h), Image.LANCZOS, centering=(0.5, 0.4)), cutoff=2)
        return dots(np.asarray(src, np.float32) / 255, tint, bg)
    rng = random.Random(seed)
    g = Image.new("L", (w, h), 200)
    d = ImageDraw.Draw(g)
    for y in range(h):
        d.line((0, y, w, y), fill=int(235 - 120 * y / h))
    if kind == "city":
        x = 0
        while x < w:
            bw, bh = rng.randint(w // 12, w // 6), rng.randint(h // 4, int(h * 0.85))
            d.rectangle((x, h - bh, x + bw, h), fill=rng.randint(20, 90))
            x += bw + rng.randint(0, 6)
    elif kind == "bars":
        d.ellipse((w * 0.2, h * 0.08, w * 0.8, h * 0.92), fill=25)
        for i, k in enumerate((0.4, 0.72, 0.5)):
            cx = w * (0.38 + 0.12 * i)
            d.rounded_rectangle((cx - w * 0.035, h * (0.5 - k / 2.4), cx + w * 0.035, h * (0.5 + k / 2.4)), radius=w * 0.035, fill=245)
    elif kind == "cup":
        d.polygon([(w * 0.3, h * 0.15), (w * 0.7, h * 0.15), (w * 0.6, h * 0.55), (w * 0.4, h * 0.55)], fill=40)
        d.rectangle((w * 0.47, h * 0.55, w * 0.53, h * 0.75), fill=40)
        d.rectangle((w * 0.36, h * 0.75, w * 0.64, h * 0.86), fill=30)
    elif kind == "podium":
        for i, (x0, top, label) in enumerate(((0.16, 0.50, "2"), (0.39, 0.30, "1"), (0.62, 0.62, "3"))):
            d.rectangle((w * x0, h * top, w * (x0 + 0.22), h), fill=(60, 30, 85)[i])
            d.text((w * (x0 + 0.11), h * (top + 0.16)), label, font=font("black", int(h * 0.2)), fill=240, anchor="mm")
    elif kind == "person":
        d.ellipse((w * 0.36, h * 0.14, w * 0.64, h * 0.52), fill=40)
        d.ellipse((w * 0.12, h * 0.56, w * 0.88, h * 1.5), fill=30)
    return dots(np.asarray(g.filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255, tint, bg)


def stick(dst, src, center, angle=0.0, shadow=10):
    """把一张纸贴到底图上：旋转 + 投影。"""
    src = src.convert("RGBA").rotate(angle, expand=True, resample=Image.BICUBIC)
    x, y = int(center[0] - src.width / 2), int(center[1] - src.height / 2)
    if shadow:
        sh = Image.new("RGBA", src.size, (0, 0, 0, 0))
        sh.putalpha(src.getchannel("A").point(lambda a: a * 0.35))
        dst.paste(sh.filter(ImageFilter.GaussianBlur(shadow * 0.6)), (x + shadow // 2, y + shadow), sh.filter(ImageFilter.GaussianBlur(shadow * 0.6)))
    dst.paste(src, (x, y), src)


def pin(d, x, y, col, r=13):
    d.ellipse((x - r + 3, y - r + 5, x + r + 3, y + r + 5), fill=(0, 0, 0, 70))
    d.ellipse((x - r, y - r, x + r, y + r), fill=col, outline=INK, width=2)
    d.ellipse((x - r * 0.45, y - r * 0.55, x - r * 0.05, y - r * 0.15), fill=(255, 255, 255, 210))


def card(w, h, color=PAPER, border=0, seed=0):
    im = paper(w, h, color, seed=seed)
    if border:
        ImageDraw.Draw(im).rectangle((border, border, w - border - 1, h - border - 1), outline=INK, width=3)
    return im


ASSETS = Path(__file__).resolve().parent.parent / "site/assets"


def avatar():
    """旧站公开使用的头像；仓库里没有 001 时返回 None，退回剪影。"""
    f = ASSETS.parent.parent.parent / "001/public/profile.jpg"
    return Image.open(f) if f.exists() else None


def photo(pid):
    """导入的摄影作品（import_photos.py 的产物）；还没导入就返回 None，退回网点假照片。"""
    f = ASSETS / "photos" / f"{pid}.webp"
    return Image.open(f).convert("RGB") if f.exists() else None


def polaroid(kind, caption, seed, size=300, pid=None):
    im = card(size, int(size * 1.2), (252, 250, 246), seed=seed)
    real = photo(pid) if pid else None
    if real:
        side = min(real.size)
        box = ((real.width - side) // 2, (real.height - side) // 2, (real.width + side) // 2, (real.height + side) // 2)
        ph = real.crop(box).resize((size - 36, size - 36), Image.LANCZOS)
    else:
        ph = halftone(size - 36, size - 36, seed, tint=(30, 34, 52), bg=(214, 226, 236), kind=kind)
    im.paste(ph, (18, 18))
    d = ImageDraw.Draw(im)
    d.rectangle((18, 18, size - 19, size - 19), outline=INK, width=2)
    d.text((size / 2, size * 1.07), caption, font=fit(d, caption, "hand", size - 30, 30), fill=INK, anchor="mm")
    return im


def lines_text(d, xy, text, name, size, fill=INK, spacing=1.12, anchor="la"):
    x, y = xy
    for ln in text.split("\n"):
        d.text((x, y), ln, font=font(name, size), fill=fill, anchor=anchor)
        y += size * spacing
    return y


# ───────────────────────── 软木板 ─────────────────────────
def board(w=2400, h=1176):
    rng = random.Random(3)
    im = paper(w, h, (211, 154, 92), grain=16, seed=1)
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(2600):  # 软木颗粒
        x, y, r = rng.uniform(0, w), rng.uniform(0, h), rng.uniform(1, 3.5)
        d.ellipse((x - r, y - r, x + r, y + r), fill=rng.choice([(176, 120, 66, 150), (232, 184, 124, 130), (150, 98, 52, 120)]))

    # 标题条：WHO IS / EVAN?
    for txt, col, cx, cy, ang, fs in (("WHO IS", PAPER, 1010, 150, 3, 96), ("EVAN?", YELLOW, 1330, 162, -3, 108)):
        f = font("marker", fs)
        tw = int(d.textlength(txt, font=f)) + 56
        strip = card(tw, fs + 36, col, border=4, seed=fs)
        ImageDraw.Draw(strip).text((tw / 2, (fs + 36) / 2), txt, font=f, fill=INK, anchor="mm")
        stick(im, strip, (cx, cy), ang)

    # 名牌
    name = card(560, 360, (255, 252, 244), border=10, seed=5)
    nd = ImageDraw.Draw(name)
    nd.rectangle((22, 22, 537, 337), outline=INK, width=2)
    nd.text((280, 118), "EVAN", font=font("black", 138), fill=INK, anchor="mm")
    nd.text((280, 214), "贾 岱 林", font=font("cjk", 46), fill=INK, anchor="mm")
    nd.rectangle((60, 250, 500, 253), fill=INK)
    nd.text((280, 282), "AI PM × AGENT BUILDER", font=font("din", 40), fill=RED, anchor="mm")
    nd.text((280, 320), "UNSW CS · SYDNEY / SHANGHAI", font=font("mono", 19), fill=INK, anchor="mm")
    stick(im, name, (1160, 470), -1.5)

    # 拍立得
    stick(im, polaroid("bars", "echo agent", 11), (250, 250), -7)
    stick(im, polaroid("city", "sydney", 12, pid=4), (590, 230), 5)
    stick(im, polaroid("cup", "athena · prize", 13, size=250), (700, 560), -4)

    # 便签
    def sticky(text, col, size, fs, name_="marker", fill=INK):
        s = card(size[0], size[1], col, seed=fs)
        lines_text(ImageDraw.Draw(s), (22, 20), text, name_, fs, fill)
        return s

    stick(im, sticky("NOW:\nAI PM intern\n@ MOSI · MosMos\nvoice agent", YELLOW, (330, 250), 40), (250, 640), 4)
    stick(im, sticky("BORN 2006.05\n17 → CEO, Hypha\n19 → UNSW CS\n20 → shipping\n     voice agents", (196, 228, 255), (320, 230), 27, "mono"), (410, 930), -3)
    stick(im, sticky("SHIP FAST.\nSTAY USEFUL.", PINK, (330, 170), 46), (1010, 800), 3)
    tag = card(300, 78, (88, 214, 141), seed=9)
    ImageDraw.Draw(tag).text((150, 39), "OPEN TO WORK", font=font("impact", 46), fill=INK, anchor="mm")
    stick(im, tag, (1380, 760), -5)

    # WHAT I CAN BUILD
    wc = card(520, 520, (255, 252, 244), border=8, seed=21)
    wd = ImageDraw.Draw(wc)
    wd.rectangle((8, 8, 511, 96), fill=INK)
    wd.text((260, 52), "WHAT I CAN BUILD", font=font("impact", 54), fill=PAPER, anchor="mm")
    for i, (a, b) in enumerate((("VOICE AGENTS", "Echo Agent · MosMos"), ("AGENT TOOLING", "Roundtable · Chiron"), ("MOBILE + BACKEND", "Expo · Next.js · Stripe"), ("0 TO 1 PRODUCTS", "PM who ships code"))):
        y = 122 + i * 96
        wd.text((34, y), f"0{i + 1}", font=font("black", 40), fill=RED)
        wd.text((118, y - 2), a, font=font("din", 46), fill=INK)
        wd.text((118, y + 44), b, font=font("mono", 22), fill=(70, 70, 76))
        wd.line((34, y + 80, 486, y + 80), fill=(190, 186, 176), width=2)
    stick(im, wc, (1830, 400), 2)

    # MOSI 工牌 + 收录贴纸
    mc = card(230, 320, (255, 255, 255), border=6, seed=31)
    md = ImageDraw.Draw(mc)
    md.rectangle((6, 6, 223, 84), fill=INK)
    md.text((115, 46), "MOSI", font=font("black", 50), fill=PAPER, anchor="mm")
    for gx, gy in ((2, 0), (3, 0), (1, 1), (2, 1), (3, 1), (1, 2), (3, 2), (0, 3), (2, 2), (3, 3), (2, 3)):
        md.rectangle((66 + gx * 26, 108 + gy * 26, 66 + gx * 26 + 24, 108 + gy * 26 + 24), fill=INK)
    md.text((115, 246), "AI PM INTERN", font=font("din", 34), fill=INK, anchor="mm")
    md.text((115, 284), "2026 · SHANGHAI", font=font("mono", 18), fill=RED, anchor="mm")
    stick(im, mc, (2240, 330), -4)
    cx, cy, r = 2210, 690, 118
    pts = [(cx + math.cos(i * math.pi / 14) * (r if i % 2 else r * 0.86), cy + math.sin(i * math.pi / 14) * (r if i % 2 else r * 0.86)) for i in range(28)]
    d.polygon([(x + 6, y + 9) for x, y in pts], fill=(0, 0, 0, 80))
    d.polygon(pts, fill=RED, outline=INK)
    d.text((cx, cy - 26), "61.7k", font=font("impact", 74), fill=PAPER, anchor="mm")
    d.text((cx, cy + 34), "STARS · INDIE LIST", font=font("din", 30), fill=YELLOW, anchor="mm")

    # 红线把照片、名牌、能力卡连起来
    path = [(250, 110), (590, 96), (1160, 300), (1830, 152), (2240, 180)]
    d.line(path, fill=(200, 30, 40, 255), width=5, joint="curve")
    for (x, y), c in zip(path, (RED, BLUE, YELLOW, GREEN, RED)):
        pin(d, x, y, c)
    for x, y, c in ((250, 530, BLUE), (1010, 730, RED), (1380, 730, YELLOW), (700, 440, GREEN), (410, 830, RED)):
        pin(d, x, y, c, r=11)

    # 右上角蛛网 + 蜘蛛贴纸（致敬蜘蛛侠平行宇宙）
    ox, oy = w - 6, 6
    for k in range(7):
        ang = math.pi / 2 + k * (math.pi / 2) / 6
        d.line((ox, oy, ox + math.cos(ang) * 330, oy + math.sin(ang) * 330), fill=(250, 248, 240, 235), width=3)
    for rr in (70, 130, 195, 265, 330):
        pts = [(ox + math.cos(math.pi / 2 + k * (math.pi / 2) / 6) * rr * (0.92 if k % 2 else 1.0), oy + math.sin(math.pi / 2 + k * (math.pi / 2) / 6) * rr * (0.92 if k % 2 else 1.0)) for k in range(7)]
        d.line(pts, fill=(250, 248, 240, 235), width=3, joint="curve")
    sx, sy = 1560, 800
    d.ellipse((sx - 74, sy - 66, sx + 86, sy + 94), fill=(0, 0, 0, 80))
    d.ellipse((sx - 80, sy - 80, sx + 80, sy + 80), fill=RED, outline=INK, width=5)
    for sd in (-1, 1):
        for j, (a0, a1) in enumerate(((-70, -30), (-40, -5), (20, 55), (45, 85))):
            p1 = (sx + sd * 22, sy - 14 + j * 12)
            p2 = (sx + sd * (22 + 34), sy - 14 + j * 12 + math.tan(math.radians(a0)) * 18)
            p3 = (sx + sd * (22 + 52), sy - 14 + j * 12 + math.tan(math.radians(a1)) * 30)
            d.line((p1, p2, p3), fill=INK, width=7, joint="curve")
    d.ellipse((sx - 20, sy - 44, sx + 20, sy - 8), fill=INK)
    d.ellipse((sx - 27, sy - 14, sx + 27, sy + 58), fill=INK)

    # 底部一行：小彩灯 + EVAN 四个词
    for i in range(24):
        x = 620 + i * 72
        y = 978 + 14 * math.sin(i * 0.9)
        d.line((x, y, x + 72, 978 + 14 * math.sin((i + 1) * 0.9)), fill=INK, width=3)
        d.ellipse((x - 11, y + 2, x + 11, y + 30), fill=[RED, YELLOW, GREEN, BLUE, PINK][i % 5], outline=INK, width=2)
    x = 640
    for word in ("EXPLORE", "VOICE", "AGENTS", "NEXT"):
        d.text((x, 1040), word[0], font=font("marker", 104), fill=INK)
        x += d.textlength(word[0], font=font("marker", 104)) + 4
        d.text((x, 1082), word[1:], font=font("marker", 50), fill=INK)
        x += d.textlength(word[1:], font=font("marker", 50)) + 58
    return im


# ───────────────────────── 剪报 / 海报 ─────────────────────────
def clipping(headline, sub, kind, seed, text, w=640, h=820, masthead="THE DAILY ECHO", image=None):
    """一张剪报：报头、大标题、导语、配图，下面是一段真实的报道正文。"""
    im = paper(w, h, NEWS, grain=9, seed=seed)
    d = ImageDraw.Draw(im)
    d.text((w / 2, 44), masthead, font=font("serif", 46), fill=INK, anchor="mm")
    d.rectangle((24, 76, w - 24, 80), fill=INK)
    d.rectangle((24, 86, w - 24, 88), fill=INK)
    y, f = 104, font("impact", 70)
    for line in wrap(d, headline, f, w - 56):
        d.text((28, y), line, font=f, fill=INK)
        y += 74
    d.text((28, y + 6), sub, font=fit(d, sub, "mono", w - 56, 26), fill=RED)
    y += 48
    ph = int(h * 0.23)
    im.paste(halftone(w - 56, ph, seed, kind=kind, image=image), (28, y))
    d.rectangle((28, y, w - 29, y + ph), outline=INK, width=3)
    body(d, (28, y + ph + 16, w - 28, h - 20), text, size=25)
    return im


def poster(w=640, h=900):
    im = paper(w, h, (240, 222, 178), grain=12, seed=77)
    d = ImageDraw.Draw(im)
    d.rectangle((18, 18, w - 19, h - 19), outline=INK, width=8)
    d.text((w / 2, 112), "HIRE!", font=font("slab", 150), fill=INK, anchor="mm")
    d.rectangle((40, 196, w - 40, 204), fill=INK)
    d.text((w / 2, 244), "OPEN TO OPPORTUNITIES", font=fit(d, "OPEN TO OPPORTUNITIES", "impact", w - 90, 60), fill=RED, anchor="mm")
    im.paste(halftone(w - 200, 330, 5, bg=(240, 222, 178), kind="person", image=avatar()), (100, 290))
    d.rectangle((100, 290, w - 101, 620), outline=INK, width=5)
    d.text((w / 2, 672), "EVAN JIA", font=font("black", 74), fill=INK, anchor="mm")
    d.text((w / 2, 742), "AI PM × AGENT BUILDER", font=font("din", 54), fill=INK, anchor="mm")
    d.rectangle((40, 782, w - 40, 788), fill=INK)
    d.text((w / 2, 832), "REWARD: SHIPPED PRODUCTS", font=fit(d, "REWARD: SHIPPED PRODUCTS", "impact", w - 90, 52), fill=RED, anchor="mm")
    return im


# ───────────────────────── 项目刊物（桌上的“漫画”） ─────────────────────────
def zine(title, issue, tagline, bg, accent, motif, w=660, h=900):
    im = paper(w, h, bg, grain=6, seed=issue)
    d = ImageDraw.Draw(im, "RGBA")
    yy, xx = np.mgrid[0:h, 0:w]  # 封面底网点
    dots = (np.hypot((xx % 26) - 13, (yy % 26) - 13) < 4 + 5 * yy / h)
    arr = np.asarray(im).copy()
    arr[dots] = (arr[dots] * 0.82).astype(np.uint8)
    im = Image.fromarray(arr)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle((0, 0, w, 190), fill=accent)
    d.rectangle((0, 190, w, 198), fill=INK)
    d.text((w / 2 + 4, 99), title, font=fit(d, title, "impact", w - 60, 150), fill=INK, anchor="mm")
    d.text((w / 2, 95), title, font=fit(d, title, "impact", w - 60, 150), fill=PAPER, anchor="mm")
    d.rounded_rectangle((26, 222, 150, 318), radius=8, fill=PAPER, outline=INK, width=4)
    d.text((88, 250), f"#{issue:02d}", font=font("black", 40), fill=INK, anchor="mm")
    d.text((88, 292), "2026", font=font("mono", 24), fill=RED, anchor="mm")
    cx, cy, r = w / 2, 540, 200
    d.ellipse((cx - r + 10, cy - r + 14, cx + r + 10, cy + r + 14), fill=(0, 0, 0, 90))
    if motif == "bars":
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=INK)
        for i, k in enumerate((0.42, 0.76, 0.54)):
            bx = cx + (i - 1) * 78
            d.rounded_rectangle((bx - 24, cy - r * k, bx + 24, cy + r * k), radius=24, fill=PAPER)
    elif motif == "table":
        d.ellipse((cx - r, cy - r * 0.72, cx + r, cy + r * 0.72), fill=(244, 227, 193), outline=INK, width=8)
        d.ellipse((cx - 70, cy - 50, cx + 70, cy + 50), fill=BLUE, outline=INK, width=6)
        for i, c in enumerate((RED, YELLOW, GREEN, BLUE, (142, 78, 198), ORANGE)):
            a = i * math.tau / 6 + 0.4
            px, py = cx + math.cos(a) * r * 1.02, cy + math.sin(a) * r * 0.76
            d.ellipse((px - 40, py - 62, px + 40, py + 18), fill=c, outline=INK, width=6)
    elif motif == "owl":
        d.polygon([(cx, cy - r), (cx + r * 0.9, cy - r * 0.5), (cx + r * 0.7, cy + r * 0.6), (cx, cy + r), (cx - r * 0.7, cy + r * 0.6), (cx - r * 0.9, cy - r * 0.5)], fill=YELLOW, outline=INK)
        for s in (-1, 1):
            d.ellipse((cx + s * 78 - 62, cy - 90, cx + s * 78 + 62, cy + 34), fill=PAPER, outline=INK, width=8)
            d.ellipse((cx + s * 78 - 24, cy - 52, cx + s * 78 + 24, cy - 4), fill=INK)
        d.polygon([(cx - 26, cy + 30), (cx + 26, cy + 30), (cx, cy + 86)], fill=ORANGE, outline=INK)
    elif motif == "notes":
        for i, c in enumerate(((255, 255, 255), (255, 244, 200), (255, 255, 255))):
            ox = (i - 1) * 46
            d.rectangle((cx - 150 + ox, cy - 190 + i * 30, cx + 150 + ox, cy + 150 + i * 30), fill=c, outline=INK, width=6)
        lines_text(d, (cx - 96, cy - 84), "Pointers & malloc\nLinked lists\nRecursion\nShell + regex\nMIPS basics", "hand", 36, fill=(40, 40, 52), spacing=1.26)
    d.rectangle((0, h - 120, w, h), fill=INK)
    d.text((w / 2, h - 60), tagline, font=fit(d, tagline, "din", w - 50, 60), fill=YELLOW, anchor="mm")
    d.rectangle((0, 0, w - 1, h - 1), outline=INK, width=6)
    return im


# ───────────────────────── 笔记本 / 屏幕 / 小纸片 ─────────────────────────
def notebook(w=1400, h=980):
    rng = random.Random(8)
    im = paper(w, h, (252, 248, 236), grain=5, seed=8)
    d = ImageDraw.Draw(im)
    d.rectangle((w / 2 - 3, 0, w / 2 + 3, h), fill=(205, 198, 182))
    for y in range(90, h - 40, 46):
        d.line((40, y, w / 2 - 30, y), fill=(206, 220, 236), width=2)

    def wobble(p0, p1, width=5):
        n = 8
        pts = [(p0[0] + (p1[0] - p0[0]) * i / n + rng.uniform(-2.5, 2.5), p0[1] + (p1[1] - p0[1]) * i / n + rng.uniform(-2.5, 2.5)) for i in range(n + 1)]
        d.line(pts, fill=INK, width=width, joint="curve")

    def sketch_box(x, y, bw, bh, label, fill=None):
        if fill:
            d.rectangle((x + 4, y + 4, x + bw - 4, y + bh - 4), fill=fill)
        for a, b in (((x, y), (x + bw, y)), ((x + bw, y), (x + bw, y + bh)), ((x + bw, y + bh), (x, y + bh)), ((x, y + bh), (x, y))):
            wobble(a, b)
        d.text((x + bw / 2, y + bh / 2), label, font=fit(d, label, "hand", bw - 20, 40), fill=INK, anchor="mm")

    d.text((60, 30), "echo — how it works", font=font("hand", 46), fill=RED)
    flow = [("Fn+Space", YELLOW), ("local ASR", None), ("agent loop", (196, 228, 255)), ("echoctl tools", None)]
    for i, (lb, col) in enumerate(flow):
        y = 120 + i * 150
        sketch_box(110, y, 300, 92, lb, col)
        if i < 3:
            wobble((260, y + 96), (260, y + 146), 4)
            d.polygon([(248, y + 134), (272, y + 134), (260, y + 152)], fill=INK)
    for j, lb in enumerate(("Claude Code", "Codex", "capture")):
        sketch_box(470, 430 + j * 120, 190, 80, lb, PINK if j < 2 else None)
        wobble((412, 615), (468, 470 + j * 120), 3)
    d.text((70, 760), "voice in, work out.\nno window switching!", font=font("hand", 44), fill=INK)

    x0 = w / 2 + 60
    d.text((x0, 40), "Evan.", font=font("hand", 110), fill=INK)
    d.line((x0, 168, x0 + 300, 160), fill=RED, width=6)
    for i, (txt, done) in enumerate((("ship echo v0.1.38", True), ("mobile remote (E2E)", True), ("Athena: prize!", True), ("MosMos: selection Q&A", True), ("personal site, 10 styles", False), ("iOS on App Store", False))):
        y = 230 + i * 86
        d.rectangle((x0, y, x0 + 46, y + 46), outline=INK, width=5)
        if done:
            d.line((x0 + 6, y + 24, x0 + 20, y + 40, x0 + 54, y - 8), fill=RED, width=8)
        d.text((x0 + 70, y - 2), txt, font=fit(d, txt, "hand", w / 2 - 170, 42), fill=INK)
    sx, sy = w - 150, 820  # 小星星
    d.polygon([(sx + math.cos(i * math.pi / 5 - math.pi / 2) * (70 if i % 2 == 0 else 30), sy + math.sin(i * math.pi / 5 - math.pi / 2) * (70 if i % 2 == 0 else 30)) for i in range(10)], fill=YELLOW, outline=INK)
    return im


def screen(w=1600, h=1000):
    im = wallpaper(w, h, seed=7).convert("RGB")
    d = ImageDraw.Draw(im, "RGBA")
    d.rounded_rectangle((120, 150, w - 120, h - 130), radius=36, fill=(14, 14, 18, 236), outline=(255, 255, 255, 60), width=3)
    x = 180
    for ch, col in zip("TALK TO ME", [RED, YELLOW, PAPER, PINK, None, ORANGE, YELLOW, None, PAPER, RED]):  # 拼贴字母标题
        if col:
            d.rectangle((x, 196, x + 62, 268), fill=col)
            d.text((x + 31, 232), ch, font=font("impact", 58), fill=INK, anchor="mm")
        x += 70 if col else 28
    d.text((w / 2, 440), "Hi, I'm Evan.", font=font("serif", 170), fill=(255, 122, 61), anchor="mm")
    d.text((w / 2, 580), "AI PM who ships voice agents. Ask me anything.", font=font("mono", 38), fill=(235, 235, 240), anchor="mm")
    cx = 190
    for chip in ("Who are you?", "What is Echo Agent?", "Show me the résumé", "Why 10 styles?"):
        tw = d.textlength(chip, font=font("mono", 30)) + 48
        d.rounded_rectangle((cx, 690, cx + tw, 750), radius=10, outline=(255, 255, 255, 150), width=3)
        d.text((cx + tw / 2, 720), chip, font=font("mono", 30), fill=PAPER, anchor="mm")
        cx += tw + 22
    d.rounded_rectangle((w / 2 - 250, 44, w / 2 + 250, 116), radius=36, fill=(20, 20, 24, 240))  # 回声胶囊
    d.ellipse((w / 2 - 226, 62, w / 2 - 190, 98), fill=RED)
    d.text((w / 2 + 16, 80), "Fn+Space · listening…", font=font("mono", 30), fill=PAPER, anchor="mm")
    return im


def phone(w=470, h=1010):
    """回声手机端的首页，文案和官网手机版页面一致。"""
    im = Image.new("RGB", (w, h), (18, 18, 22))
    d = ImageDraw.Draw(im)
    d.text((34, 56), "回声", font=font("cjk", 56), fill=PAPER)
    d.ellipse((36, 150, 56, 170), fill=GREEN)
    d.text((70, 143), "你的 MacBook Pro · 在线", font=font("cjk", 28), fill=(190, 192, 200))
    d.text((34, 204), "会话", font=font("cjk", 30), fill=(150, 152, 160))
    for i, (a, b, col) in enumerate((("回声", "正在回答…", PAPER), ("Claude Code", "1 个在跑", ORANGE), ("Codex", "1 个等你批准", YELLOW))):
        y = 256 + i * 142
        d.rounded_rectangle((26, y, w - 26, y + 122), radius=22, fill=(34, 34, 40))
        d.ellipse((48, y + 35, 100, y + 87), fill=col)
        d.text((122, y + 22), a, font=font("cjk", 36), fill=PAPER)
        d.text((122, y + 70), b, font=font("cjk", 28), fill=(180, 182, 190))
    d.rounded_rectangle((26, 700, w - 26, 772), radius=22, outline=(120, 122, 130), width=3)
    d.text((w / 2, 736), "新任务", font=font("cjk", 32), fill=PAPER, anchor="mm")
    d.ellipse((w / 2 - 76, h - 216, w / 2 + 76, h - 64), fill=RED)
    for i, k in enumerate((0.4, 0.75, 0.5)):
        bx = w / 2 + (i - 1) * 34
        d.rounded_rectangle((bx - 10, h - 140 - 56 * k, bx + 10, h - 140 + 56 * k), radius=10, fill=PAPER)
    d.text((w / 2, h - 34), "按住跟回声说", font=font("cjk", 26), fill=(170, 172, 180), anchor="mm")
    return im


def small_papers(out):
    for i, (txt, col) in enumerate((("CLICK THE\nKEYBOARD.\nTALK TO ME.", YELLOW), ("PICK A ZINE.\nPRESS PLAY.", YELLOW), ("TAP THE MASK\n>> NEW\nUNIVERSE", PINK))):
        s = card(360, 300, col, seed=40 + i)
        lines_text(ImageDraw.Draw(s), (24, 26), txt, "marker", 56)
        s.save(out / f"sticky_{i}.png")
    c = card(700, 400, (255, 255, 255), border=6, seed=50)
    d = ImageDraw.Draw(c)
    d.rectangle((6, 6, 180, 393), fill=INK)
    for i, k in enumerate((0.4, 0.75, 0.5)):
        d.rounded_rectangle((60 + i * 34 - 11, 200 - 110 * k, 60 + i * 34 + 11, 200 + 110 * k), radius=11, fill=PAPER)
    d.text((216, 70), "EVAN JIA", font=font("black", 64), fill=INK)
    d.text((216, 150), "贾岱林 · AI PM × Agent Builder", font=font("cjk", 30), fill=INK)
    d.text((216, 236), "jiaedwin0605@gmail.com", font=font("mono", 28), fill=RED)
    d.text((216, 282), "github.com/EdwinjJ1", font=font("mono", 28), fill=INK)
    d.text((216, 328), "echoagent.dev", font=font("mono", 28), fill=INK)
    c.save(out / "bizcard.png")
    for name, kind, caption, seed, pid in (("a", "city", "coast", 61, 6), ("b", "person", "street", 62, 5), ("c", "city", "trees", 63, 3)):
        polaroid(kind, caption, seed, pid=pid).save(out / f"polaroid_{name}.png")


def newspaper(w=780, h=1020):
    """桌上那份报纸：AI、研究、行业各一条真实新闻（标题、来源、日期、摘要），取自导入的新闻数据。"""
    f = ASSETS / "data/news.json"
    items = json.loads(f.read_text())["items"] if f.exists() else []
    # 只取 AI / 研究 / 行业三类：这是一份 AI 报纸，国际时政留给新闻面板
    stories = [n for cat in ("ai", "research", "industry") for n in [next((x for x in items if x["category"] == cat and x["title"].isascii()), None)] if n]
    im = paper(w, h, NEWS, grain=9, seed=90)
    d = ImageDraw.Draw(im)
    d.text((w / 2, 62), "AI DAILY", font=font("serif", 104), fill=INK, anchor="mm")
    d.rectangle((26, 122, w - 26, 128), fill=INK)
    d.text((30, 136), "EVAN'S NEWS DESK", font=font("mono", 22), fill=INK)
    d.text((w - 30, 136), stories[0]["date"] if stories else "", font=font("mono", 22), fill=RED, anchor="ra")
    d.rectangle((26, 168, w - 26, 170), fill=INK)
    y = 184
    for i, n in enumerate(stories):
        if y > h - 150:
            break
        tag = n["category"].upper()
        d.rectangle((30, y + 2, 30 + d.textlength(tag, font=font("din", 26)) + 16, y + 32), fill=RED)
        d.text((38, y + 3), tag, font=font("din", 26), fill=PAPER)
        d.text((w - 30, y + 6), f"{n['source']} · {n['date']}", font=font("mono", 20), fill=(90, 88, 84), anchor="ra")
        y += 40
        fs = 52 if i == 0 else 36
        fnt = font("impact" if i == 0 else "black", fs)
        for line in wrap(d, n["title"], fnt, w - 60)[: 3 if i == 0 else 2]:
            d.text((30, y), line, font=fnt, fill=INK)
            y += fs + 4
        y = body(d, (30, y + 4, w - 30, h - 24), n["summary"], size=25, max_lines=6 if i == 0 else 5) + 12
        d.line((30, y, w - 30, y), fill=(150, 146, 138), width=2)
        y += 12
    return im


# ───────────────────────── 环境材质 ─────────────────────────
def brick(w=4096, h=1900, bw=150, bh=56, gap=7):
    rng = random.Random(4)
    im = Image.new("RGB", (w, h), (196, 188, 176))
    d = ImageDraw.Draw(im)
    for r in range(h // bh + 1):
        off = -(bw // 2) if r % 2 else 0
        for c in range(w // bw + 2):
            t = rng.choice([0, 0, 0, 1, 1, 2, 3])
            col = [(238, 233, 224), (228, 222, 211), (246, 242, 235), (214, 205, 192)][t]
            d.rectangle((off + c * bw + gap / 2, r * bh + gap / 2, off + (c + 1) * bw - gap / 2, (r + 1) * bh - gap / 2), fill=col)
    return im.filter(ImageFilter.GaussianBlur(0.8))


def wood(w=2560, h=1100, planks=7):
    rng = random.Random(6)
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    ph = h / planks
    for p in range(planks):
        base = rng.choice([(190, 128, 76), (202, 140, 86), (178, 116, 68), (196, 134, 80)])
        d.rectangle((0, p * ph, w, (p + 1) * ph), fill=base)
        for _ in range(26):  # 木纹
            y = p * ph + rng.uniform(4, ph - 4)
            x0 = rng.uniform(-200, w)
            ln = rng.uniform(200, 900)
            d.line([(x0 + ln * i / 6, y + rng.uniform(-3, 3)) for i in range(7)], fill=tuple(int(c * rng.uniform(0.84, 0.94)) for c in base), width=rng.choice([2, 3, 4]))
        d.rectangle((0, (p + 1) * ph - 3, w, (p + 1) * ph), fill=(120, 76, 44))
        for s in range(rng.randint(1, 2)):
            x = rng.uniform(200, w - 200)
            d.rectangle((x, p * ph, x + 3, (p + 1) * ph), fill=(120, 76, 44))
    return im.filter(ImageFilter.GaussianBlur(0.7))


def facade(seed, wall, w=512, h=1024, cols=10, rows=26):
    rng = random.Random(seed)
    im = Image.new("RGB", (w, h), wall)
    d = ImageDraw.Draw(im)
    cw, rh = w / cols, h / rows
    for r in range(rows):
        for c in range(cols):
            lit = rng.random()
            col = (255, 214, 128) if lit < 0.28 else ((255, 241, 190) if lit < 0.36 else tuple(int(v * 0.55) for v in wall))
            d.rectangle((c * cw + cw * 0.18, r * rh + rh * 0.2, (c + 1) * cw - cw * 0.18, (r + 1) * rh - rh * 0.22), fill=col)
    return im


def main(out):
    out.mkdir(parents=True, exist_ok=True)
    board().save(out / "board.png")
    clips = [
        ("ECHO AGENT MAKES THE 61.7K-STAR LIST", "Featured 5 days after first commit", "bars", None,
         "SHANGHAI — Echo Agent, a voice AI agent for Mac built by Evan Jia and a team of four, was added to GitHub's 61.7k-star list of Chinese indie developer projects on 29 September, five days after its first commit. Press Fn+Space in any app, say it, and Echo hands the work to Claude Code and Codex on your own machine. Version 0.1.38 shipped within two weeks."),
        ("ATHENA TAKES SUSQUEHANNA PRIZE", "UNSW × Mistral AI × Atlassian", "cup", None,
         "SYDNEY — Athena, a Discord agent that chases project updates and writes them into a live knowledge graph, won the Susquehanna Prize at the UNSW × Mistral AI × Atlassian Hackathon. Jia led product architecture and final integration; the team built it in 24 hours. Every team's answers land in one graph, so contradictions between teams surface on their own."),
        ("TEEN CEO HITS ¥100K IN ONE DAY", "Hypha · 7-person team · age 17", "person", avatar(),
         "BEIJING — At 17, Evan Jia founded Hypha and led a team of seven across engineering, art and legal. Its core digital-collectible product passed ¥100,000 in revenue in a single day. He owned the roadmap, the architecture and most of the backend, and took community growth from zero to a paying audience."),
        ("TOP 3 AT FEISHU AI CHALLENGE", "Lark Loom · full-stack track", "podium", None,
         "Lark Loom, a chat-native project coordination agent, finished in the top three of the AI full-stack track at ByteDance's Feishu AI Campus Challenge. It routes between two models, calls functions, and keeps six kinds of memory in a Bitable-backed store so a three-person team could build against stable contracts."),
    ]
    for i, (hl, sub, kind, image, text) in enumerate(clips):
        clipping(hl, sub, kind, 20 + i, text, h=820 if i % 2 == 0 else 760, image=image).save(out / f"clip_{i}.png")
    poster().save(out / "poster.png")
    zine("ECHO AGENT", 1, "SPEAK. IT'S DONE.", (255, 122, 61), INK, "bars").save(out / "zine_echo.png")
    zine("ROUNDTABLE", 2, "AGENTS, ASSEMBLE.", (88, 166, 255), RED, "table").save(out / "zine_roundtable.png")
    zine("ATHENA", 3, "THE BOT THAT CHASES.", (142, 78, 198), INK, "owl").save(out / "zine_athena.png")
    zine("PREUNI", 4, "NOTES, SHARED.", (48, 164, 108), INK, "notes").save(out / "zine_preuni.png")
    notebook().save(out / "notebook.png")
    screen().save(out / "screen.png")
    phone().save(out / "phone.png")
    small_papers(out)
    newspaper().save(out / "newspaper.png")
    brick(w=3320, h=2200, bw=118, bh=44, gap=6).save(out / "brick.png")
    wood().save(out / "wood.png")
    for i, wall in enumerate(((52, 66, 96), (78, 96, 128), (38, 48, 72), (104, 122, 146))):
        facade(100 + i, wall).save(out / f"facade_{i}.png")
    print("textures ok ->", out)


if __name__ == "__main__":
    main(Path(sys.argv[1] if len(sys.argv) > 1 else "blender/tex"))
