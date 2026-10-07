"""定时同步新闻：抓四个公开 RSS，写到 site/assets/data/news.json（每个分类最近 24 条）。

    python3 pipeline/sync_news.py

只用标准库。GitHub Actions 每 6 小时跑一次，结果只进当次部署，不往仓库里提交；
仓库里那份 news.json 是抓取失败时的兜底快照。
"""
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site/assets/data/news.json"
PER_CATEGORY = 24
FEEDS = (
    ("Google AI", "ai", "https://blog.google/technology/ai/rss/"),
    ("arXiv cs.AI", "research", "https://rss.arxiv.org/rss/cs.AI"),
    ("BBC Technology", "industry", "https://feeds.bbci.co.uk/news/technology/rss.xml"),
    ("BBC World", "global", "https://feeds.bbci.co.uk/news/world/rss.xml"),
)
ATOM = "{http://www.w3.org/2005/Atom}"
DC_DATE = "{http://purl.org/dc/elements/1.1/}date"


def clip(text, limit):
    """去标签、压空白、截断。"""
    plain = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", text or ""))).strip()
    return plain if len(plain) <= limit else plain[: limit - 1] + "…"


def to_date(raw):
    """RSS 的 RFC 822 日期或 Atom 的 ISO 日期 → YYYY-MM-DD；解析不了返回空串。"""
    raw = (raw or "").strip()
    if not raw:
        return ""
    try:
        return parsedate_to_datetime(raw).date().isoformat()
    except (TypeError, ValueError):
        pass
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00")).date().isoformat()
    except ValueError:
        return ""


def parse_feed(xml_text, source, category):
    """一段 RSS 2.0 / Atom 文本 → 新闻条目列表。没有标题、日期或合法链接的条目丢掉。"""
    root = ET.fromstring(xml_text)
    items = []
    for node in list(root.iter("item")) + list(root.iter(f"{ATOM}entry")):
        link = node.findtext("link") or ""
        if not link.strip():
            atom_link = node.find(f"{ATOM}link")
            link = atom_link.get("href", "") if atom_link is not None else ""
        title = clip(node.findtext("title") or node.findtext(f"{ATOM}title"), 140)
        date = to_date(node.findtext("pubDate") or node.findtext(DC_DATE) or node.findtext(f"{ATOM}updated") or node.findtext(f"{ATOM}published"))
        summary = clip(node.findtext("description") or node.findtext(f"{ATOM}summary") or "", 200)
        link = link.strip()
        if title and date and link.startswith(("https://", "http://")):
            items.append({"title": title, "url": link, "source": source, "date": date, "category": category, "summary": summary})
    return items


def merge(fresh, old, per_category=PER_CATEGORY):
    """新抓到的排在前面，按链接去重，按日期倒序，每个分类最多 per_category 条。不改传入的列表。"""
    seen, unique = set(), []
    for item in [*fresh, *old]:
        if item["url"] not in seen:
            seen.add(item["url"])
            unique.append(item)
    unique.sort(key=lambda n: n["date"], reverse=True)
    counts, kept = {}, []
    for item in unique:
        counts[item["category"]] = counts.get(item["category"], 0) + 1
        if counts[item["category"]] <= per_category:
            kept.append(item)
    return kept


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "EvanNewsDesk/2.0 (+https://evanlin.site)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read().decode("utf-8", "replace")


def main():
    old = json.loads(OUT.read_text()).get("items", []) if OUT.exists() else []
    fresh = []
    for source, category, url in FEEDS:
        try:
            got = parse_feed(fetch(url), source, category)
            fresh.extend(got)
            print(f"{source}: {len(got)}")
        except Exception as error:  # 一个源挂了不影响其他源
            print(f"{source}: 抓取失败（{error}）", file=sys.stderr)
    if not fresh:
        print("四个源都没抓到，保留原来的快照。", file=sys.stderr)
        return 1
    items = merge(fresh, old)
    OUT.write_text(json.dumps({"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "items": items}, ensure_ascii=False))
    print(f"news.json: {len(items)} 条")
    return 0


if __name__ == "__main__":
    sys.exit(main())
