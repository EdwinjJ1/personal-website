'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE, streamChat, type ChatMessage } from '@/lib/chatStream';

const SUGGESTIONS = [
  'What is Evan building right now?',
  '他的技术栈是什么？',
  'Is Evan available for work?',
];

export default function AICard() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!API_BASE) return null;

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;

    const history: ChatMessage[] = [...messages, { role: 'user', content: question }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(history, (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });
      }, controller.signal);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'assistant',
            content: 'Hmm, my circuits are napping — please try again in a moment, or email jiaedwin0605@gmail.com.',
          };
          return next;
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-card flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl"
            style={{ height: 'min(70vh, 480px)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: 'rgb(var(--p-sage) / 0.2)' }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: 'rgb(var(--p-sage))' }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: 'rgb(var(--p-sage))' }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: 'rgb(var(--p-ink))' }}>Evan · AI Card</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 transition-colors hover:bg-white/5"
                style={{ color: 'rgb(var(--p-ink-dim))' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                    Hi! I&apos;m the AI on Evan&apos;s card — ask me anything about his projects, skills, or photography. 中文也可以。
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border px-3 py-1.5 text-left text-xs transition-colors hover:border-sage"
                        style={{ borderColor: 'rgb(var(--p-line) / 0.35)', color: 'rgb(var(--p-ink-mid))' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed"
                    style={
                      m.role === 'user'
                        ? { background: 'linear-gradient(to right, rgb(var(--p-sage)), rgb(var(--p-teal)))', color: 'rgb(var(--p-surface-1))' }
                        : { backgroundColor: 'rgb(var(--p-surface-2))', color: 'rgb(var(--p-ink))', border: '1px solid rgb(var(--p-line) / 0.3)' }
                    }
                  >
                    {m.content || (
                      <span className="inline-flex gap-1" aria-label="Thinking">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: 'rgb(var(--p-sage))' }}
                            animate={{ opacity: [0.25, 1, 0.25] }}
                            transition={{ repeat: Infinity, duration: 1, delay: d * 0.18 }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t px-3 py-3"
              style={{ borderColor: 'rgb(var(--p-sage) / 0.2)' }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Evan…"
                aria-label="Ask about Evan"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full border bg-transparent px-3.5 py-2 text-sm outline-none transition-colors focus:border-sage"
                style={{ borderColor: 'rgb(var(--p-line) / 0.35)', color: 'rgb(var(--p-ink))' }}
              />
              <button
                type="submit"
                disabled={busy || input.trim().length === 0}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 disabled:opacity-40"
                style={{ background: 'linear-gradient(to right, rgb(var(--p-sage)), rgb(var(--p-teal)))', color: 'rgb(var(--p-surface-1))' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close AI card' : 'Open AI card — ask about Evan'}
        className="glass-card flex h-12 w-12 items-center justify-center rounded-full"
        style={{ color: 'rgb(var(--p-sage))' }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
