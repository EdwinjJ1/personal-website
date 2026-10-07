# /// script
# dependencies = ["pillow"]
# ///
"""按 build/photos-manifest.json 把旧站的摄影原图缩成网页尺寸。清单里有多少张就缩多少张。

    uv run pipeline/import_photos.py

输出 site/assets/photos/<id>.webp（长边 1600）和 <id>-t.webp（长边 560），以及 site/assets/data/photos.json。
上次就是从同一张原图缩出来的不重新缩（photos.json 里的 src 记着每个 id 对应哪张原图）；清单里已经没有的旧文件删掉。
"""
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site/assets/photos"
DATA = ROOT / "site/assets/data/photos.json"
FIELDS = ("id", "title", "location", "category", "date", "camera", "settings", "description", "series")


def fit(im, edge):
    out = im.copy()
    out.thumbnail((edge, edge), Image.LANCZOS)
    return out


def convert(entry, built):
    """一张原图 → 大图 + 缩略图。built 是上次的 {id: 原图文件名}。返回写进 photos.json 的条目；原图不在返回 None。"""
    src = Path(entry["source"])
    full, thumb = OUT / f"{entry['id']}.webp", OUT / f"{entry['id']}-t.webp"
    if not src.exists():
        print("缺图，跳过：", src.name)
        return None
    fresh = built.get(entry["id"]) == src.name and full.exists() and thumb.exists() and min(full.stat().st_mtime, thumb.stat().st_mtime) >= src.stat().st_mtime
    if not fresh:
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        fit(im, 1600).save(full, quality=80, method=5)
        fit(im, 560).save(thumb, quality=72, method=5)
    with Image.open(full) as done:
        width, height = done.size
    return {k: entry[k] for k in FIELDS} | {"w": width, "h": height, "src": src.name}


def main():
    manifest = json.loads((ROOT / "build/photos-manifest.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    built = {p["id"]: p.get("src") for p in json.loads(DATA.read_text())} if DATA.exists() else {}
    with ThreadPoolExecutor(max_workers=6) as pool:
        items = [item for item in pool.map(lambda entry: convert(entry, built), manifest) if item]
    keep = {f"{item['id']}{suffix}.webp" for item in items for suffix in ("", "-t")}
    stale = [f for f in OUT.glob("*.webp") if f.name not in keep]
    for f in stale:
        f.unlink()
    DATA.write_text(json.dumps(items, ensure_ascii=False))
    print(f"photos {len(items)}（清掉 {len(stale)} 个旧文件）")

    # 项目配图：旧站的截图缩到 1200 宽
    pdir = ROOT / "site/assets/projects"
    pdir.mkdir(parents=True, exist_ok=True)
    shots = json.loads((ROOT / "build/project-images.json").read_text()) if (ROOT / "build/project-images.json").exists() else []
    for shot in shots:
        src = Path(shot["source"])
        if src.exists():
            fit(Image.open(src).convert("RGB"), 1200).save(pdir / shot["out"], quality=82, method=5)
    print("project images", len(shots))


if __name__ == "__main__":
    main()
