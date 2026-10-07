import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { STR, calendarCells, dateLabel, latestInMonth, monthKeys, monthLabel, monthOf, neighborMonth, renderNews } from '../site/js/news.js';

const days = Object.freeze([
  { d: '2026-10-07', n: 48 }, { d: '2026-10-05', n: 62 }, { d: '2026-09-30', n: 12 }, { d: '2026-02-10', n: 3 },
]);

test('月份：从日期取月份，档案里的月份新的在前', () => {
  assert.equal(monthOf('2026-10-07'), '2026-10');
  assert.deepEqual(monthKeys(days), ['2026-10', '2026-09', '2026-02']);
  assert.deepEqual(monthKeys([]), []);
});

test('标签：中英文的月份和日期', () => {
  assert.equal(monthLabel('2026-10', 'zh'), '2026 年 10 月');
  assert.equal(monthLabel('2026-02', 'en'), 'February 2026');
  assert.equal(dateLabel('2026-10-07', 'zh'), '2026 年 10 月 7 日');
  assert.equal(dateLabel('2026-10-07', 'en'), 'October 7, 2026');
});

test('calendarCells：周日开头补空格，每天一格并带上当天条数', () => {
  const cells = calendarCells('2026-10', days);          // 2026-10-01 是周四
  assert.equal(cells.filter((c) => c.date === null).length, 4);
  assert.equal(cells.length, 4 + 31);
  assert.deepEqual(cells[4], { date: '2026-10-01', day: 1, count: 0 });
  assert.deepEqual(cells.find((c) => c.date === '2026-10-07'), { date: '2026-10-07', day: 7, count: 48 });
  assert.equal(cells.filter((c) => c.count > 0).length, 2);
  assert.equal(calendarCells('2026-02', days).length, 0 + 28);   // 2026-02-01 是周日，非闰年
  assert.equal(calendarCells('2028-02', []).filter((c) => c.date).length, 29);
});

test('neighborMonth：只在有新闻的月份之间走，到头返回 null', () => {
  const keys = monthKeys(days);
  assert.equal(neighborMonth(keys, '2026-10', -1), '2026-09');
  assert.equal(neighborMonth(keys, '2026-09', -1), '2026-02');
  assert.equal(neighborMonth(keys, '2026-09', 1), '2026-10');
  assert.equal(neighborMonth(keys, '2026-10', 1), null);
  assert.equal(neighborMonth(keys, '2026-02', -1), null);
  assert.equal(neighborMonth(keys, '2025-01', 1), null);
});

test('latestInMonth：取这个月最新的一天', () => {
  assert.equal(latestInMonth(days, '2026-10'), '2026-10-07');
  assert.equal(latestInMonth(days, '2026-09'), '2026-09-30');
  assert.equal(latestInMonth(days, '2026-08'), null);
});

test('文案中英文齐全，星期各 7 个', () => {
  Object.entries(STR).forEach(([key, pair]) => ['zh', 'en'].forEach((l) => assert.ok(pair[l]?.length, `${key}.${l}`)));
  assert.equal(STR.weekdays.zh.length, 7);
  assert.equal(STR.weekdays.en.length, 7);
});

// 一个只够 renderNews 用的假 DOM：记录结构，不依赖浏览器
function fakeDom() {
  const make = (tag, cls, text) => {
    const node = {
      tag, className: cls || '', textContent: text ?? '', children: [], attrs: {}, dataset: {}, listeners: {}, disabled: false,
      append(...kids) { node.children.push(...kids); },
      replaceChildren(...kids) { node.children = kids; },
      setAttribute(k, v) { node.attrs[k] = v; },
      addEventListener(type, fn) { node.listeners[type] = fn; },
    };
    return node;
  };
  const find = (node, pred, out = []) => { if (pred(node)) out.push(node); node.children.forEach((c) => find(c, pred, out)); return out; };
  return { h: { el: make, extLink: (cls, text, href) => Object.assign(make('a', cls, text), { href }), lang: () => 'zh' }, body: make('div'), find };
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

test('renderNews：默认停在最新一天，点另一天就加载那天的新闻', async () => {
  const { h, body, find } = fakeDom();
  const files = {
    'assets/data/news/index.json': { updated: '2026-10-07T13:00:00Z', days: [{ d: '2026-10-07', n: 2, c: {} }, { d: '2026-10-05', n: 1, c: {} }] },
    'assets/data/news/2026-10-07.json': [{ title: 'new A', url: 'https://a.example', source: 'S', category: 'ai', time: '12:00', summary: '' }, { title: 'new B', url: 'https://b.example', source: 'S', category: 'global', time: '09:00', summary: 'sum' }],
    'assets/data/news/2026-10-05.json': [{ title: 'old C', url: 'https://c.example', source: 'S', category: 'ai', time: '08:00', summary: '' }],
  };
  const asked = [];
  const load = (url) => { asked.push(url); return url in files ? Promise.resolve(files[url]) : Promise.reject(new Error('404')); };
  await renderNews(body, { updated: '', items: [] }, h, load);
  await settle();
  const titles = () => find(body, (n) => n.className === 'news-item').map((n) => n.children.find((c) => c.tag === 'strong').textContent);
  assert.deepEqual(titles(), ['new A', 'new B']);
  assert.equal(find(body, (n) => n.className === 'cal-title')[0].textContent, '2026 年 10 月');
  const dayButtons = find(body, (n) => n.className === 'cal-day');
  assert.equal(dayButtons.length, 31);
  assert.equal(dayButtons.filter((b) => !b.disabled).length, 2);
  assert.equal(dayButtons[6].attrs['aria-pressed'], 'true');

  dayButtons[4].listeners.click();            // 点 10 月 5 日
  await settle();
  assert.deepEqual(titles(), ['old C']);
  assert.ok(asked.includes('assets/data/news/2026-10-05.json'));
  assert.equal(find(body, (n) => n.className === 'cal-day')[4].attrs['aria-pressed'], 'true');

  const chips = find(body, (n) => n.className === 'chip');     // 回到 7 日后按分类筛
  find(body, (n) => n.className === 'cal-day')[6].listeners.click();
  await settle();
  find(body, (n) => n.className === 'chip').find((c) => c.dataset.cat === 'global').listeners.click();
  assert.deepEqual(titles(), ['new B']);
  assert.ok(chips.length >= 2);
});

test('renderNews：档案加载不到时退回最近新闻列表', async () => {
  const { h, body, find } = fakeDom();
  await renderNews(body, { updated: '2026-10-07', items: [{ title: 'recent', url: 'https://r.example', source: 'S', category: 'ai', date: '2026-10-07', summary: '' }] }, h, () => Promise.reject(new Error('offline')));
  assert.equal(find(body, (n) => n.className === 'cal').length, 0);
  assert.deepEqual(find(body, (n) => n.className === 'news-item').map((n) => n.children[1].textContent), ['recent']);
});

test('档案文件和索引对得上（跑过 import 之后才检查）', { skip: !existsSync(new URL('../site/assets/data/news/index.json', import.meta.url)) }, () => {
  const index = JSON.parse(readFileSync(new URL('../site/assets/data/news/index.json', import.meta.url), 'utf8'));
  assert.ok(index.days.length > 0);
  assert.deepEqual(index.days.map((x) => x.d), [...index.days.map((x) => x.d)].sort().reverse());
  index.days.forEach((entry) => {
    const items = JSON.parse(readFileSync(new URL(`../site/assets/data/news/${entry.d}.json`, import.meta.url), 'utf8'));
    assert.equal(items.length, entry.n, entry.d);
    items.forEach((n) => assert.match(n.url, /^https?:\/\//));
  });
});
