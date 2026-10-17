// 私人日记面板：输对密码才看得到，解锁后能读、能写、能新建、能删。
// 日记不在站点文件里：加密存在 Worker 的 KV 里（workers/api/src/journal.js），网页带着密码去取，所以任何有网的地方都能改。
// Markdown 解析是纯函数（可测）；createClient 管网络；renderJournal 负责画。文案放在这里，不占 content.js。

const L = (zh, en) => ({ zh, en });

export const STR = {
  back: L('← 全部日记', '← All entries'),
  blank: L('这一段还没写。', 'Not written yet.'),
  lockTitle: L('私人日记', 'Private journal'),
  lockHint: L('只有我自己看得到。输入密码解锁。', 'Just for me. Enter the password to unlock.'),
  password: L('密码', 'Password'),
  unlock: L('解锁', 'Unlock'),
  wrong: L('密码不对。', 'Wrong password.'),
  tooMany: L('错得太多次了，先锁一阵子，稍后再试。', 'Too many wrong tries. Locked for a while.'),
  offline: L('连不上日记服务，稍后再试。', 'Cannot reach the journal service. Try again later.'),
  notReady: L('日记服务还没部署好。', 'The journal service is not deployed yet.'),
  lock: L('锁上', 'Lock'),
  newEntry: L('+ 新建一篇', '+ New entry'),
  empty: L('还没有日记。点上面的「新建一篇」写第一篇。', 'No entries yet. Start with “New entry”.'),
  edit: L('编辑', 'Edit'),
  save: L('保存', 'Save'),
  cancel: L('取消', 'Cancel'),
  remove: L('删除', 'Delete'),
  confirmRemove: L('再点一次确认删除', 'Click again to delete'),
  date: L('日期 YYYY-MM-DD', 'Date YYYY-MM-DD'),
  badDate: L('日期要写成 YYYY-MM-DD。', 'Date must look like YYYY-MM-DD.'),
  saveFailed: L('没存上，再试一次。', 'Could not save. Try again.'),
  saved: L('已保存。', 'Saved.'),
};

export const TEMPLATE = (date) => `# ${date} 日记\n\n## 一句话\n\n## 做了什么\n\n## 我的感悟\n\n`;

const HEADING = /^(#{1,4})\s+(.+)$/;
const ITEM = /^(?:[-*]|\d+\.)\s+(.+)$/;
const GROUP = /^\*\*([^*]+)\*\*$/;            // 整行加粗：一节里的小标题
const RULE = /^(-{3,}|\*{3,}|_{3,})$/;        // 分隔线，不显示
const plain = (text) => text.replace(/\*\*|`/g, '').trim();

/** 往最后一节里加一个 block，连着的列表项并进同一个列表。返回新数组，不改传入的。 */
function addBlock(sections, block) {
  const last = sections.at(-1) || { heading: '', blocks: [] };
  const prev = last.blocks.at(-1);
  const blocks = block.type === 'list' && prev?.type === 'list'
    ? [...last.blocks.slice(0, -1), { type: 'list', items: [...prev.items, ...block.items] }]
    : [...last.blocks, block];
  return [...sections.slice(0, -1), { ...last, blocks }];
}

/**
 * 很轻的 Markdown → { title, sections: [{ heading, blocks }] }。
 * 第一个一级标题是这篇的题目，其余标题各开一节；block 是 { type: 'text' | 'group', text } 或 { type: 'list', items }。
 * 按行读：一行就是一段，标题下面不空行直接写也认。只有标题、下面还没写的小节，blocks 是空的。
 */
export function parseEntry(md) {
  return String(md ?? '').split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !RULE.test(line)).reduce((entry, line) => {
    const heading = line.match(HEADING);
    if (heading && heading[1] === '#' && !entry.title) return { ...entry, title: plain(heading[2]) };
    if (heading) return { ...entry, sections: [...entry.sections, { heading: plain(heading[2]), blocks: [] }] };
    const item = line.match(ITEM);
    const group = line.match(GROUP);
    const block = item ? { type: 'list', items: [plain(item[1])] } : group ? { type: 'group', text: group[1].trim() } : { type: 'text', text: plain(line) };
    return { ...entry, sections: addBlock(entry.sections, block) };
  }, { title: '', sections: [] });
}

/** 列表里配在题目下面的那句话：正文里的第一段。没有就是空串。 */
export const leadOf = (entry) => entry.sections.flatMap((s) => s.blocks).find((b) => b.type === 'text')?.text ?? '';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
export const isDate = (text) => DATE.test(String(text).trim());
export const today = (now = new Date()) => now.toLocaleDateString('sv-SE');   // 本地日期，YYYY-MM-DD

/** 和 Worker 说话。密码放在 Authorization 里，每次都带；失败抛带 status 的错（连不上就没有 status）。 */
export function createClient(base, fetchImpl = (...args) => fetch(...args)) {
  const call = async (password, path, init = {}) => {
    const res = await fetchImpl(`${base}/journal${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${password}`, ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
    });
    if (!res.ok) throw Object.assign(new Error(`journal_${res.status}`), { status: res.status });
    return res.json();
  };
  return {
    list: (password) => call(password, '').then((data) => (Array.isArray(data.entries) ? data.entries : [])),
    put: (password, date, md) => call(password, `/${date}`, { method: 'PUT', body: JSON.stringify({ md }) }),
    remove: (password, date) => call(password, `/${date}`, { method: 'DELETE' }),
  };
}

function sectionNodes(section, h, t) {
  const head = section.heading ? [h.el('h3', null, section.heading)] : [];
  if (!section.blocks.length) return [...head, h.el('p', 'blank', t(STR.blank))];
  return [...head, ...section.blocks.map((block) => {
    if (block.type !== 'list') return h.el(block.type === 'group' ? 'h4' : 'p', null, block.text);
    const ul = h.el('ul');
    block.items.forEach((item) => ul.append(h.el('li', null, item)));
    return ul;
  })];
}

/**
 * 画日记面板。opts = { api, session, fetchImpl?, now? }：api 是 Worker 地址，session 是 { get, set, clear }（密码只放在这个标签页里）。
 * h = { el, lang }：由 app.js 传进来的 DOM 小工具和当前语言。全部走 textContent / value。
 * 返回的 promise 在第一屏画好后 resolve，从不 reject：连不上、密码不对都画成界面上的提示。
 */
export function renderJournal(body, h, opts) {
  const { api, session, now } = opts;
  const client = createClient(api, opts.fetchImpl);
  const t = (pair) => pair[h.lang()] ?? pair.zh;
  const button = (label, cls, onClick) => {
    const b = h.el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  };
  const status = (text) => {
    const p = h.el('p', 'meta journal-status', text);
    p.setAttribute?.('role', 'status');
    return p;
  };
  const errorText = (error) => t(error.status === 429 ? STR.tooMany : error.status === 401 ? STR.wrong : error.status === 503 || error.status === 404 ? STR.notReady : STR.offline);

  const lockScreen = (message = '') => {
    const form = h.el('form', 'journal-lock');
    const input = h.el('input');
    input.type = 'password';
    input.autocomplete = 'off';
    input.placeholder = t(STR.password);
    input.setAttribute?.('aria-label', t(STR.password));
    const go = h.el('button', 'btn small', t(STR.unlock));
    go.type = 'submit';
    form.append(h.el('p', null, t(STR.lockHint)), input, go);
    form.addEventListener('submit', (ev) => {
      ev.preventDefault?.();
      if (!input.value) return;
      session.set(input.value);
      return load();
    });
    body.replaceChildren(form, status(message));
    input.focus?.({ preventScroll: true });
  };

  const bar = (...extra) => {
    const row = h.el('div', 'chips journal-bar');
    row.append(...extra, button(t(STR.lock), 'btn small', () => { session.clear(); lockScreen(); }));
    return row;
  };

  // 编辑：date 为空串说明是新建，日期可以改；已有的日期固定，只改正文
  function editor(entry, entries, message = '') {
    const isNew = !entry.date;
    const dateInput = h.el('input');
    dateInput.value = isNew ? today(now) : entry.date;
    dateInput.disabled = !isNew;
    dateInput.placeholder = t(STR.date);
    dateInput.setAttribute?.('aria-label', t(STR.date));
    const area = h.el('textarea', 'journal-editor');
    area.value = entry.md;
    area.rows = 18;
    area.spellcheck = false;
    const out = status(message);
    const save = button(t(STR.save), 'btn small', async () => {
      const date = dateInput.value.trim();
      if (!isDate(date)) { out.textContent = t(STR.badDate); return; }
      try {
        await client.put(session.get(), date, area.value);
        await load(t(STR.saved));
      } catch (error) {
        if (error.status === 401) { session.clear(); lockScreen(t(STR.wrong)); return; }
        out.textContent = `${t(STR.saveFailed)} ${errorText(error)}`;
      }
    });
    const row = h.el('div', 'chips');
    row.append(save, button(t(STR.cancel), 'btn small', () => (isNew ? list(entries) : read(entry, entries))));
    body.replaceChildren(row, dateInput, area, out);
    area.focus?.({ preventScroll: true });
  }

  function read(entry, entries) {
    const parsed = parseEntry(entry.md);
    let armed = false;
    const del = button(t(STR.remove), 'btn small', async () => {
      if (!armed) { armed = true; del.textContent = t(STR.confirmRemove); return; }
      try {
        await client.remove(session.get(), entry.date);
        await load();
      } catch (error) { del.textContent = errorText(error); }
    });
    const row = h.el('div', 'chips');
    row.append(
      button(t(STR.back), 'btn small', () => list(entries)),
      button(t(STR.edit), 'btn small', () => editor(entry, entries)),
      del,
    );
    const art = h.el('article', 'article');
    art.append(h.el('h3', 'article-title', parsed.title || entry.date), h.el('p', 'meta', entry.date), ...parsed.sections.flatMap((s) => sectionNodes(s, h, t)));
    body.replaceChildren(row, art);
    const scroller = body.closest?.('.panel-body');      // 面板里回到顶上；阅读模式里文章就在原地展开，不用动
    if (scroller) scroller.scrollTop = 0;
    row.children[0].focus?.({ preventScroll: true });
  }

  function list(entries, message = '') {
    const cards = entries.map((entry) => {
      const parsed = parseEntry(entry.md);
      const b = h.el('button', 'entry entry-btn');
      b.type = 'button';
      b.append(h.el('h3', null, parsed.title || entry.date), h.el('p', 'meta', entry.date));
      if (leadOf(parsed)) b.append(h.el('p', null, leadOf(parsed)));
      b.addEventListener('click', () => read(entry, entries));
      return b;
    });
    const create = button(t(STR.newEntry), 'btn small', () => editor({ date: '', md: TEMPLATE(today(now)) }, entries));
    body.replaceChildren(bar(create), ...(message ? [status(message)] : []), ...(cards.length ? cards : [h.el('p', 'blank', t(STR.empty))]));
  }

  async function load(message = '') {
    const password = session.get();
    if (!password) { lockScreen(message); return; }
    try {
      list(await client.list(password), message);
    } catch (error) {
      if (error.status === 401) session.clear();      // 只有密码不对才忘掉它；断网时留着，回来重试就行
      lockScreen(errorText(error));
    }
  }

  return load();
}
