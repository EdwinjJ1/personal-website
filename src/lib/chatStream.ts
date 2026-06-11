export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

/** Stream an OpenAI-style SSE chat completion from the site worker. */
export async function streamChat(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  signal: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`chat_failed_${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta.length > 0) onDelta(delta);
      } catch {
        // ignore malformed keep-alive chunks
      }
    }
  }
}
