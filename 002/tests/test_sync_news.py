import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "pipeline"))
from sync_news import clip, merge, parse_feed, to_date  # noqa: E402

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
        self.assertEqual(items[0], {"title": "First & best", "url": "https://a.example/1", "source": "Src", "date": "2026-10-06", "category": "ai", "summary": "Hello world"})
        self.assertEqual(items[1]["date"], "2026-10-05")

    def test_atom_entries(self):
        self.assertEqual(parse_feed(ATOM, "B", "global"), [{"title": "Atom entry", "url": "https://b.example/x", "source": "B", "date": "2026-10-07", "category": "global", "summary": "Short"}])


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


if __name__ == "__main__":
    unittest.main()
