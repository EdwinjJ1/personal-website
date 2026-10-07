"""定时同步新闻：抓四个公开 RSS，更新两样东西。

    python3 pipeline/sync_news.py

1. site/assets/data/news.json        各分类最近 24 条（桌上那份报纸和面板的退路用）
2. site/assets/data/news/            日历档案：index.json + 每天一个 <日期>.json

只用标准库。GitHub Actions 每 6 小时跑一次，结果只进当次部署，不往仓库里提交。
所以档案靠“线上站点自己”续命：每次先把线上已有、仓库快照里没有的日期取回来，再并入新抓到的。
在本地跑一遍同样会把线上的档案拉回来，想刷新仓库里的快照时提交一次就行。
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
ARCHIVE = OUT.parent / "news"
LIVE = "https://evanlin.site/assets/data/news"
PER_CATEGORY = 24   # news.json 里每个分类留几条
PER_DAY = 30        # 档案里每天每个分类留几条（arXiv 一天能有几百篇）
FEEDS = (
    ("Google AI", "ai", "https://blog.google/technology/ai/rss/"),
    ("arXiv cs.AI", "research", "https://rss.arxiv.org/rss/cs.AI"),
    ("BBC Technology", "industry", "https://feeds.bbci.co.uk/news/technology/rss.xml"),
    ("BBC World", "global", "https://feeds.bbci.co.uk/news/world/rss.xml"),
)
ATOM = "{http://www.w3.org/2005/Atom}"
DC_DATE = "{http://purl.org/dc/elements/1.1/}date"
ARXIV_PREFIX = re.compile(r"^arXiv:\S+\s+Announce Type:\s*\S+\s+Abstract:\s*", re.I)
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def clip(text, limit):
    """去标签、压空白、去掉 arXiv 摘要的固定前缀、截断。"""
    plain = ARXIV_PREFIX.sub("", re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", text or ""))).strip())
    return plain if len(plain) <= limit else plain[: limit - 1] + "…"


def to_datetime(raw):
    """RSS 的 RFC 822 日期或 Atom 的 ISO 日期 → UTC 时间；解析不了返回 None。"""
    raw = (raw or "").strip()
    if not raw:
        return None
    try:
        parsed = parsedate_to_datetime(raw)
    except (TypeError, ValueError):
        try:
            parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return None
    return (parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)).astimezone(timezone.utc)


def to_date(raw):
    parsed = to_datetime(raw)
    return parsed.strftime("%Y-%m-%d") if parsed else ""


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
        published = to_datetime(node.findtext("pubDate") or node.findtext(DC_DATE) or node.findtext(f"{ATOM}updated") or node.findtext(f"{ATOM}published"))
        summary = clip(node.findtext("description") or node.findtext(f"{ATOM}summary") or "", 200)
        link = link.strip()
        if title and published and link.startswith(("https://", "http://")):
            items.append({"title": title, "url": link, "source": source, "date": published.strftime("%Y-%m-%d"),
                          "time": published.strftime("%H:%M"), "category": category, "summary": summary})
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


# ───────────────────────── 日历档案 ─────────────────────────
def to_story(item):
    """档案里一条新闻的形状；不是合法条目（缺标题、链接不是 http）返回 None。"""
    if not isinstance(item, dict):
        return None
    title, url = str(item.get("title") or "").strip(), str(item.get("url") or "").strip()
    if not title or not url.startswith(("https://", "http://")):
        return None
    return {"title": title, "url": url, "source": str(item.get("source") or ""), "category": str(item.get("category") or "ai").lower(),
            "time": str(item.get("time") or ""), "summary": str(item.get("summary") or "")}


def merge_day(fresh, old, per_day=PER_DAY):
    """同一天的新闻：新抓的在前按链接去重，按时间倒序，每个分类最多 per_day 条。不改传入的列表。"""
    seen, unique = set(), []
    for story in filter(None, map(to_story, [*fresh, *old])):
        if story["url"] not in seen:
            seen.add(story["url"])
            unique.append(story)
    unique.sort(key=lambda s: s["time"], reverse=True)
    counts, kept = {}, []
    for story in unique:
        counts[story["category"]] = counts.get(story["category"], 0) + 1
        if counts[story["category"]] <= per_day:
            kept.append(story)
    return kept


def index_entry(date, stories):
    counts = {}
    for story in stories:
        counts[story["category"]] = counts.get(story["category"], 0) + 1
    return {"d": date, "n": len(stories), "c": counts}


def group_by_date(items):
    groups = {}
    for item in items:
        if DATE.match(str(item.get("date") or "")):
            groups.setdefault(item["date"], []).append(item)
    return groups


def pull_live(days, base=LIVE, get=None):
    """把线上有、本地没有（或线上条数更多）的日期取回来，返回 {日期: 条目列表}。

    days 是本地索引 {日期: 索引项}。线上取不到就返回已经取到的部分：宁可少补几天，也不让同步失败。
    """
    get = get or fetch
    try:
        live = json.loads(get(f"{base}/index.json"))["days"]
    except Exception as error:
        print(f"线上档案取不到（{error}），只用仓库里的快照。", file=sys.stderr)
        return {}
    pulled = {}
    for entry in live:
        date = str(entry.get("d") or "")
        local = days.get(date)
        if not DATE.match(date) or (local is not None and int(entry.get("n") or 0) <= local["n"]):
            continue
        try:
            pulled[date] = json.loads(get(f"{base}/{date}.json"))
        except Exception as error:
            print(f"{date}: 线上这一天取不到（{error}）", file=sys.stderr)
    return pulled


def update_archive(directory, fresh, updated, pull=None):
    """把新抓到的新闻并进按天的档案，返回写好的索引。pull(本地索引) 可选，用来先补回线上的日期。"""
    directory.mkdir(parents=True, exist_ok=True)
    index_path = directory / "index.json"
    days = {entry["d"]: entry for entry in (json.loads(index_path.read_text())["days"] if index_path.exists() else [])}

    def write_day(date, incoming):
        path = directory / f"{date}.json"
        stories = merge_day(incoming, json.loads(path.read_text()) if path.exists() else [])
        if stories:
            path.write_text(json.dumps(stories, ensure_ascii=False))
            days[date] = index_entry(date, stories)

    for date, stories in (pull(dict(days)) if pull else {}).items():
        write_day(date, stories if isinstance(stories, list) else [])
    for date, stories in group_by_date(fresh).items():
        write_day(date, stories)
    index = {"updated": updated, "days": [days[date] for date in sorted(days, reverse=True)]}
    index_path.write_text(json.dumps(index, ensure_ascii=False))
    return index


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
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    items = merge(fresh, old)
    OUT.write_text(json.dumps({"updated": now, "items": items}, ensure_ascii=False))
    index = update_archive(ARCHIVE, fresh, now, pull=pull_live)
    print(f"news.json: {len(items)} 条；档案：{len(index['days'])} 天，最新 {index['days'][0]['d']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
