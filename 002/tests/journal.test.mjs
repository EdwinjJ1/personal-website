import assert from 'node:assert/strict';
import { test } from 'node:test';
import { STR, TEMPLATE, createClient, isDate, leadOf, parseEntry, renderJournal, today } from '../site/js/journal.js';

const SAMPLE = [
  '# 2026-10-01 → 2026-10-12 日记',
  '',
  '## 一句话',
  '',
  '这十天都在做同一件事。',
  '',
  '## 做了什么',
  '',
  '**回声 / Echo Agent（桌面 + 手机）**',
  '',
  '- 第一条',
  '- 第二条，带 `代码` 和 **重点**',
  '',
  '**个人站**',
  '',
  '- 第三条',
  '',
  '## 我的感悟（Edwin）',
  '',
].join('\n');

test('parseEntry：一级标题是题目，二级标题各开一节，加粗的一行是小标题，连着的列表项是一个列表', () => {
  const entry = parseEntry(SAMPLE);
  assert.equal(entry.title, '2026-10-01 → 2026-10-12 日记');
  assert.deepEqual(entry.sections.map((s) => s.heading), ['一句话', '做了什么', '我的感悟（Edwin）']);
  assert.deepEqual(entry.sections[0].blocks, [{ type: 'text', text: '这十天都在做同一件事。' }]);
  assert.deepEqual(entry.sections[1].blocks, [
    { type: 'group', text: '回声 / Echo Agent（桌面 + 手机）' },
    { type: 'list', items: ['第一条', '第二条，带 代码 和 重点'] },
    { type: 'group', text: '个人站' },
    { type: 'list', items: ['第三条'] },
  ]);
});

test('parseEntry：只有标题、下面还没写的小节 blocks 是空的；写上之后就有内容', () => {
  assert.deepEqual(parseEntry(SAMPLE).sections[2], { heading: '我的感悟（Edwin）', blocks: [] });
  const filled = parseEntry(`${SAMPLE}\n这十天最大的收获是专注。\n`);
  assert.deepEqual(filled.sections[2].blocks, [{ type: 'text', text: '这十天最大的收获是专注。' }]);
});

test('parseEntry：标题下面不空行直接写也认，一行就是一段，Windows 换行也行', () => {
  const entry = parseEntry('# 题目\r\n## 感悟\r\n第一段\r\n第二段\r\n\r\n第三段\r\n');
  assert.equal(entry.title, '题目');
  assert.deepEqual(entry.sections, [{ heading: '感悟', blocks: [{ type: 'text', text: '第一段' }, { type: 'text', text: '第二段' }, { type: 'text', text: '第三段' }] }]);
});

test('parseEntry：标题前面的字归到没有名字的一节；没有一级标题时题目是空的；第二个一级标题只是又一节', () => {
  const entry = parseEntry('开头的话\n\n## 一\n\n正文\n\n# 另一个\n\n尾巴');
  assert.equal(entry.title, '另一个');
  assert.deepEqual(entry.sections.map((s) => s.heading), ['', '一']);
  assert.deepEqual(entry.sections[1].blocks.map((b) => b.text), ['正文', '尾巴']);
  assert.equal(parseEntry('## 只有小节\n\n字').title, '');
  assert.deepEqual(parseEntry('# 甲\n\n# 乙\n\n字').sections, [{ heading: '乙', blocks: [{ type: 'text', text: '字' }] }]);
});

test('parseEntry：编号和星号列表都认，中间空一行还是同一个列表，隔了一段话就是新的；分隔线不显示', () => {
  const entry = parseEntry('## 列表\n\n1. 甲\n2. 乙\n\n* 丙\n   - 缩进的丁\n\n---\n\n一段话\n\n- 戊\n***\n');
  assert.deepEqual(entry.sections[0].blocks, [
    { type: 'list', items: ['甲', '乙', '丙', '缩进的丁'] },
    { type: 'text', text: '一段话' },
    { type: 'list', items: ['戊'] },
  ]);
});

test('parseEntry：一行里只有一部分加粗不算小标题；空内容得到一篇空日记', () => {
  assert.deepEqual(parseEntry('**甲** 和 **乙**').sections[0].blocks, [{ type: 'text', text: '甲 和 乙' }]);
  assert.deepEqual(parseEntry(''), { title: '', sections: [] });
  assert.deepEqual(parseEntry(undefined), { title: '', sections: [] });
  assert.deepEqual(parseEntry('\n\n  \n'), { title: '', sections: [] });
});

test('leadOf：正文里的第一段话，跳过小标题和列表；没有就是空串', () => {
  assert.equal(leadOf(parseEntry(SAMPLE)), '这十天都在做同一件事。');
  assert.equal(leadOf(parseEntry('## 一\n\n**小标题**\n\n- 列表\n\n## 二\n\n终于有一段')), '终于有一段');
  assert.equal(leadOf(parseEntry('## 一\n\n- 只有列表')), '');
});

test('文案中英文齐全', () => {
  Object.entries(STR).forEach(([key, pair]) => ['zh', 'en'].forEach((l) => assert.ok(pair[l]?.length, `${key}.${l}`)));
});

// 一个只够 renderJournal 用的假 DOM：记录结构，不依赖浏览器
function fakeDom(lang = 'zh') {
  const make = (tag, cls, text) => {
    const node = {
      tag, className: cls || '', textContent: text ?? '', children: [], listeners: {}, focused: 0,
      append(...kids) { node.children.push(...kids); },
      replaceChildren(...kids) { node.children = kids; },
      addEventListener(type, fn) { node.listeners[type] = fn; },
      focus() { node.focused += 1; },
      setAttribute(k, v) { node[k] = v; },
    };
    return node;
  };
  const find = (node, pred, out = []) => { if (pred(node)) out.push(node); node.children.forEach((c) => find(c, pred, out)); return out; };
  return { h: { el: make, lang: () => lang }, body: make('div'), find };
}

const KEY = 'sesame';
const memorySession = (initial = '') => {
  let value = initial;
  return { get: () => value, set: (v) => { value = v; }, clear: () => { value = ''; } };
};

/** 一个假 Worker：记录请求，按密码和路径回应。entries 是 { 日期: md }。 */
function fakeWorker(entries, calls = []) {
  return async (url, init = {}) => {
    const method = init.method || 'GET';
    calls.push({ url, method, auth: init.headers?.Authorization, body: init.body && JSON.parse(init.body) });
    const reply = (status, data) => ({ ok: status < 400, status, json: async () => data });
    if (init.headers?.Authorization !== `Bearer ${KEY}`) return reply(401, { error: 'locked' });
    const path = url.replace('https://api.test/journal', '');
    if (path === '') return reply(200, { entries: Object.keys(entries).sort().reverse().map((date) => ({ date, md: entries[date] })) });
    const date = path.slice(1);
    if (method === 'PUT') { entries[date] = JSON.parse(init.body).md; return reply(200, { date }); }
    if (method === 'DELETE') { delete entries[date]; return reply(200, { date }); }
    return reply(404, {});
  };
}

const open = async (entries, { password = KEY, lang = 'zh', calls = [] } = {}) => {
  const dom = fakeDom(lang);
  const session = memorySession(password);
  const opts = { api: 'https://api.test', session, fetchImpl: fakeWorker(entries, calls), now: new Date('2026-10-13T09:00:00') };
  await renderJournal(dom.body, dom.h, opts);
  const cards = () => dom.find(dom.body, (n) => n.className === 'entry entry-btn');
  const buttons = () => dom.find(dom.body, (n) => n.tag === 'button' && !n.className.includes('entry'));
  const press = (label) => buttons().find((b) => b.textContent === label).listeners.click();
  return { ...dom, session, calls, cards, buttons, press };
};

test('today / isDate：本地日期 YYYY-MM-DD；日期只认这一种写法', () => {
  assert.equal(today(new Date('2026-03-07T10:00:00')), '2026-03-07');
  assert.equal(isDate('2026-10-12'), true);
  assert.equal(isDate(' 2026-10-12 '), true);
  ['../secret', '2026-1-2', '', 'draft'].forEach((bad) => assert.equal(isDate(bad), false, bad));
  assert.match(TEMPLATE('2026-10-13'), /^# 2026-10-13 日记\n/);
});

test('createClient：每个请求都带密码；失败抛带 status 的错', async () => {
  const calls = [];
  const client = createClient('https://api.test', fakeWorker({ '2026-10-12': SAMPLE }, calls));
  assert.deepEqual((await client.list(KEY)).map((e) => e.date), ['2026-10-12']);
  await client.put(KEY, '2026-10-13', '# 新');
  await client.remove(KEY, '2026-10-13');
  assert.deepEqual(calls.map((c) => [c.method, c.url, c.auth]), [
    ['GET', 'https://api.test/journal', `Bearer ${KEY}`],
    ['PUT', 'https://api.test/journal/2026-10-13', `Bearer ${KEY}`],
    ['DELETE', 'https://api.test/journal/2026-10-13', `Bearer ${KEY}`],
  ]);
  assert.deepEqual(calls[1].body, { md: '# 新' });
  await assert.rejects(client.list('nope'), (e) => e.status === 401);
});

test('没有密码就停在锁屏，不发任何请求；输入后解锁、密码记进 session', async () => {
  const calls = [];
  const ui = await open({ '2026-10-12': SAMPLE }, { password: '', calls });
  assert.equal(calls.length, 0);
  const form = ui.find(ui.body, (n) => n.tag === 'form')[0];
  const input = ui.find(ui.body, (n) => n.tag === 'input')[0];
  assert.equal(input.type, 'password');
  input.value = KEY;
  await form.listeners.submit({ preventDefault() {} });
  assert.equal(ui.session.get(), KEY);
  assert.equal(ui.cards().length, 1);
  assert.equal(ui.find(ui.body, (n) => n.tag === 'form').length, 0);
});

test('密码不对：忘掉它、回到锁屏并提示；日记内容一个字都不会画出来', async () => {
  const ui = await open({ '2026-10-12': SAMPLE }, { password: 'wrong' });
  assert.equal(ui.session.get(), '');
  assert.equal(ui.find(ui.body, (n) => n.tag === 'form').length, 1);
  assert.equal(ui.find(ui.body, (n) => n.className.includes('journal-status'))[0].textContent, STR.wrong.zh);
  assert.equal(ui.cards().length, 0);
});

test('连不上：提示一下，但密码留着，回来重试不用重新输入', async () => {
  const dom = fakeDom();
  const session = memorySession(KEY);
  await renderJournal(dom.body, dom.h, { api: 'https://api.test', session, fetchImpl: async () => { throw new TypeError('offline'); } });
  assert.equal(dom.find(dom.body, (n) => n.className.includes('journal-status'))[0].textContent, STR.offline.zh);
  assert.equal(session.get(), KEY);
});

test('解锁后：列出每一篇（新的在前），点开读全文，没写的小节留占位，返回回到列表', async () => {
  const ui = await open({ '2026-10-12': SAMPLE, '2026-03-07': '# 三月的日记\n\n## 反思\n\n想通了。' });
  assert.deepEqual(ui.cards().map((c) => c.children.map((x) => x.textContent)), [
    ['2026-10-01 → 2026-10-12 日记', '2026-10-12', '这十天都在做同一件事。'],
    ['三月的日记', '2026-03-07', '想通了。'],
  ]);
  ui.cards()[0].listeners.click();
  const article = ui.find(ui.body, (n) => n.className === 'article')[0];
  assert.deepEqual(article.children.map((n) => [n.tag, n.className, n.textContent]).slice(0, 5), [
    ['h3', 'article-title', '2026-10-01 → 2026-10-12 日记'], ['p', 'meta', '2026-10-12'], ['h3', '', '一句话'], ['p', '', '这十天都在做同一件事。'], ['h3', '', '做了什么'],
  ]);
  assert.deepEqual(article.children.at(-1).textContent, STR.blank.zh);
  ui.press(STR.back.zh);
  assert.equal(ui.cards().length, 2);
});

test('没有日记时给一句提示；界面文案跟着语言走', async () => {
  const ui = await open({}, { lang: 'en' });
  assert.equal(ui.find(ui.body, (n) => n.className === 'blank')[0].textContent, STR.empty.en);
  assert.ok(ui.buttons().some((b) => b.textContent === STR.newEntry.en));
});

test('新建：日期默认今天，带模板；存了之后回到列表并出现新的一篇', async () => {
  const entries = { '2026-10-12': SAMPLE };
  const ui = await open(entries);
  ui.press(STR.newEntry.zh);
  const [date] = ui.find(ui.body, (n) => n.tag === 'input');
  const [area] = ui.find(ui.body, (n) => n.tag === 'textarea');
  assert.equal(date.value, '2026-10-13');
  assert.equal(area.value, TEMPLATE('2026-10-13'));
  area.value = '# 十三号\n\n## 一句话\n\n今天很稳。';
  await ui.press(STR.save.zh);
  assert.equal(entries['2026-10-13'], '# 十三号\n\n## 一句话\n\n今天很稳。');
  assert.deepEqual(ui.cards().map((c) => c.children[1].textContent), ['2026-10-13', '2026-10-12']);
});

test('新建：日期写错不会发请求', async () => {
  const entries = {};
  const ui = await open(entries);
  ui.press(STR.newEntry.zh);
  ui.find(ui.body, (n) => n.tag === 'input')[0].value = '../hack';
  const before = ui.calls.length;
  await ui.press(STR.save.zh);
  assert.equal(ui.calls.length, before);
  assert.equal(ui.find(ui.body, (n) => n.className.includes('journal-status'))[0].textContent, STR.badDate.zh);
});

test('编辑已有的一篇：日期固定，改完保存，回到列表', async () => {
  const entries = { '2026-10-12': SAMPLE };
  const ui = await open(entries);
  ui.cards()[0].listeners.click();
  ui.press(STR.edit.zh);
  const [date] = ui.find(ui.body, (n) => n.tag === 'input');
  const [area] = ui.find(ui.body, (n) => n.tag === 'textarea');
  assert.equal(date.disabled, true);
  assert.equal(area.value, SAMPLE);
  area.value = `${SAMPLE}\n这十天最大的收获是专注。`;
  await ui.press(STR.save.zh);
  assert.match(entries['2026-10-12'], /最大的收获是专注。$/);
  assert.equal(ui.cards().length, 1);
});

test('删除要点两下：第一下只是换成确认字样', async () => {
  const entries = { '2026-10-12': SAMPLE };
  const ui = await open(entries);
  ui.cards()[0].listeners.click();
  ui.press(STR.remove.zh);
  assert.ok('2026-10-12' in entries);
  await ui.press(STR.confirmRemove.zh);
  assert.deepEqual(entries, {});
  assert.equal(ui.cards().length, 0);
});

test('锁上：忘掉密码，回到锁屏', async () => {
  const ui = await open({ '2026-10-12': SAMPLE });
  ui.press(STR.lock.zh);
  assert.equal(ui.session.get(), '');
  assert.equal(ui.find(ui.body, (n) => n.tag === 'form').length, 1);
});

test('保存时密码已失效：回到锁屏，不丢在半路', async () => {
  const entries = { '2026-10-12': SAMPLE };
  const ui = await open(entries);
  ui.press(STR.newEntry.zh);
  ui.session.set('changed');
  await ui.press(STR.save.zh);
  assert.equal(ui.find(ui.body, (n) => n.tag === 'form').length, 1);
  assert.deepEqual(Object.keys(entries), ['2026-10-12']);
});
