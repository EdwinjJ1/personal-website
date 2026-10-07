import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "pipeline"))
from sync_news import clip, group_by_date, index_entry, merge, merge_day, parse_feed, pull_live, to_date, to_story, update_archive  # noqa: E402

RSS = """<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>
<item><title>First &amp; best</title><link>https://a.example/1</link><pubDate>Tue, 06 Oct 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Hello   <b>world</b></p>]]></description></item>
<item><title>Dublin core date</title><link>https://a.example/2</link><dc:date>2026-10-05T08:00:00Z</dc:date></item>
<item><title>No date</title><link>https://a.example/3</link></item>
<item><title>Bad link</title><link>javascript:alert(1)</link><pubDate>Tue, 06 Oct 2026 10:00:00 GMT</pubDate></item>
<item><title></title><link>https://a.example/5</link><pubDate>Tue, 06 Oct 2026 10:00:00 GMT</pubDate></item>
</channel></rss>"""

ATOM = """<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Atom entry</title><link href="https://b.example/x"/><updated>2026-10-07T01:02:03+00:00</updated><summary>Short</summary></entry>
</feed>"""


class ParseFeed(unittest.TestCase):
    def test_rss_items_are_cleaned_and_filtered(self):
        items = parse_feed(RSS, "Src", "ai")
        self.assertEqual([i["title"] for i in items], ["First & best", "Dublin core date"])
        self.assertEqual(items[0], {"title": "First & best", "url": "https://a.example/1", "source": "Src", "date": "2026-10-06", "time": "10:00", "category": "ai", "summary": "Hello world"})
        self.assertEqual(items[1]["date"], "2026-10-05")

    def test_atom_entries(self):
        self.assertEqual(parse_feed(ATOM, "B", "global"), [{"title": "Atom entry", "url": "https://b.example/x", "source": "B", "date": "2026-10-07", "time": "01:02", "category": "global", "summary": "Short"}])


class Helpers(unittest.TestCase):
    def test_clip(self):
        self.assertEqual(clip("<i>a</i>\n  b", 10), "a b")
        self.assertEqual(len(clip("x" * 500, 200)), 200)
        self.assertEqual(clip(None, 5), "")
        self.assertEqual(clip("arXiv:2610.03872v1 Announce Type: new Abstract: AI agents are here.", 80), "AI agents are here.")

    def test_to_date(self):
        self.assertEqual(to_date("Tue, 06 Oct 2026 10:00:00 GMT"), "2026-10-06")
        self.assertEqual(to_date("2026-10-05T08:00:00Z"), "2026-10-05")
        self.assertEqual(to_date("not a date"), "")
        self.assertEqual(to_date(None), "")

    def test_merge_dedupes_sorts_and_caps_without_mutating(self):
        mk = lambda u, d, c="ai": {"title": u, "url": u, "source": "s", "date": d, "category": c, "summary": ""}
        fresh = [mk("u1", "2026-10-07"), mk("u2", "2026-10-06"), mk("g1", "2026-10-01", "global")]
        old = [mk("u2", "2026-10-06"), mk("u0", "2026-09-01"), mk("u9", "2026-10-08")]
        out = merge(fresh, old, per_category=3)
        self.assertEqual([n["url"] for n in out], ["u9", "u1", "u2", "g1"])
        self.assertEqual(len(fresh), 3)
        self.assertEqual(len(old), 3)


def story(url, time="08:00", category="ai", **extra):
    return {"title": url, "url": f"https://x.example/{url}", "source": "S", "category": category, "time": time, "summary": "", **extra}


class Archive(unittest.TestCase):
    def test_to_story_normalises_and_rejects_bad_items(self):
        self.assertEqual(to_story({"title": " T ", "url": "https://a.example", "category": "AI", "date": "2026-10-07"}),
                         {"title": "T", "url": "https://a.example", "source": "", "category": "ai", "time": "", "summary": ""})
        self.assertIsNone(to_story({"title": "T", "url": "javascript:alert(1)"}))
        self.assertIsNone(to_story({"title": "", "url": "https://a.example"}))
        self.assertIsNone(to_story("not a dict"))

    def test_merge_day_dedupes_sorts_by_time_and_caps_per_category(self):
        fresh = [story("a", "09:00"), story("b", "12:00"), story("g", "07:00", "global")]
        old = [story("a", "09:00"), story("c", "10:00"), story("d", "06:00"), {"title": "", "url": "nope"}]
        out = merge_day(fresh, old, per_day=3)
        self.assertEqual([s["title"] for s in out], ["b", "c", "a", "g"])
        self.assertEqual(len(fresh), 3)
        self.assertEqual(len(old), 4)

    def test_index_entry_and_group_by_date(self):
        self.assertEqual(index_entry("2026-10-07", [story("a"), story("b"), story("g", category="global")]), {"d": "2026-10-07", "n": 3, "c": {"ai": 2, "global": 1}})
        groups = group_by_date([{"date": "2026-10-07", "url": "1"}, {"date": "2026-10-06", "url": "2"}, {"date": "bad", "url": "3"}, {"url": "4"}])
        self.assertEqual(sorted(groups), ["2026-10-06", "2026-10-07"])

    def test_update_archive_merges_into_existing_days_and_writes_the_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp) / "news"
            directory.mkdir()
            (directory / "2026-10-06.json").write_text(json.dumps([story("old")]))
            (directory / "index.json").write_text(json.dumps({"updated": "x", "days": [{"d": "2026-10-06", "n": 1, "c": {"ai": 1}}]}))
            fresh = [dict(story("new", "11:00"), date="2026-10-07"), dict(story("also-old-day", "09:00"), date="2026-10-06")]
            index = update_archive(directory, fresh, "2026-10-07T12:00:00+00:00")
            self.assertEqual(index["days"], [{"d": "2026-10-07", "n": 1, "c": {"ai": 1}}, {"d": "2026-10-06", "n": 2, "c": {"ai": 2}}])
            self.assertEqual([s["title"] for s in json.loads((directory / "2026-10-06.json").read_text())], ["also-old-day", "old"])
            self.assertEqual(json.loads((directory / "index.json").read_text())["updated"], "2026-10-07T12:00:00+00:00")
            self.assertNotIn("date", json.loads((directory / "2026-10-07.json").read_text())[0])

    def test_update_archive_restores_days_pulled_from_the_live_site(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp) / "news"
            seen = {}

            def pull(days):
                seen.update(days)
                return {"2026-10-05": [story("from-live")], "2026-10-04": "garbage"}

            index = update_archive(directory, [dict(story("new"), date="2026-10-07")], "now", pull=pull)
            self.assertEqual([d["d"] for d in index["days"]], ["2026-10-07", "2026-10-05"])
            self.assertEqual(seen, {})
            self.assertFalse((directory / "2026-10-04.json").exists())


class PullLive(unittest.TestCase):
    def test_only_fetches_days_that_are_missing_or_larger_on_the_live_site(self):
        live = {"days": [{"d": "2026-10-07", "n": 5}, {"d": "2026-10-06", "n": 2}, {"d": "2026-10-05", "n": 9}, {"d": "oops", "n": 1}]}
        asked = []

        def get(url):
            asked.append(url.rsplit("/", 1)[1])
            if url.endswith("index.json"):
                return json.dumps(live)
            if url.endswith("2026-10-05.json"):
                raise OSError("boom")
            return json.dumps([story("x")])

        local = {"2026-10-07": {"d": "2026-10-07", "n": 3, "c": {}}, "2026-10-06": {"d": "2026-10-06", "n": 2, "c": {}}}
        pulled = pull_live(local, base="https://site.example/news", get=get)
        self.assertEqual(list(pulled), ["2026-10-07"])
        self.assertEqual(asked, ["index.json", "2026-10-07.json", "2026-10-05.json"])

    def test_returns_nothing_when_the_live_index_is_unreachable(self):
        def get(url):
            raise OSError("offline")

        self.assertEqual(pull_live({}, get=get), {})


if __name__ == "__main__":
    unittest.main()
