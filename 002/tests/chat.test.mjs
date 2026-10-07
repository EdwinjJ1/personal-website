import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_CONTENT, MAX_HISTORY, parseSSE, streamChat, trimHistory } from '../site/js/chat.js';

const chunk = (text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n`;

test('parseSSE 取出完整行里的增量，半行留到下一次', () => {
  const half = chunk('世界').slice(0, 20);
  const r = parseSSE(chunk('你好') + chunk('，') + half);
  assert.deepEqual(r.deltas, ['你好', '，']);
  assert.equal(r.rest, half);
  assert.equal(r.done, false);
  const next = parseSSE(r.rest + chunk('世界').slice(20));
  assert.deepEqual(next.deltas, ['世界']);
});

test('parseSSE 遇到 [DONE] 结束，并忽略心跳和坏行', () => {
  const r = parseSSE(`: keep-alive\ndata: not-json\n${chunk('a')}data: {"choices":[{"delta":{}}]}\ndata: [DONE]\n${chunk('不该出现')}`);
  assert.deepEqual(r.deltas, ['a']);
  assert.equal(r.done, true);
  assert.deepEqual(parseSSE('').deltas, []);
});

test('trimHistory 只留最近几条并裁剪长度，不改原数组', () => {
  const msgs = Object.freeze(Array.from({ length: 20 }, (_, i) => Object.freeze({ role: i % 2 ? 'assistant' : 'user', content: `m${i}` })));
  const out = trimHistory(msgs);
  assert.equal(out.length, MAX_HISTORY);
  assert.equal(out.at(-1).content, 'm19');
  assert.equal(trimHistory([{ role: 'user', content: 'x'.repeat(MAX_CONTENT + 50) }])[0].content.length, MAX_CONTENT);
  assert.equal(msgs.length, 20);
});

test('streamChat 把流式响应逐段交给回调', async () => {
  const body = new ReadableStream({
    start(c) {
      const enc = new TextEncoder();
      c.enqueue(enc.encode(chunk('Hi, ')));
      c.enqueue(enc.encode(`${chunk('I am Evan.')}data: [DONE]\n`));
      c.close();
    },
  });
  const original = globalThis.fetch;
  let sent = null;
  globalThis.fetch = async (url, init) => { sent = { url, body: JSON.parse(init.body) }; return new Response(body, { status: 200 }); };
  try {
    let text = '';
    await streamChat('https://api.example', [{ role: 'user', content: 'hello' }], (d) => { text += d; });
    assert.equal(text, 'Hi, I am Evan.');
    assert.equal(sent.url, 'https://api.example/chat');
    assert.deepEqual(sent.body.messages, [{ role: 'user', content: 'hello' }]);
  } finally {
    globalThis.fetch = original;
  }
});

test('streamChat 在接口报错时抛出，交给调用方兜底', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('nope', { status: 503 });
  try {
    await assert.rejects(() => streamChat('https://api.example', [{ role: 'user', content: 'x' }], () => {}), /chat_failed_503/);
  } finally {
    globalThis.fetch = original;
  }
});
