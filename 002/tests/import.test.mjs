import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildArchive, mapNews, mapProjects } from '../pipeline/import_legacy.mjs';

test('mapNews：每个分类限量、按日期倒序、丢掉没有合法链接的', () => {
  const raw = [
    { title: 'old ai', sourceUrl: 'https://a.example/1', source: 'A', date: '2026-01-01', category: 'ai' },
    { title: 'new ai', sourceUrl: 'https://a.example/2', source: 'A', date: '2026-03-01', category: 'AI' },
    { title: 'mid ai', sourceUrl: 'https://a.example/3', source: 'A', date: '2026-02-01', category: 'ai' },
    { title: 'bad link', sourceUrl: 'javascript:alert(1)', date: '2026-04-01', category: 'ai' },
    { title: 'world', url: 'http://b.example', date: '2026-02-15', category: 'global', summary: 'x'.repeat(400) },
    { title: 'paper', url: 'https://arxiv.example/1', date: '2026-01-15', category: 'research', summary: 'arXiv:2610.03872v1 Announce Type: new Abstract: Agents write code.' },
    { title: '', sourceUrl: 'https://c.example', date: '2026-05-01', category: 'ai' },
  ];
  const out = mapNews(raw, 2);
  assert.deepEqual(out.map((n) => n.title), ['new ai', 'world', 'mid ai', 'paper']);
  assert.equal(out[3].summary, 'Agents write code.');
  assert.ok(out.every((n) => /^https?:\/\//.test(n.url)));
  assert.equal(out[0].category, 'ai');
  assert.ok(out[1].summary.length <= 200);
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

test('buildArchive：按日期分组、每天每类限量、时间倒序，并给出每天的分类计数', () => {
  const mk = (title, date, time, category, extra = {}) => ({ title, sourceUrl: `https://x.example/${title}`, source: 'S', date, time, category, summary: 'arXiv:1 Announce Type: new Abstract: body', ...extra });
  const raw = Object.freeze([
    mk('a1', '2026-10-07', '08:00', 'ai'), mk('a2', '2026-10-07', '12:00', 'ai'), mk('a3', '2026-10-07', '10:00', 'ai'),
    mk('r1', '2026-10-07', '09:00', 'research'), mk('g1', '2026-10-06', '01:00', 'GLOBAL'),
    mk('bad date', '10/07', '01:00', 'ai'), mk('bad link', '2026-10-07', '01:00', 'ai', { sourceUrl: 'javascript:1' }),
  ]);
  const { index, days } = buildArchive(raw, 2);
  assert.deepEqual(index, [{ d: '2026-10-07', n: 3, c: { ai: 2, research: 1 } }, { d: '2026-10-06', n: 1, c: { global: 1 } }]);
  assert.deepEqual(days['2026-10-07'].map((n) => n.title), ['a2', 'a3', 'r1']);
  assert.deepEqual(days['2026-10-06'][0], { title: 'g1', url: 'https://x.example/g1', source: 'S', category: 'global', time: '01:00', summary: 'body' });
  assert.equal(raw.length, 7);
});
