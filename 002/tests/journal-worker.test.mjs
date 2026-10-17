import assert from 'node:assert/strict';
import { test } from 'node:test';
import { appendToSection, decrypt, encrypt, handleJournal, passwordOk } from '../workers/api/src/journal.js';

const PASSWORD = 'open-sesame';
const SECRET = 'a-long-random-secret-for-tests';

/** 内存里的 KV：够用到 get / put / delete / list(prefix)。 */
function fakeKV() {
  const data = new Map();
  return {
    data,
    get: async (k) => data.get(k) ?? null,
    put: async (k, v) => { data.set(k, v); },
    delete: async (k) => { data.delete(k); },
    list: async ({ prefix }) => ({ keys: [...data.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }),
  };
}

const setup = () => {
  const env = { JOURNAL: fakeKV(), JOURNAL_PASSWORD: PASSWORD, JOURNAL_SECRET: SECRET };
  const call = async (method, path, { password = PASSWORD, json, ip = '1.1.1.1' } = {}) => {
    const headers = { 'CF-Connecting-IP': ip, ...(password == null ? {} : { Authorization: `Bearer ${password}` }) };
    const request = new Request(`https://api.test${path}`, { method, headers, body: json === undefined ? undefined : JSON.stringify(json) });
    const res = await handleJournal(request, env, {}, new URL(request.url));
    return { status: res.status, body: await res.json() };
  };
  return { env, call };
};

test('appendToSection：加进已有的一节末尾，不碰后面的节', () => {
  const md = '# 题\n\n## 做了什么\n\n- 甲\n\n## 我的感悟\n\n旧的。\n';
  assert.equal(appendToSection(md, '做了什么', '- 乙'), '# 题\n\n## 做了什么\n\n- 甲\n- 乙\n\n## 我的感悟\n\n旧的。\n');
});

test('appendToSection：这一节还是空的就隔一行写；最后一节直接接在文末；没有这一节就新开', () => {
  assert.equal(appendToSection('# 题\n\n## 感悟\n\n', '感悟', '想通了'), '# 题\n\n## 感悟\n\n想通了\n');
  assert.equal(appendToSection('# 题\n\n## 感悟\n', '感悟', '想通了'), '# 题\n\n## 感悟\n\n想通了\n');
  assert.equal(appendToSection('# 题\n\n## 感悟\n\n甲\n', '感悟', '乙\n丙'), '# 题\n\n## 感悟\n\n甲\n乙\n丙\n');
  assert.equal(appendToSection('# 题\n', '新的一节', '内容'), '# 题\n\n## 新的一节\n\n内容\n');
});

test('appendToSection：不指定节就接在文末；三级标题不算一节的边界以外的节', () => {
  assert.equal(appendToSection('# 题\n\n甲', '', '乙'), '# 题\n\n甲\n\n乙\n');
  assert.equal(appendToSection('', undefined, '乙'), '乙\n');
  assert.equal(appendToSection('# 题\n\n## 甲\n\n字\n\n### 小\n\n小字\n', '甲', '加'), '# 题\n\n## 甲\n\n字\n加\n\n### 小\n\n小字\n');
});

test('加密：来回一致；每次密文不同；换一个密钥解不开；明文不会出现在密文里', async () => {
  const a = await encrypt('我的秘密 MosMos', SECRET);
  const b = await encrypt('我的秘密 MosMos', SECRET);
  assert.notEqual(a, b);
  assert.ok(!a.includes('MosMos'));
  assert.equal(await decrypt(a, SECRET), '我的秘密 MosMos');
  await assert.rejects(decrypt(a, 'another-secret'));
});

test('passwordOk：只有一模一样才过；没配密码时谁都不过', async () => {
  assert.equal(await passwordOk('abc', 'abc'), true);
  for (const bad of ['abd', 'ab', 'abcd', '', undefined]) assert.equal(await passwordOk(bad, 'abc'), false);
  assert.equal(await passwordOk('', ''), false);
  assert.equal(await passwordOk('x', undefined), false);
});

test('没配好（缺 KV 或 secret）就是 503，不给任何数据', async () => {
  const request = new Request('https://api.test/journal', { headers: { Authorization: `Bearer ${PASSWORD}` } });
  const res = await handleJournal(request, { JOURNAL: fakeKV() }, {}, new URL(request.url));
  assert.equal(res.status, 503);
});

test('没带密码、密码不对：都是 401，而且不泄露有没有日记', async () => {
  const { call } = setup();
  await call('PUT', '/journal/2026-10-12', { json: { md: '# 秘密' } });
  for (const password of [null, 'nope', '']) {
    const res = await call('GET', '/journal', { password });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { error: 'locked' });
  }
  assert.equal((await call('GET', '/journal/2026-10-12', { password: 'nope' })).status, 401);
});

test('写进去再读出来；KV 里存的是密文，看不到正文；列表新的在前', async () => {
  const { env, call } = setup();
  assert.equal((await call('PUT', '/journal/2026-10-12', { json: { md: '# 十二号\n\n私密内容' } })).status, 200);
  await call('PUT', '/journal/2026-03-07', { json: { md: '# 三月' } });
  const stored = [...env.JOURNAL.data.entries()].filter(([k]) => k.startsWith('entry:'));
  assert.ok(!env.JOURNAL.data.get('index').includes('私密'), '索引里只有日期');
  assert.equal(stored.length, 2);
  stored.forEach(([, v]) => assert.ok(!v.includes('私密') && !v.includes('十二号')));
  assert.deepEqual((await call('GET', '/journal/2026-10-12')).body, { date: '2026-10-12', md: '# 十二号\n\n私密内容' });
  assert.deepEqual((await call('GET', '/journal')).body.entries.map((e) => e.date), ['2026-10-12', '2026-03-07']);
  assert.equal((await call('GET', '/journal/2026-01-01')).status, 404);
});

test('列表靠索引键，不等 KV 的 list()：刚写的马上列得出来，删了马上消失；没有索引的老数据也认', async () => {
  const { env, call } = setup();
  env.JOURNAL.list = async () => ({ keys: [] });          // 模拟 list() 还没跟上
  await call('PUT', '/journal/2026-10-12', { json: { md: '# 新' } });
  assert.deepEqual((await call('GET', '/journal')).body.entries.map((e) => e.date), ['2026-10-12']);
  await call('DELETE', '/journal/2026-10-12');
  assert.deepEqual((await call('GET', '/journal')).body.entries, []);

  const legacy = setup();
  await legacy.env.JOURNAL.put('entry:2026-10-01', await encrypt('# 老的', SECRET));
  assert.deepEqual((await legacy.call('GET', '/journal')).body.entries, [{ date: '2026-10-01', md: '# 老的' }]);
  await legacy.call('PUT', '/journal/2026-10-02', { json: { md: '# 新的' } });
  assert.deepEqual(JSON.parse(legacy.env.JOURNAL.data.get('index')), ['2026-10-02', '2026-10-01']);
});

test('替换整篇、删除；删完列表里没有了', async () => {
  const { call } = setup();
  await call('PUT', '/journal/2026-10-12', { json: { md: '旧' } });
  await call('PUT', '/journal/2026-10-12', { json: { md: '新' } });
  assert.equal((await call('GET', '/journal/2026-10-12')).body.md, '新');
  assert.deepEqual((await call('DELETE', '/journal/2026-10-12')).body, { date: '2026-10-12', deleted: true });
  assert.deepEqual((await call('GET', '/journal')).body.entries, []);
});

test('append：给 AI 用，往某一节加字；这篇不存在就新建', async () => {
  const { call } = setup();
  await call('PUT', '/journal/2026-10-12', { json: { md: '# 题\n\n## 我的感悟\n\n' } });
  const res = await call('POST', '/journal/2026-10-12/append', { json: { section: '我的感悟', text: '今天很专注。' } });
  assert.equal(res.body.md, '# 题\n\n## 我的感悟\n\n今天很专注。\n');
  const fresh = await call('POST', '/journal/2026-10-13/append', { json: { text: '随手记一句' } });
  assert.equal(fresh.body.md, '# 2026-10-13\n\n随手记一句\n');
  assert.equal((await call('POST', '/journal/2026-10-13/append', { json: { text: '  ' } })).status, 400);
  assert.equal((await call('GET', '/journal/2026-10-13/append')).status, 405);
});

test('坏请求：日期不合法、多余的路径、不是 JSON、太长、方法不对', async () => {
  const { call } = setup();
  assert.equal((await call('GET', '/journal/..%2Fsecret')).status, 400);
  assert.equal((await call('GET', '/journal/2026-10-12/append/extra')).status, 400);
  assert.equal((await call('PUT', '/journal/2026-10-12', { json: { nope: 1 } })).status, 400);
  assert.equal((await call('PUT', '/journal/2026-10-12', { json: { md: 'x'.repeat(100_001) } })).status, 413);
  assert.equal((await call('POST', '/journal')).status, 405);
  assert.equal((await call('PATCH', '/journal/2026-10-12')).status, 405);
  assert.equal((await call('GET', '/journal/2026-10-12/whatever')).status, 404);
});

test('连错 8 次锁住这个 IP，连对的密码也进不去；别的 IP 不受影响；中途输对会清零', async () => {
  const { call } = setup();
  for (let i = 0; i < 3; i += 1) await call('GET', '/journal', { password: 'bad', ip: '9.9.9.9' });
  assert.equal((await call('GET', '/journal', { ip: '9.9.9.9' })).status, 200);     // 输对一次，计数清零
  for (let i = 0; i < 8; i += 1) assert.equal((await call('GET', '/journal', { password: 'bad', ip: '9.9.9.9' })).status, 401);
  assert.equal((await call('GET', '/journal', { password: 'bad', ip: '9.9.9.9' })).status, 429);
  assert.equal((await call('GET', '/journal', { ip: '9.9.9.9' })).status, 429);
  assert.equal((await call('GET', '/journal', { ip: '2.2.2.2' })).status, 200);
});
