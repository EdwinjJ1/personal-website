import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapNews, mapProjects, pickPhotos } from '../pipeline/import_legacy.mjs';

test('mapNews：每个分类限量、按日期倒序、丢掉没有合法链接的', () => {
  const raw = [
    { title: 'old ai', sourceUrl: 'https://a.example/1', source: 'A', date: '2026-01-01', category: 'ai' },
    { title: 'new ai', sourceUrl: 'https://a.example/2', source: 'A', date: '2026-03-01', category: 'AI' },
    { title: 'mid ai', sourceUrl: 'https://a.example/3', source: 'A', date: '2026-02-01', category: 'ai' },
    { title: 'bad link', sourceUrl: 'javascript:alert(1)', date: '2026-04-01', category: 'ai' },
    { title: 'world', url: 'http://b.example', date: '2026-02-15', category: 'global', summary: 'x'.repeat(400) },
    { title: '', sourceUrl: 'https://c.example', date: '2026-05-01', category: 'ai' },
  ];
  const out = mapNews(raw, 2);
  assert.deepEqual(out.map((n) => n.title), ['new ai', 'world', 'mid ai']);
  assert.ok(out.every((n) => /^https?:\/\//.test(n.url)));
  assert.equal(out[0].category, 'ai');
  assert.ok(out[1].summary.length <= 200);
});

test('pickPhotos：精选在前，其余按分类轮流取，不超过上限', () => {
  const list = [
    { title: 's1', category: 'Street' }, { title: 's2', category: 'Street' }, { title: 's3', category: 'Street' },
    { title: 'n1', category: 'Night' }, { title: 'f1', category: 'Night', featured: true }, { title: 'p1', category: 'Portrait' },
  ];
  assert.deepEqual(pickPhotos(list, 5).map((p) => p.title), ['f1', 's1', 'n1', 'p1', 's2']);
  assert.equal(pickPhotos(list, 99).length, list.length);
  assert.deepEqual(pickPhotos([], 5), []);
});

test('mapProjects：精选排前，字段归一，不改原数组', () => {
  const list = Object.freeze([
    { title: 'B', description: 'b', technologies: ['x'], category: 'Web', status: 'Live', featured: false, link: 'https://b.example' },
    { title: 'A', description: 'a', technologies: ['y'], category: 'AI', status: 'Live', featured: true, liveUrl: 'https://a.example', githubUrl: 'https://github.com/a' },
  ]);
  const out = mapProjects(list);
  assert.deepEqual(out.map((p) => p.title), ['A', 'B']);
  assert.deepEqual(out[0], { title: 'A', tagline: '', description: 'a', long: '', highlights: [], metrics: [], tech: ['y'], category: 'AI', status: 'Live', live: 'https://a.example', github: 'https://github.com/a', image: '' });
  const withImage = mapProjects([{ title: 'Chrono-Map: Sydney Layers', description: 'd', technologies: [], featured: true, heroImage: '/images/x.png', highlights: ['h'], metrics: [{ label: 'L', value: '1', extra: true }] }])[0];
  assert.equal(withImage.image, 'chrono-map-sydney-layers.webp');
  assert.deepEqual(withImage.metrics, [{ label: 'L', value: '1' }]);
  assert.equal(out[1].live, 'https://b.example');
  assert.equal(list[0].title, 'B');
});
