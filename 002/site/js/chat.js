// 对话后端：旧站那个 Cloudflare Worker（POST /chat，OpenAI 风格的 SSE 流）。
// 解析和裁剪是纯函数，网络只在 streamChat 里。

export const MAX_HISTORY = 12;      // Worker 只收最近 12 条
export const MAX_CONTENT = 2000;    // 单条上限，和 Worker 一致

/** 只把最近几条、裁剪过长度的消息发出去。 */
export const trimHistory = (messages, max = MAX_HISTORY) =>
  messages.slice(-max).map((m) => ({ role: m.role, content: String(m.content).slice(0, MAX_CONTENT) }));

/**
 * 解析一段 SSE 文本。返回已经完整的增量文本、还没收完的半行、以及是否收到 [DONE]。
 * 半行留给下一次拼接；坏掉的行（心跳、非 JSON）直接跳过。
 */
export function parseSSE(buffer) {
  const lines = buffer.split('\n');
  const rest = lines.pop() ?? '';
  const deltas = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;
    const data = trimmed.slice(5).trim();
    if (data === '[DONE]') return { deltas, rest: '', done: true };
    try {
      const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta.length > 0) deltas.push(delta);
    } catch {
      // 忽略
    }
  }
  return { deltas, rest, done: false };
}

/** 发起一次流式对话；每来一段文字调一次 onDelta。失败抛错，由调用方决定怎么兜底。 */
export async function streamChat(apiBase, messages, onDelta, signal) {
  const res = await fetch(`${apiBase}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: trimHistory(messages) }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`chat_failed_${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    const parsed = parseSSE(buffer + decoder.decode(value, { stream: true }));
    parsed.deltas.forEach(onDelta);
    if (parsed.done) return;
    buffer = parsed.rest;
  }
}
