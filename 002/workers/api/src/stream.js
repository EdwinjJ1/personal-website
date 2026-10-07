// Workers AI 的流式输出是 `data: {"response":"…"}`（部分模型已经是 OpenAI 的 choices/delta 形状）。
// 前端只认 OpenAI 风格的增量，这里统一转一下。

/** 一段 SSE 文本 → { out: 要发给前端的文本, rest: 还没收完的半行 }。纯函数。 */
export function convertChunk(buffer) {
  const lines = buffer.split('\n');
  const rest = lines.pop() ?? '';
  let out = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;
    const data = trimmed.slice(5).trim();
    if (data === '[DONE]') {
      out += 'data: [DONE]\n\n';
      continue;
    }
    try {
      const parsed = JSON.parse(data);
      const text = parsed.response ?? parsed.choices?.[0]?.delta?.content;
      if (typeof text === 'string' && text.length > 0) {
        out += `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
      }
    } catch {
      // 心跳或不完整的 JSON，跳过
    }
  }
  return { out, rest };
}

export function toOpenAIStream(stream) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  return stream.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        const { out, rest } = convertChunk(buffer + decoder.decode(chunk, { stream: true }));
        buffer = rest;
        if (out) controller.enqueue(encoder.encode(out));
      },
    })
  );
}
