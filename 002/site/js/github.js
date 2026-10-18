// GitHub 贡献墙：面板里那张一整年的格子图，加上总数、连续天数这些数字。
// 数据是 assets/data/github.json（sync_github.py 每次部署前同步，仓库里留一份快照）。
// 排格子、算连续天数是纯函数（可测）；renderGithub 负责画。文案放在这里，不占 content.js。

const L = (zh, en) => ({ zh, en });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_MS = 86400000;

export const STR = {
  last: L('过去一年', 'Last year'),
  years: L('选一段时间', 'Pick a period'),
  totalLast: L('次贡献 · 过去一年', 'contributions in the last year'),
  totalYear: L('次贡献 · {y} 年', 'contributions in {y}'),
  hint: L('移到格子上看是哪一天，点一下去 GitHub 看那天做了什么。', 'Hover a square to see the day; click it to see what I shipped that day on GitHub.'),
  hintTouch: L('点格子看是哪一天，再点一下去 GitHub 看那天做了什么。', 'Tap a square to see the day; tap it again to open that day on GitHub.'),
  day: L('{date} · {n} 次贡献', '{n} contributions on {date}'),
  dayOne: L('{date} · 1 次贡献', '1 contribution on {date}'),
  dayNone: L('{date} · 没有贡献', 'No contributions on {date}'),
  dayFuture: L('{date} · 还没到', '{date} · not yet'),
  less: L('少', 'Less'),
  more: L('多', 'More'),
  weekdays: L(['', '一', '', '三', '', '五', ''], ['', 'Mon', '', 'Wed', '', 'Fri', '']),
  active: L('活跃天数', 'Active days'),
  longest: L('最长连续', 'Longest streak'),
  current: L('当前连续', 'Current streak'),
  best: L('单日最高', 'Best day'),
  days: L('{n} 天', '{n} days'),
  ofDays: L('共 {n} 天', 'of {n}'),
  times: L('{n} 次', '{n}'),
  profile: L('{repos} 个公开仓库 · {followers} 位关注者 · {since} 加入 GitHub', '{repos} public repos · {followers} followers · on GitHub since {since}'),
  open: L('在 GitHub 上看 →', 'Open on GitHub →'),
  synced: L('每 6 小时同步一次 · 更新于', 'Synced every 6 hours · updated'),
  tip: L('GitHub · 过去一年 {n} 次贡献', 'GitHub · {n} contributions in the last year'),
  wall: L('{name}的 GitHub 贡献墙：{n} 次贡献，最长连续 {streak} 天', '{name} GitHub contributions: {n} in total, longest streak {streak} days'),
  empty: L('贡献数据暂时没加载出来。', 'The contribution data did not load.'),
};

const fill = (s, vars) => Object.entries(vars).reduce((t, [k, v]) => t.split(`{${k}}`).join(String(v)), s);
const msOf = (iso) => Date.parse(`${iso}T00:00:00Z`);

export const fmtNum = (n) => Number(n || 0).toLocaleString('en-US');
export const addDays = (iso, n) => new Date(msOf(iso) + n * DAY_MS).toISOString().slice(0, 10);
const weekday = (iso) => new Date(msOf(iso)).getUTCDay();
const daysBetween = (a, b) => Math.round((msOf(b) - msOf(a)) / DAY_MS);
const isYear = (view) => /^\d{4}$/.test(view.id);

export function dayLabel(date, lang) {
  const [y, m, d] = date.split('-').map(Number);
  return lang === 'zh' ? `${y} 年 ${m} 月 ${d} 日` : `${MONTHS_LONG[m - 1]} ${d}, ${y}`;
}

const shortDate = (date) => date.slice(5).replace('-', '.');

/** 一天的那一行字：「2026 年 5 月 14 日 · 12 次贡献」。 */
export function countLine(cell, lang) {
  const date = dayLabel(cell.date, lang);
  const key = cell.future ? 'dayFuture' : cell.count === 0 ? 'dayNone' : cell.count === 1 ? 'dayOne' : 'day';
  return fill(STR[key][lang], { date, n: fmtNum(cell.count) });
}

export const viewName = (view, lang) => (isYear(view) ? view.id : STR.last[lang]);

/** 桌上悬停时的标签：带上过去一年的总数。 */
export const tipLabel = (data, lang) => fill(STR.tip[lang], { n: fmtNum(data.views?.[0]?.total) });

/** 点格子跳去 GitHub 上那一天的动态。用户名和日期不对就只回首页，不拼出奇怪的地址。 */
export function dayUrl(user, date) {
  const ok = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(user || '') && /^\d{4}-\d{2}-\d{2}$/.test(date || '');
  return ok ? `https://github.com/${user}?tab=overview&from=${date}&to=${date}` : 'https://github.com/';
}

/**
 * 一个视图的格子：一列一周，每列从周日到周六，从旧到新，和 GitHub 上那张图一样。
 * 年份视图铺满整年，今天之后的日子 future = true；第一周开头、最后一周末尾不在范围里的格子是 null。
 * 返回 { weeks: [[cell | null] × 7], months: [{ col, month }] }，cell = { date, count, level, future }。
 */
export function wallGrid(view) {
  const end = isYear(view) ? `${view.id}-12-31` : view.to;
  const lead = weekday(view.from);
  const length = daysBetween(view.from, end) + 1;
  const days = Array.from({ length }, (_, i) => {
    const future = i >= view.counts.length;
    return { date: addDays(view.from, i), count: future ? 0 : view.counts[i], level: future ? 0 : Number(view.levels[i]) || 0, future };
  });
  const cells = [...Array(lead).fill(null), ...days];
  const tail = (7 - (cells.length % 7)) % 7;
  const padded = [...cells, ...Array(tail).fill(null)];
  const weeks = Array.from({ length: padded.length / 7 }, (_, w) => padded.slice(w * 7, w * 7 + 7));
  const months = weeks.flatMap((week, col) => week.filter((c) => c && c.date.endsWith('-01')).map((c) => ({ col, month: Number(c.date.slice(5, 7)) })));
  // 开头那个不满一个月的月份：离下一个月名够远才标，不然两个月名挤在一起（GitHub 也是这样）
  const head = view.from.endsWith('-01') || (months[0]?.col ?? Infinity) < 3 ? [] : [{ col: 0, month: Number(view.from.slice(5, 7)) }];
  return { weeks, months: [...head, ...months] };
}

/** 一个视图的几个数字。当前连续：今天还没提交不算断，从昨天往前数（GitHub 也是这样）。 */
export function wallStats(view) {
  const { counts } = view;
  const runs = counts.reduce((acc, c, i) => {
    const run = c > 0 ? acc.run + 1 : 0;
    return { run, best: run > acc.best.days ? { days: run, end: i } : acc.best };
  }, { run: 0, best: { days: 0, end: -1 } }).best;
  const last = counts.length - 1;
  const from = counts[last] === 0 ? last - 1 : last;
  const before = counts.slice(0, from + 1).reverse();
  const gap = before.findIndex((c) => c === 0);
  const top = counts.reduce((m, c, i) => (c > m.count ? { count: c, i } : m), { count: 0, i: -1 });
  return {
    total: view.total,
    active: counts.filter((c) => c > 0).length,
    days: counts.length,
    longest: runs.days ? { days: runs.days, from: addDays(view.from, runs.end - runs.days + 1), to: addDays(view.from, runs.end) } : { days: 0, from: null, to: null },
    current: gap === -1 ? before.length : gap,
    best: top.i >= 0 ? { count: top.count, date: addDays(view.from, top.i) } : { count: 0, date: null },
  };
}

// 格子的几何：边长、间距、左边星期、上面月份各占多少（SVG 单位，整张图按面板宽度缩放）
const CELL = 10;
const PITCH = 12.5;
const LEFT = 24;
const TOP = 15;

/**
 * 画贡献墙。h = { el, svg, extLink, lang, open(url), touch(), reduceMotion }：
 * svg(tag, attrs) 建 SVG 节点，open 在新标签页打开链接，touch() 说现在是不是触屏（换提示语）。
 */
export function renderGithub(body, data, h) {
  const tr = (pair) => pair[h.lang()] ?? pair.zh;
  const views = data?.views || [];
  if (!views.length) { body.append(h.el('p', null, tr(STR.empty))); return; }
  const today = views[0].to;

  const years = h.el('div', 'chips gh-years');
  years.setAttribute('role', 'group');
  years.setAttribute('aria-label', tr(STR.years));
  const total = h.el('p', 'gh-total');
  const wall = h.el('div', 'gh-wall');
  const readout = h.el('p', 'gh-readout');
  readout.setAttribute('aria-live', 'polite');
  const legend = h.el('p', 'gh-legend');
  legend.setAttribute('aria-hidden', 'true');
  legend.append(h.el('span', null, tr(STR.less)), ...[0, 1, 2, 3, 4].map((l) => { const sw = h.el('i', 'gh-sw'); sw.dataset.l = String(l); return sw; }), h.el('span', null, tr(STR.more)));
  const foot = h.el('div', 'gh-foot');
  foot.append(readout, legend);
  const stats = h.el('dl', 'stats gh-stats');
  const links = h.el('div', 'links');
  links.append(h.extLink('btn', tr(STR.open), data.url));
  body.append(years, total, wall, foot, stats);
  const p = data.profile;
  if (p) body.append(h.el('p', 'meta', fill(tr(STR.profile), { repos: p.repos, followers: p.followers, since: h.lang() === 'zh' ? p.since.slice(0, 7).replace('-', '.') : `${MONTHS[Number(p.since.slice(5, 7)) - 1]} ${p.since.slice(0, 4)}` })));
  body.append(links, h.el('p', 'meta', `${tr(STR.synced)} ${String(data.updated || '').slice(0, 10)}`));

  const hint = () => tr(h.touch() ? STR.hintTouch : STR.hint);
  let cells = [];        // [{ cell, node }]，按日期从旧到新
  let mark = null;       // 选中那格上面盖的一块放大的高亮，画在最上层，不被邻居盖住
  let picked = -1;
  let pointer = 'mouse';

  const pick = (k) => {
    if (k === picked) return;
    picked = cells[k] ? k : -1;
    const it = cells[picked];
    if (!it) { mark?.setAttribute('class', 'gh-mark'); readout.textContent = hint(); return; }
    ['x', 'y', 'data-l'].forEach((a) => mark.setAttribute(a, it.node.getAttribute(a)));
    mark.setAttribute('class', it.cell.future ? 'gh-mark on gh-future' : 'gh-mark on');
    readout.textContent = countLine(it.cell, h.lang());
  };
  const open = (k) => { const c = cells[k]?.cell; if (c && !c.future) h.open(dayUrl(data.user, c.date)); };
  const keyOf = (node) => { const k = Number(node?.getAttribute?.('data-k')); return Number.isInteger(k) ? k : -1; };

  const stat = (label, value, detail) => {
    const cell = h.el('div');
    const dd = h.el('dd', null, value);
    if (detail) dd.append(h.el('small', null, detail));
    cell.append(h.el('dt', null, label), dd);
    return cell;
  };

  function countUp(node, to) {
    if (h.reduceMotion || typeof requestAnimationFrame !== 'function' || to < 20) { node.textContent = fmtNum(to); return; }
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / 700);
      node.textContent = fmtNum(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1 && node.isConnected) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function drawWall(view, s) {
    const { weeks, months } = wallGrid(view);
    const lang = h.lang();
    const svg = h.svg('svg', { viewBox: `0 0 ${LEFT + weeks.length * PITCH} ${TOP + 7 * PITCH}`, class: 'gh-svg', role: 'img', tabindex: '0',
      'aria-label': fill(tr(STR.wall), { name: lang === 'zh' ? 'Evan ' : 'Evan’s', n: fmtNum(view.total), streak: s.longest.days }) });
    months.forEach((m) => {
      const t = h.svg('text', { x: LEFT + m.col * PITCH, y: TOP - 5 });
      t.textContent = lang === 'zh' ? `${m.month}月` : MONTHS[m.month - 1];
      svg.append(t);
    });
    tr(STR.weekdays).forEach((name, row) => {
      if (!name) return;
      const t = h.svg('text', { x: LEFT - 5, y: TOP + row * PITCH + CELL - 1.5, 'text-anchor': 'end' });
      t.textContent = name;
      svg.append(t);
    });
    cells = weeks.flatMap((week, col) => week.map((cell, row) => ({ cell, col, row })).filter((x) => x.cell)).map(({ cell, col, row }, k) => {
      const node = h.svg('rect', { x: LEFT + col * PITCH, y: TOP + row * PITCH, width: CELL, height: CELL, rx: 2, class: cell.future ? 'gh-c gh-future' : 'gh-c', 'data-l': cell.level, 'data-k': k, style: `--w:${col}` });
      svg.append(node);
      return { cell, node };
    });
    mark = h.svg('rect', { class: 'gh-mark', x: 0, y: 0, width: CELL, height: CELL, rx: 2, 'aria-hidden': 'true' });
    svg.append(mark);
    picked = -1;
    svg.addEventListener('pointerdown', (ev) => { pointer = ev.pointerType; });
    svg.addEventListener('pointermove', (ev) => { if (ev.pointerType === 'mouse') pick(keyOf(ev.target)); });
    svg.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') pick(-1); });
    // 鼠标点一下就去 GitHub；触屏没有悬停，第一下先看是哪一天，同一格再点一下才跳
    svg.addEventListener('click', (ev) => {
      const k = keyOf(ev.target);
      if (k < 0) return;
      const first = pointer !== 'mouse' && picked !== k;
      pick(k);
      if (!first) open(k);
    });
    // 键盘：左右是前后一周，上下是前后一天，回车打开那一天
    svg.addEventListener('keydown', (ev) => {
      const step = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[ev.key];
      if (step) {
        ev.preventDefault();
        const live = cells.map((x, k) => (x.cell.future ? -1 : k)).filter((k) => k >= 0);
        const from = picked >= 0 ? picked : live[live.length - 1];
        pick(Math.max(live[0], Math.min(live[live.length - 1], from + step)));
      } else if ((ev.key === 'Enter' || ev.key === ' ') && picked >= 0) {
        ev.preventDefault();
        open(picked);
      }
    });
    svg.addEventListener('blur', () => pick(-1));
    wall.replaceChildren(svg);
    readout.textContent = hint();
  }

  function show(view) {
    const s = wallStats(view);
    const lang = h.lang();
    chips.forEach((b, i) => b.setAttribute('aria-pressed', String(views[i] === view)));
    const num = h.el('strong', null, '0');
    total.replaceChildren(num, h.el('span', null, isYear(view) ? fill(tr(STR.totalYear), { y: view.id }) : tr(STR.totalLast)));
    countUp(num, view.total);
    drawWall(view, s);
    const range = (a, b) => (a === b ? shortDate(a) : `${shortDate(a)} – ${shortDate(b)}`);
    stats.replaceChildren(
      stat(tr(STR.active), fill(tr(STR.days), { n: s.active }), fill(tr(STR.ofDays), { n: s.days })),
      stat(tr(STR.longest), fill(tr(STR.days), { n: s.longest.days }), s.longest.from ? range(s.longest.from, s.longest.to) : ''),
      ...(view.to === today ? [stat(tr(STR.current), fill(tr(STR.days), { n: s.current }))] : []),
      stat(tr(STR.best), fill(tr(STR.times), { n: fmtNum(s.best.count) }), s.best.date ? (lang === 'zh' ? shortDate(s.best.date) : `${MONTHS[Number(s.best.date.slice(5, 7)) - 1]} ${Number(s.best.date.slice(8))}`) : ''),
    );
  }

  const chips = views.map((view) => {
    const b = h.el('button', 'chip', `${viewName(view, h.lang())} · ${fmtNum(view.total)}`);
    b.type = 'button';
    b.addEventListener('click', () => show(view));
    years.append(b);
    return b;
  });
  show(views[0]);
}
