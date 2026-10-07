"""同步歌单：读网易云的公开歌单，挑出不用会员就能听的歌，写到 site/assets/data/music.json。

    python3 pipeline/sync_music.py [歌单 id]

只用标准库，不带任何登录信息，读的都是公开数据。GitHub Actions 每次部署前跑一次，
结果只进当次部署；仓库里那份 music.json 是抓取失败时的兜底快照（海外机房有时会被网易云拒绝）。

网页用网易云官方的外链地址放歌，所以会员曲目和没有版权的歌放不出来，这里直接筛掉；
地区限制只有听的人那边才知道，交给前端在放不了的时候自动跳过。
"""
import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site/assets/data/music.json"
PLAYLIST_ID = "2722035655"      # -EdwinJ-喜欢的音乐
LIMIT = 200
BATCH = 200
API = "https://music.163.com/api"
FREE_FEES = (0, 8)              # 0 免费，8 非会员可听；1 是会员曲目，4 是付费专辑
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Referer": "https://music.163.com/",
    "Content-Type": "application/x-www-form-urlencoded",
}


def playable(song):
    """不用会员、也没有被下架的歌，外链才放得出来。"""
    return song.get("fee") in FREE_FEES and not song.get("noCopyrightRcmd")


def to_track(song):
    album = song.get("al") or {}
    cover = (album.get("picUrl") or "").replace("http://", "https://", 1)
    return {
        "id": song["id"],
        "title": (song.get("name") or "").strip(),
        "artist": " / ".join(a["name"] for a in song.get("ar") or [] if a.get("name")),
        "album": album.get("name") or "",
        "cover": cover if cover.startswith("https://") else "",
        "duration": round((song.get("dt") or 0) / 1000),
    }


def pick_tracks(order, songs, limit=LIMIT):
    """按歌单里的顺序排，去掉放不了的、没有标题的和重复的，最多 limit 首。不改传入的列表。"""
    by_id = {s["id"]: s for s in songs}
    seen, tracks = set(), []
    for sid in order:
        found = by_id.get(sid)
        if sid in seen or not found or not playable(found) or not (found.get("name") or "").strip():
            continue
        seen.add(sid)
        tracks.append(to_track(found))
        if len(tracks) >= limit:
            break
    return tracks


def build(playlist, songs, updated):
    """歌单详情 + 歌曲详情 → 前端读的那份 JSON。"""
    order = [t["id"] for t in playlist.get("trackIds") or []]
    pid = str(playlist["id"])
    return {
        "updated": updated,
        "playlist": {"id": pid, "name": playlist.get("name") or "", "url": f"https://music.163.com/#/playlist?id={pid}", "total": playlist.get("trackCount") or len(order)},
        "tracks": pick_tracks(order, songs),
    }


def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]


def call(path, data):
    request = urllib.request.Request(f"{API}{path}", data=urllib.parse.urlencode(data).encode(), headers=HEADERS)
    with urllib.request.urlopen(request, timeout=25) as response:
        body = json.loads(response.read().decode("utf-8", "replace"))
    if body.get("code") != 200:
        raise RuntimeError(f"{path} 返回 {body.get('code')}：{body.get('message') or body.get('msg') or ''}")
    return body


def main():
    pid = sys.argv[1] if len(sys.argv) > 1 else PLAYLIST_ID
    try:
        playlist = call("/v6/playlist/detail", {"id": pid, "n": 0, "s": 0})["playlist"]
        ids = [t["id"] for t in playlist.get("trackIds") or []]
        songs = [s for batch in chunks(ids, BATCH) for s in call("/v3/song/detail", {"c": json.dumps([{"id": i} for i in batch])}).get("songs", [])]
    except Exception as error:
        print(f"歌单抓取失败（{error}），保留原来的快照。", file=sys.stderr)
        return 1
    doc = build(playlist, songs, datetime.now(timezone.utc).isoformat(timespec="seconds"))
    if not doc["tracks"]:
        print("没有筛出能放的歌，保留原来的快照。", file=sys.stderr)
        return 1
    OUT.write_text(json.dumps(doc, ensure_ascii=False))
    print(f"music.json: {doc['playlist']['name']} · {len(doc['tracks'])}/{doc['playlist']['total']} 首")
    return 0


if __name__ == "__main__":
    sys.exit(main())
