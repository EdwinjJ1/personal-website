import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { STR, addDays, countLine, dayLabel, dayUrl, fmtNum, renderGithub, tipLabel, viewName, wallGrid, wallStats } from '../site/js/github.js';

// 2026-02-26 是周四；2 月 28 日之后是 3 月 1 日（非闰年）
const view = Object.freeze({ id: 'last', total: 31, from: '2026-02-26', to: '2026-03-06', counts: [1, 0, 2, 3, 4, 0, 0, 5, 16], levels: '101220014' });

test('日期工具：跨月加天数、中英文日期、千分位', () => {
  assert.equal(addDays('2026-02-28', 1), '2026-03-01');
  assert.equal(addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(addDays('2026-01-01', -1), '2025-12-31');
  assert.equal(dayLabel('2026-05-14', 'zh'), '2026 年 5 月 14 日');
  assert.equal(dayLabel('2026-05-14', 'en'), 'May 14, 2026');
  assert.equal(fmtNum(2516), '2,516');
  assert.equal(fmtNum(undefined), '0');
});

test('wallGrid：一列一周、周日在上，前后补空，按天对上次数和档位', () => {
  const { weeks, months } = wallGrid(view);
  assert.equal(weeks.length, 2);
  weeks.forEach((w) => assert.equal(w.length, 7));
  assert.deepEqual(weeks[0].slice(0, 4), [null, null, null, null]);          // 周日到周三不在范围里
  assert.deepEqual(weeks[0][4], { date: '2026-02-26', count: 1, level: 1, future: false });
  assert.deepEqual(weeks[1][0], { date: '2026-03-01', count: 3, level: 2, future: false });
  assert.deepEqual(weeks[1][5], { date: '2026-03-06', count: 16, level: 4, future: false });
  assert.equal(weeks[1][6], null);
  assert.deepEqual(months, [{ col: 1, month: 3 }]);      // 开头的 2 月只有三天，不标
});

test('wallGrid：年份视图铺满整年，今天之后的格子是 future', () => {
  const year = { id: '2026', total: 3, from: '2026-01-01', to: '2026-01-03', counts: [1, 0, 2], levels: '102' };
  const { weeks, months } = wallGrid(year);
  const cells = weeks.flat().filter(Boolean);
  assert.equal(cells.length, 365);
  assert.equal(weeks.length, 53);
  assert.deepEqual(cells[2], { date: '2026-01-03', count: 2, level: 2, future: false });
  assert.deepEqual(cells[3], { date: '2026-01-04', count: 0, level: 0, future: true });
  assert.equal(cells.at(-1).date, '2026-12-31');
  assert.deepEqual(months.map((m) => m.month), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(months[0].col, 0);
});

test('wallStats：活跃天数、最长连续、当前连续（今天没提交不算断）、单日最高', () => {
  const s = wallStats(view);
  assert.equal(s.total, 31);
  assert.equal(s.active, 6);
  assert.equal(s.days, 9);
  assert.deepEqual(s.longest, { days: 3, from: '2026-02-28', to: '2026-03-02' });
  assert.equal(s.current, 2);
  assert.deepEqual(s.best, { count: 16, date: '2026-03-06' });
  assert.equal(wallStats({ ...view, counts: [...view.counts.slice(0, -1), 0] }).current, 1);   // 今天还是 0：从昨天往前数
  const empty = wallStats({ ...view, total: 0, counts: [0, 0, 0] });
  assert.deepEqual([empty.active, empty.current, empty.longest.days, empty.best.date], [0, 0, 0, null]);
});

test('文案：一天的那一行、桌上的标签、视图名', () => {
  assert.equal(countLine({ date: '2026-05-14', count: 12, future: false }, 'zh'), '2026 年 5 月 14 日 · 12 次贡献');
  assert.equal(countLine({ date: '2026-05-14', count: 1, future: false }, 'en'), '1 contribution on May 14, 2026');
  assert.equal(countLine({ date: '2026-05-14', count: 0, future: false }, 'en'), 'No contributions on May 14, 2026');
  assert.equal(countLine({ date: '2026-12-01', count: 0, future: true }, 'zh'), '2026 年 12 月 1 日 · 还没到');
  assert.equal(countLine({ date: '2026-05-14', count: 1234, future: false }, 'en'), '1,234 contributions on May 14, 2026');
  assert.equal(tipLabel({ views: [{ total: 2516 }] }, 'zh'), 'GitHub · 过去一年 2,516 次贡献');
  assert.equal(tipLabel({ views: [{ total: 2516 }] }, 'en'), 'GitHub · 2,516 contributions in the last year');
  assert.equal(viewName(view, 'zh'), '过去一年');
  assert.equal(viewName({ id: '2025' }, 'en'), '2025');
  Object.entries(STR).forEach(([k, pair]) => assert.ok(pair.zh != null && pair.en != null, k));
});

test('dayUrl：只拼合法的用户名和日期', () => {
  assert.equal(dayUrl('EdwinjJ1', '2026-05-14'), 'https://github.com/EdwinjJ1?tab=overview&from=2026-05-14&to=2026-05-14');
  assert.equal(dayUrl('evil/../x', '2026-05-14'), 'https://github.com/');
  assert.equal(dayUrl('EdwinjJ1', '2026-05-14&x=1'), 'https://github.com/');
  assert.equal(dayUrl(undefined, undefined), 'https://github.com/');
});

// 极简的假 DOM：够 renderGithub 用就行
function fakeDom() {
  const make = (tag, cls, text) => {
    const node = {
      tag, className: cls || '', textContent: text ?? '', children: [], attrs: {}, dataset: {}, listeners: {},
      append(...kids) { node.children.push(...kids); },
      replaceChildren(...kids) { node.children = kids; },
      setAttribute(k, v) { node.attrs[k] = String(v); },
      getAttribute(k) { return node.attrs[k] ?? null; },
      addEventListener(type, fn) { node.listeners[type] = fn; },
    };
    return node;
  };
  const svg = (tag, attrs) => { const node = make(tag); Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v)); return node; };
  const find = (node, pred, out = []) => { if (pred(node)) out.push(node); node.children.forEach((c) => find(c, pred, out)); return out; };
  const opened = [];
  const h = { el: make, svg, extLink: (cls, text, href) => Object.assign(make('a', cls, text), { href }), lang: () => 'zh', open: (url) => opened.push(url), touch: () => false, reduceMotion: true };
  return { h, body: make('div'), find, opened };
}

const data = {
  user: 'EdwinjJ1', url: 'https://github.com/EdwinjJ1', updated: '2026-03-06T09:00:00+00:00',
  profile: { repos: 39, followers: 47, since: '2024-04-08' },
  views: [view, { id: '2025', total: 2, from: '2025-01-01', to: '2025-12-31', counts: Array.from({ length: 365 }, (_, i) => (i === 9 ? 2 : 0)), levels: '0'.repeat(9) + '4' + '0'.repeat(355) }],
};

test('renderGithub：默认是过去一年；悬停看那天，点一下去 GitHub；切年份重画', () => {
  const { h, body, find, opened } = fakeDom();
  renderGithub(body, data, h);
  const chips = find(body, (n) => n.className === 'chip');
  assert.deepEqual(chips.map((c) => c.textContent), ['过去一年 · 31', '2025 · 2']);
  assert.equal(chips[0].attrs['aria-pressed'], 'true');
  assert.equal(find(body, (n) => n.tag === 'strong')[0].textContent, '31');
  const rects = () => find(body, (n) => n.tag === 'rect' && n.attrs.class?.startsWith('gh-c'));
  assert.equal(rects().length, 9);
  const svg = find(body, (n) => n.tag === 'svg')[0];
  const readout = find(body, (n) => n.className === 'gh-readout')[0];
  assert.equal(readout.textContent, STR.hint.zh);

  const day = rects().find((r) => r.attrs['data-l'] === '4');
  svg.listeners.pointermove({ pointerType: 'mouse', target: day });
  assert.equal(readout.textContent, '2026 年 3 月 6 日 · 16 次贡献');
  const mark = find(body, (n) => n.attrs.class?.startsWith('gh-mark'))[0];
  assert.equal(mark.attrs.class, 'gh-mark on');
  assert.equal(mark.attrs.x, day.attrs.x);
  svg.listeners.click({ target: day });
  assert.deepEqual(opened, ['https://github.com/EdwinjJ1?tab=overview&from=2026-03-06&to=2026-03-06']);
  svg.listeners.pointerleave({ pointerType: 'mouse' });
  assert.equal(mark.attrs.class, 'gh-mark');

  svg.listeners.keydown({ key: 'ArrowLeft', preventDefault() {} });          // 没选中时从最后一天往前一周
  assert.equal(readout.textContent, '2026 年 2 月 27 日 · 没有贡献');
  svg.listeners.keydown({ key: 'Enter', preventDefault() {} });
  assert.equal(opened.at(-1), 'https://github.com/EdwinjJ1?tab=overview&from=2026-02-27&to=2026-02-27');

  chips[1].listeners.click();
  assert.equal(chips[1].attrs['aria-pressed'], 'true');
  assert.equal(rects().length, 365);
  assert.equal(find(body, (n) => n.className === 'gh-total')[0].children[1].textContent, '次贡献 · 2025 年');
  const labels = find(body, (n) => n.tag === 'dt').map((n) => n.textContent);
  assert.ok(!labels.includes(STR.current.zh), '过去的年份没有「当前连续」');
  assert.ok(find(body, (n) => n.tag === 'a').some((a) => a.href === 'https://github.com/EdwinjJ1'));
});

test('renderGithub：触屏第一下只看是哪天，同一格再点才跳', () => {
  const { h, body, find, opened } = fakeDom();
  renderGithub(body, data, { ...h, touch: () => true });
  const svg = find(body, (n) => n.tag === 'svg')[0];
  const day = find(body, (n) => n.tag === 'rect' && n.attrs['data-k'] === '0')[0];
  svg.listeners.pointerdown({ pointerType: 'touch' });
  svg.listeners.click({ target: day });
  assert.deepEqual(opened, []);
  svg.listeners.click({ target: day });
  assert.equal(opened.length, 1);
});

test('renderGithub：没有数据时给一句话，不报错', () => {
  const { h, body, find } = fakeDom();
  renderGithub(body, { views: [] }, h);
  assert.equal(find(body, (n) => n.tag === 'p')[0].textContent, STR.empty.zh);
});

test('github.json 快照：过去一年在最前，每个视图的天数、档位和日期范围对得上', () => {
  const doc = JSON.parse(readFileSync(new URL('../site/assets/data/github.json', import.meta.url), 'utf8'));
  assert.equal(doc.user, 'EdwinjJ1');
  assert.equal(doc.views[0].id, 'last');
  doc.views.forEach((v) => {
    assert.equal(v.counts.length, v.levels.length, v.id);
    assert.equal(addDays(v.from, v.counts.length - 1), v.to, v.id);
    assert.match(v.levels, /^[0-4]+$/);
    v.counts.forEach((c, i) => assert.equal(c > 0, v.levels[i] !== '0', `${v.id} ${addDays(v.from, i)}`));
  });
  assert.ok(wallGrid(doc.views[0]).weeks.length <= 54);
});
