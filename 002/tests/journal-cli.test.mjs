import assert from 'node:assert/strict';
import { test } from 'node:test';
import { keychainPassword, parseArgs, request, resolvePassword, run } from '../pipeline/journal.mjs';

const calls = [];
const fetchImpl = async (url, init) => {
  calls.push({ url, method: init.method, auth: init.headers.Authorization, body: init.body && JSON.parse(init.body) });
  if (init.headers.Authorization !== 'Bearer pw') return { ok: false, status: 401, json: async () => ({ error: 'locked' }) };
  const data = url.endsWith('/journal') ? { entries: [{ date: '2026-10-12', md: '# 题目\n\n字' }] } : { md: '正文' };
  return { ok: true, status: 200, json: async () => data };
};
const ctx = { api: 'https://api.test', password: 'pw', fetchImpl };
const reset = () => { calls.length = 0; };

test('parseArgs：--section 可以放在任何位置', () => {
  assert.deepEqual(parseArgs(['append', '2026-10-12', '字', '--section', '感悟']), { command: 'append', args: ['2026-10-12', '字'], section: '感悟' });
  assert.deepEqual(parseArgs(['list']), { command: 'list', args: [], section: undefined });
});

test('list / get：打印题目和正文', async () => {
  reset();
  assert.equal(await run(ctx, parseArgs(['list'])), '2026-10-12  题目');
  assert.equal(await run(ctx, parseArgs(['get', '2026-10-12'])), '正文');
  assert.deepEqual(calls.map((c) => [c.method, c.url, c.auth]), [['GET', 'https://api.test/journal', 'Bearer pw'], ['GET', 'https://api.test/journal/2026-10-12', 'Bearer pw']]);
});

test('put 读文件、append 带小节、delete', async () => {
  reset();
  await run(ctx, parseArgs(['put', '2026-10-12', 'a.md']), (f) => `内容:${f}`);
  await run(ctx, parseArgs(['append', '2026-10-12', '今天很专注', '--section', '我的感悟']));
  await run(ctx, parseArgs(['delete', '2026-10-12']));
  assert.deepEqual(calls.map((c) => [c.method, c.url.replace('https://api.test', ''), c.body]), [
    ['PUT', '/journal/2026-10-12', { md: '内容:a.md' }],
    ['POST', '/journal/2026-10-12/append', { text: '今天很专注', section: '我的感悟' }],
    ['DELETE', '/journal/2026-10-12', undefined],
  ]);
});

test('push 只传 <日期>.md，其余文件忽略', async () => {
  reset();
  const out = await run(ctx, parseArgs(['push', 'dir']), (f) => `读:${f}`, () => ['2026-10-12.md', 'notes.txt', '.DS_Store', '2026-03-07.md']);
  assert.equal(out, '已上传 2 篇：2026-03-07, 2026-10-12');
  assert.deepEqual(calls.map((c) => c.url.replace('https://api.test', '')), ['/journal/2026-03-07', '/journal/2026-10-12']);
});

test('密码先用环境变量，没有再去钥匙串取', () => {
  assert.equal(resolvePassword({ JOURNAL_PASSWORD: 'env' }, () => 'kc'), 'env');
  assert.equal(resolvePassword({}, () => 'kc'), 'kc');
  assert.equal(resolvePassword({}, () => ''), '');
});

test('钥匙串：只在 macOS 上问 security，取不到就是空', () => {
  const asked = [];
  const spawn = (cmd, args) => { asked.push([cmd, ...args]); return { status: 0, stdout: 'pw\n' }; };
  assert.equal(keychainPassword('darwin', spawn), 'pw');
  assert.deepEqual(asked, [['security', 'find-generic-password', '-s', 'evanlin-journal', '-w']]);
  assert.equal(keychainPassword('darwin', () => ({ status: 44, stdout: '' })), '');
  assert.equal(keychainPassword('darwin', () => ({ error: new Error('ENOENT') })), '');
  assert.equal(keychainPassword('linux', () => assert.fail('不该调用')), '');
});

test('坏日期、空文字、未知命令、密码不对都报错', async () => {
  await assert.rejects(run(ctx, parseArgs(['get', '../x'])), /YYYY-MM-DD/);
  await assert.rejects(run(ctx, parseArgs(['append', '2026-10-12', ''])), /不能空/);
  await assert.rejects(run(ctx, parseArgs(['nope'])), /用法/);
  await assert.rejects(request({ ...ctx, password: 'bad' }, 'GET', ''), (e) => e.status === 401);
});
