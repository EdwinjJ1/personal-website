// 新闻面板：顶部一张月历，点哪天看哪天的新闻。
// 档案在 assets/data/news/：index.json 列出有新闻的日期和条数，每天一个 <日期>.json，点到才加载。
// 日历的计算是纯函数（可测）；renderNews 负责画。文案放在这里，不占 content.js。

const L = (zh, en) => ({ zh, en });
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const STR = {
  weekdays: L(['日', '一', '二', '三', '四', '五', '六'], ['S', 'M', 'T', 'W', 'T', 'F', 'S']),
  all: L('全部', 'All'),
  count: L('条', 'stories'),
  synced: L('每 6 小时同步一次 · 更新于', 'Synced every 6 hours · updated'),
  prev: L('更早的月份', 'Older month'),
  next: L('更新的月份', 'Newer month'),
  loading: L('加载中…', 'Loading…'),
  failed: L('这一天的新闻没加载出来，换一天试试。', 'Could not load this day. Try another one.'),
  recent: L('最近的新闻', 'Latest stories'),
};

export const monthOf = (date) => date.slice(0, 7);

/** 档案里出现过的月份，新的在前。 */
export const monthKeys = (days) => [...new Set(days.map((x) => monthOf(x.d)))].sort().reverse();

export function monthLabel(key, lang) {
  const [year, month] = key.split('-').map(Number);
  return lang === 'zh' ? `${year} 年 ${month} 月` : `${EN_MONTHS[month - 1]} ${year}`;
}

export function dateLabel(date, lang) {
  const [year, month, day] = date.split('-').map(Number);
  return lang === 'zh' ? `${year} 年 ${month} 月 ${day} 日` : `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}

/**
 * 一个月的格子（周日开头）：前面用空格补到 1 号是星期几，后面每天一格。
 * 每格 { date, day, count }；空格的 date 是 null，没有新闻的日子 count 是 0。
 */
export function calendarCells(key, days) {
  const [year, month] = key.split('-').map(Number);
  const lead = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const counts = new Map(days.map((x) => [x.d, x.n]));
  const blanks = Array.from({ length: lead }, () => ({ date: null, day: null, count: 0 }));
  const cells = Array.from({ length }, (_, i) => {
    const date = `${key}-${String(i + 1).padStart(2, '0')}`;
    return { date, day: i + 1, count: counts.get(date) || 0 };
  });
  return [...blanks, ...cells];
}

/** 相邻的有新闻的月份：step = +1 往新的走，-1 往旧的走；到头了返回 null。keys 是新的在前。 */
export function neighborMonth(keys, current, step) {
  const at = keys.indexOf(current);
  return at < 0 ? null : keys[at - step] ?? null;
}

/** 某个月里最新的一天（days 是新的在前）；这个月没有新闻返回 null。 */
export const latestInMonth = (days, key) => days.find((x) => monthOf(x.d) === key)?.d ?? null;

const fetchJson = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`news_${r.status}`))));

function storyNode(story, meta, h) {
  const a = h.extLink('news-item', '', story.url);
  a.append(h.el('span', 'meta', meta.filter(Boolean).join(' · ')), h.el('strong', null, story.title));
  if (story.summary) a.append(h.el('span', 'sum', story.summary));
  return a;
}

/** 分类筛选条 + 列表。返回一个 draw(stories, metaOf)，换一批新闻时重画并回到“全部”。 */
function storyList(body, h, t) {
  const chips = h.el('div', 'chips');
  const list = h.el('div', 'news-list');
  body.append(chips, list);
  return (stories, metaOf) => {
    const show = (cat) => {
      list.replaceChildren(...stories.filter((s) => cat === 'all' || s.category === cat).map((s) => storyNode(s, metaOf(s), h)));
      [...chips.children].forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === cat)));
    };
    chips.replaceChildren(...['all', ...new Set(stories.map((s) => s.category))].map((cat) => {
      const b = h.el('button', 'chip', cat === 'all' ? t(STR.all) : cat.toUpperCase());
      b.type = 'button';
      b.dataset.cat = cat;
      b.addEventListener('click', () => show(cat));
      return b;
    }));
    show('all');
  };
}

function mountCalendar(body, index, h, t, lang, load) {
  const days = index.days;
  const keys = monthKeys(days);
  const cache = new Map();
  let month = keys[0];
  let selected = days[0].d;

  const cal = h.el('section', 'cal');
  cal.setAttribute('aria-label', 'Calendar');
  const title = h.el('strong', 'cal-title');
  const nav = (label, text, step) => {
    const b = h.el('button', 'cal-nav', text);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      const next = neighborMonth(keys, month, step);
      if (next) pick(latestInMonth(days, next));
    });
    return b;
  };
  const older = nav(t(STR.prev), '←', -1);
  const newer = nav(t(STR.next), '→', 1);
  const head = h.el('div', 'cal-head');
  head.append(older, title, newer);
  const grid = h.el('div', 'cal-grid');
  cal.append(head, grid);

  const heading = h.el('p', 'news-date');
  body.append(h.el('p', 'meta', `${t(STR.synced)} ${String(index.updated).slice(0, 10)}`), cal, heading);
  const draw = storyList(body, h, t);

  const paint = () => {
    title.textContent = monthLabel(month, lang);
    older.disabled = !neighborMonth(keys, month, -1);
    newer.disabled = !neighborMonth(keys, month, 1);
    grid.replaceChildren(
      ...t(STR.weekdays).map((w) => h.el('span', 'cal-wd', w)),
      ...calendarCells(month, days).map((cell) => {
        if (!cell.date) return h.el('span', 'cal-blank');
        const b = h.el('button', 'cal-day', String(cell.day));
        b.type = 'button';
        b.disabled = cell.count === 0;
        b.setAttribute('aria-pressed', String(cell.date === selected));
        b.setAttribute('aria-label', `${dateLabel(cell.date, lang)} · ${cell.count} ${t(STR.count)}`);
        if (cell.count) {
          b.append(h.el('small', null, String(cell.count)));
          b.addEventListener('click', () => pick(cell.date));
        }
        return b;
      }),
    );
  };

  function pick(date) {
    selected = date;
    month = monthOf(date);
    paint();
    const entry = days.find((x) => x.d === date);
    heading.replaceChildren(h.el('strong', null, dateLabel(date, lang)), h.el('span', null, `${entry?.n ?? 0} ${t(STR.count)}`));
    if (!cache.has(date)) cache.set(date, load(`assets/data/news/${date}.json`));
    draw([{ title: t(STR.loading), url: '#', category: 'all' }], () => []);
    cache.get(date)
      .then((stories) => { if (selected === date) draw(stories, (s) => [s.category.toUpperCase(), s.source, s.time]); })
      .catch(() => {
        cache.delete(date);
        if (selected === date) draw([{ title: t(STR.failed), url: '#', category: 'all' }], () => []);
      });
  }

  pick(selected);
}

/**
 * 画新闻面板。recent 是 news.json（各分类最近的新闻），日历档案加载不到时退回它。
 * h = { el, extLink, lang }：由 app.js 传进来的 DOM 小工具和当前语言。
 */
export function renderNews(body, recent, h, load = fetchJson) {
  const lang = h.lang();
  const t = (pair) => pair[lang] ?? pair.zh;
  return load('assets/data/news/index.json')
    .then((index) => {
      if (!index?.days?.length) throw new Error('news_empty');
      mountCalendar(body, index, h, t, lang, load);
    })
    .catch(() => {
      body.append(h.el('p', 'meta', `${t(STR.recent)} · ${String(recent.updated).slice(0, 10)}`));
      storyList(body, h, t)(recent.items, (s) => [s.category.toUpperCase(), s.source, s.date]);
    });
}
