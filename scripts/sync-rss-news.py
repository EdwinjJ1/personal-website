#!/usr/bin/env python3
"""Sync public RSS feeds without credentials; preserve the existing news archive."""
import concurrent.futures
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FEEDS = [
    ('Google AI', 'ai', 'PRODUCT', 'https://blog.google/technology/ai/rss/'),
    ('arXiv cs.AI', 'research', 'RESEARCH', 'https://rss.arxiv.org/rss/cs.AI'),
    ('BBC Technology', 'industry', 'PRODUCT', 'https://feeds.bbci.co.uk/news/technology/rss.xml'),
    ('BBC World', 'global', 'BREAKING', 'https://feeds.bbci.co.uk/news/world/rss.xml'),
]


def plain(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', value or ''))).strip()


def parse_feed(xml, source, category, tag, now):
    root = ET.fromstring(xml)
    if root.tag != 'rss' or root.find('channel') is None:
        raise ValueError('Expected an RSS channel')
    result = []
    for item in root.findall('./channel/item'):
        title = plain(item.findtext('title'))
        url = (item.findtext('link') or '').strip()
        raw_date = item.findtext('pubDate') or item.findtext('{http://purl.org/dc/elements/1.1/}date')
        if not title or not url.startswith(('https://', 'http://')) or not raw_date:
            continue
        try:
            try:
                published = parsedate_to_datetime(raw_date)
            except (ValueError, TypeError):
                published = datetime.fromisoformat(raw_date.replace('Z', '+00:00'))
            if published.tzinfo is None:
                published = published.replace(tzinfo=timezone.utc)
            published = published.astimezone(timezone.utc)
        except (ValueError, TypeError, OverflowError):
            continue
        if published > now:
            continue
        summary = plain(item.findtext('description'))
        if len(summary) > 600:
            summary = summary[:597].rsplit(' ', 1)[0] + '...'
        result.append(dict(
            id=f'{category}-rss-{hashlib.sha256(url.encode()).hexdigest()[:20]}',
            title=title, summary=summary, tag=tag, source=source, sourceUrl=url,
            date=published.strftime('%Y-%m-%d'), time=published.strftime('%H:%M'), category=category,
        ))
    return result


def fetch_feed(feed, now):
    source, category, tag, url = feed
    request = urllib.request.Request(url, headers={'User-Agent': 'EvanlinNews/1.0 (+https://evanlin.site/news/)'})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = response.read(5_000_001)
    if len(payload) > 5_000_000:
        raise ValueError('Feed exceeds 5 MB')
    return parse_feed(payload, source, category, tag, now)


def merge_news(existing, incoming):
    # Keep the archive intact, updating only matching category + source URL entries.
    items = [dict(item) for item in existing]
    positions = {}
    for index, item in enumerate(items):
        if item.get('sourceUrl'):
            key = (item['category'], item['sourceUrl'])
            previous = positions.get(key)
            if previous is None or item['id'] < items[previous]['id']:
                positions[key] = index
    for item in incoming:
        key = (item['category'], item['sourceUrl'])
        if key in positions:
            index = positions[key]
            items[index] = {**item, 'id': items[index]['id']}
        else:
            positions[key] = len(items)
            items.append(item)
    return sorted(items, key=lambda item: (item['date'], item['time']), reverse=True)


def main():
    now = datetime.now(timezone.utc)
    incoming, failures = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        jobs = {pool.submit(fetch_feed, feed, now): feed[0] for feed in FEEDS}
        for job in concurrent.futures.as_completed(jobs):
            source = jobs[job]
            try:
                items = job.result()
                incoming.extend(items)
                print(f'{source}: {len(items)} articles')
            except Exception as error:
                failures.append(source)
                print(f'WARNING: {source}: {error}', file=sys.stderr)
    if not incoming:
        raise SystemExit('No articles received; existing files left unchanged.')
    data_path = ROOT / 'src/data/news-data.json'
    data = json.loads(data_path.read_text())
    news = merge_news(data['news'], incoming)
    if news == data['news']:
        print('No news changes.')
        return
    dates = sorted({item['date'] for item in news}, reverse=True)
    available = [{'value': date, 'label': datetime.fromisoformat(date).strftime('%B %d, %Y').replace(' 0', ' ')} for date in dates]
    output = dict(lastUpdated=now.isoformat().replace('+00:00', 'Z'), availableDates=available, news=news)
    preview = dict(latestDate=dates[0], latestLabel=available[0]['label'], items=[
        {key: item[key] for key in ('id', 'title', 'tag', 'date', 'time', 'category')}
        for item in news if item['date'] == dates[0]
    ][:3])
    data_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'src/data/newsPreview.ts').write_text('export const newsPreview = ' + json.dumps(preview, ensure_ascii=False, indent=2) + ' as const;\n\nexport type NewsPreviewItem = (typeof newsPreview.items)[number];\n')
    print(f'Synced {len(incoming)} feed articles; archive: {len(news)}; latest: {dates[0]}; failed feeds: {len(failures)}')


if __name__ == '__main__':
    main()
