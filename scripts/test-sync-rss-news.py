"""Regression checks for RSS parsing, publication dates, and archive preservation."""
import importlib.util
from datetime import datetime, timezone
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('sync', Path(__file__).with_name('sync-rss-news.py'))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)
NOW = datetime(2026, 9, 19, tzinfo=timezone.utc)

class NewsSyncTests(unittest.TestCase):
    def test_dates_markup_and_invalid_entries(self):
        xml = '''<rss><channel>
        <item><title>A &amp; B</title><link>https://example.com/a</link><description>&lt;p&gt;Summary&lt;/p&gt;</description><pubDate>Fri, 18 Sep 2026 23:00:00 -0400</pubDate></item>
        <item><title>Valid</title><link>https://example.com/b</link><description>Text</description><pubDate>Fri, 18 Sep 2026 10:00:00 +1000</pubDate></item>
        <item><title>Missing date</title><link>https://example.com/c</link></item>
        <item><title>Unsafe link</title><link>javascript:alert(1)</link><pubDate>Fri, 18 Sep 2026 10:00:00 GMT</pubDate></item>
        </channel></rss>'''
        items = sync.parse_feed(xml, 'Example', 'ai', 'PRODUCT', NOW)
        self.assertEqual(len(items), 1)
        self.assertEqual((items[0]['date'], items[0]['time']), ('2026-09-18', '00:00'))
        self.assertEqual(sync.plain('&lt;p&gt;A &amp; B&lt;/p&gt;'), '<p>A & B</p>')
        self.assertEqual(sync.plain('<p>A &amp; B</p>'), 'A & B')

    def test_preserve_archive_and_stable_id(self):
        old = {'id': 'old', 'category': 'ai', 'sourceUrl': 'https://example.com/a', 'date': '2026-09-18', 'time': '10:00', 'title': 'Old'}
        other = {**old, 'id': 'manual', 'sourceUrl': '', 'category': 'global'}
        new = {**old, 'id': 'rss-new', 'title': 'Updated'}
        duplicate = {**old, 'id': 'older-history'}
        merged = sync.merge_news([old, other, duplicate], [new, new])
        self.assertEqual(len(merged), 3)
        self.assertIn(duplicate, merged)
        self.assertIn(other, merged)
        self.assertEqual(next(i for i in merged if i['id'] == 'old')['title'], 'Updated')
        self.assertEqual(sync.merge_news(merged, [new]), merged)

    def test_empty_feed_and_bad_payload(self):
        self.assertEqual(sync.parse_feed('<rss><channel/></rss>', 'arXiv', 'research', 'RESEARCH', NOW), [])
        with self.assertRaises(ValueError):
            sync.parse_feed('<html/>', 'Error', 'ai', 'PRODUCT', NOW)

if __name__ == '__main__':
    unittest.main()
