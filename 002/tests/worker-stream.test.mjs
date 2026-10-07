import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseSSE } from '../site/js/chat.js';
import { convertChunk, toOpenAIStream } from '../workers/api/src/stream.js';

test('convertChunk 把 Workers AI 的 response 转成 OpenAI 增量，半行留到下次', () => {
  const r = convertChunk('data: {"response":"你好"}\n\ndata: {"response":"，我是"}\ndata: {"resp');
  assert.equal(r.rest, 'data: {"resp');
  assert.deepEqual(parseSSE(r.out).deltas, ['你好', '，我是']);
});

test('convertChunk 兼容已经是 OpenAI 形状的模型，并透传 [DONE]、跳过空内容和坏行', () => {
  const r = convertChunk('data: {"choices":[{"delta":{"content":"A"}}]}\ndata: {"response":""}\ndata: nope\n: ping\ndata: [DONE]\n');
  const parsed = parseSSE(r.out);
  assert.deepEqual(parsed.deltas, ['A']);
  assert.equal(parsed.done, true);
  assert.equal(r.rest, '');
});

test('toOpenAIStream 处理被切碎的数据块，输出能被前端解析', async () => {
  const enc = new TextEncoder();
  const pieces = ['data: {"respo', 'nse":"Hi, "}\n\ndata: {"response":"I am Evan."}\n', '\ndata: [DONE]\n\n'];
  const source = new ReadableStream({ start(c) { pieces.forEach((p) => c.enqueue(enc.encode(p))); c.close(); } });
  const text = await new Response(toOpenAIStream(source)).text();
  const parsed = parseSSE(text);
  assert.equal(parsed.deltas.join(''), 'Hi, I am Evan.');
  assert.equal(parsed.done, true);
});
