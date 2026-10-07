# /// script
# dependencies = ["pillow"]
# ///
"""按 build/photos-manifest.json 把旧站的摄影原图缩成网页尺寸。

    uv run pipeline/import_photos.py

输出 site/assets/photos/<id>.webp（长边 1600）和 <id>-t.webp（长边 560），以及 site/assets/data/photos.json。
"""
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site/assets/photos"


def fit(im, edge):
    out = im.copy()
    out.thumbnail((edge, edge), Image.LANCZOS)
    return out


def main():
    manifest = json.loads((ROOT / "build/photos-manifest.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    items = []
    for p in manifest:
        src = Path(p["source"])
        if not src.exists():
            print("缺图，跳过：", src.name)
            continue
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        full, thumb = fit(im, 1600), fit(im, 560)
        full.save(OUT / f"{p['id']}.webp", quality=80, method=5)
        thumb.save(OUT / f"{p['id']}-t.webp", quality=72, method=5)
        items.append({k: p[k] for k in ("id", "title", "location", "category", "date", "camera", "settings", "description")} | {"w": full.width, "h": full.height})
    (ROOT / "site/assets/data/photos.json").write_text(json.dumps(items, ensure_ascii=False))
    print("photos", len(items))

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
