"""同步 GitHub 贡献墙：读公开的贡献日历，写到 site/assets/data/github.json。

    python3 pipeline/sync_github.py [用户名]

只用标准库。日历读的是 github.com/users/<用户>/contributions 这个公开片段，和个人主页上那张图是同一份
（主页设置里打开了私有贡献的话也算在内，只有每天的数字，没有仓库名）；仓库数和关注者走公开 API，
环境里有 GITHUB_TOKEN 就带上，没有也能跑。

GitHub Actions 每次部署前跑一次，结果只进当次部署；仓库里那份 github.json 是抓取失败时的兜底快照，
也是桌上那座 3D 贡献城的数据来源（textures.py 把它转成 blender/tex/skyline.json，layout.py 照着建模）。
"""
import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site/assets/data/github.json"
USER = "EdwinjJ1"
FIRST_YEAR = 2024       # 账号 2024 年 4 月注册，更早的年份全是 0
MIN_DAYS = 300          # 「过去一年」少于这么多天，多半是页面改版没解析对，不覆盖快照
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html",
}

DAY_RE = re.compile(r'<td\b[^>]*class="ContributionCalendar-day"[^>]*>')
TIP_RE = re.compile(r'<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)</tool-tip>')
TOTAL_RE = re.compile(r'id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?\b')


def attr(tag, name):
    m = re.search(rf'\b{name}="([^"]*)"', tag)
    return m.group(1) if m else None


def count_of(tip):
    """「No contributions on …」→ 0，「1 contribution on …」→ 1，「1,234 contributions on …」→ 1234。"""
    m = re.match(r"\s*([\d,]+)\s+contributions?\b", tip or "")
    return int(m.group(1).replace(",", "")) if m else 0


def parse_calendar(html):
    """日历片段 → {total, days: [(日期, 次数, 档位 0–4)]}，按日期排好。total 取页面上那行大字（缺了就把每天加起来）。"""
    tips = {m.group(1): m.group(2) for m in TIP_RE.finditer(html)}
    days = []
    for m in DAY_RE.finditer(html):
        tag = m.group(0)
        day, level = attr(tag, "data-date"), attr(tag, "data-level")
        if not (day and level and re.fullmatch(r"\d{4}-\d{2}-\d{2}", day) and level.isdigit()):
            continue
        days.append((day, count_of(tips.get(attr(tag, "id"), "")), min(4, int(level))))
    days.sort()
    total = TOTAL_RE.search(html)
    return {"total": int(total.group(1).replace(",", "")) if total else sum(c for _, c, _ in days), "days": days}


def to_view(view_id, cal, today=None):
    """一段日历 → 前端读的一个视图：from..to 每天一格，counts 是次数，levels 是一串 0–4 的档位。
    today 之后的日子（今年还没到的那几个月）不要；中间缺的日子补 0。"""
    days = [d for d in cal["days"] if today is None or d[0] <= today]
    if not days:
        return None
    first, last = date.fromisoformat(days[0][0]), date.fromisoformat(days[-1][0])
    by_day = {d: (c, lv) for d, c, lv in days}
    span = [(first + timedelta(i)).isoformat() for i in range((last - first).days + 1)]
    cells = [by_day.get(d, (0, 0)) for d in span]
    return {
        "id": view_id,
        "total": cal["total"],
        "from": span[0],
        "to": span[-1],
        "counts": [c for c, _ in cells],
        "levels": "".join(str(lv) for _, lv in cells),
    }


def build(user, views, profile, updated):
    return {"user": user, "url": f"https://github.com/{user}", "updated": updated, "profile": profile, "views": [v for v in views if v]}


def fetch(url, headers=None):
    request = urllib.request.Request(url, headers={**HEADERS, **(headers or {})})
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read().decode("utf-8", "replace")


def fetch_profile(user):
    token = os.environ.get("GITHUB_TOKEN")
    auth = {"Authorization": f"Bearer {token}"} if token else {}
    body = json.loads(fetch(f"https://api.github.com/users/{user}", {"Accept": "application/vnd.github+json", **auth}))
    return {"repos": body.get("public_repos") or 0, "followers": body.get("followers") or 0, "since": (body.get("created_at") or "")[:10]}


def load_snapshot():
    try:
        return json.loads(OUT.read_text())
    except (OSError, ValueError):
        return {}


def main():
    user = sys.argv[1] if len(sys.argv) > 1 else USER
    old = load_snapshot()
    old_views = {v["id"]: v for v in old.get("views", [])} if old.get("user") == user else {}
    try:
        last = parse_calendar(fetch(f"https://github.com/users/{user}/contributions"))
    except Exception as error:
        print(f"贡献日历抓取失败（{error}），保留原来的快照。", file=sys.stderr)
        return 1
    if len(last["days"]) < MIN_DAYS:
        print(f"只解析出 {len(last['days'])} 天，页面可能改版了，保留原来的快照。", file=sys.stderr)
        return 1
    today = last["days"][-1][0]         # GitHub 按用户时区算的「今天」
    views = [to_view("last", last)]
    for year in range(int(today[:4]), FIRST_YEAR - 1, -1):
        try:
            views.append(to_view(str(year), parse_calendar(fetch(f"https://github.com/users/{user}/contributions?from={year}-01-01&to={year}-12-31")), today))
        except Exception as error:
            print(f"{year} 年抓取失败（{error}），用快照里的。", file=sys.stderr)
            views.append(old_views.get(str(year)))
    try:
        profile = fetch_profile(user)
    except Exception as error:
        print(f"主页信息抓取失败（{error}），用快照里的。", file=sys.stderr)
        profile = old.get("profile")
    doc = build(user, views, profile, datetime.now(timezone.utc).isoformat(timespec="seconds"))
    OUT.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
    print("github.json: " + " · ".join(f"{v['id']} {v['total']}" for v in doc["views"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
