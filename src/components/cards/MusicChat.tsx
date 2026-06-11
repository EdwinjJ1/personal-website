'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE, streamChat, type ChatMessage } from '@/lib/chatStream';

// Otome-game style quips when you poke him while he's coding —
// affectionate but normal, unisex.
const QUIPS = [
  '我在工作呢，别碰我啦。',
  '嘘——这段代码马上就跑通了。',
  '再戳我就要写出 bug 了喔。',
  '等我改完这个 bug 再陪你。',
  '今天的歌单不错吧？',
  '摸鱼被你抓到了……别说出去。',
  '咖啡还热着，再让我写五分钟。',
  '想聊天的话，点上面的气泡呀。',
];

const GREETING = '你好，想了解我点什么？';

export default function MusicChat() {
  const [open, setOpen] = useState(false);
  const [quip, setQuip] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const quipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQuip = useRef(-1);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (quipTimer.current) clearTimeout(quipTimer.current);
    },
    []
  );

  // Poke the coding guy → a short in-character complaint
  const poke = useCallback(() => {
    if (open) return;
    let i = Math.floor(Math.random() * QUIPS.length);
    if (i === lastQuip.current) i = (i + 1) % QUIPS.length;
    lastQuip.current = i;
    setQuip(QUIPS[i]);
    if (quipTimer.current) clearTimeout(quipTimer.current);
    quipTimer.current = setTimeout(() => setQuip(null), 2400);
  }, [open]);

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
      await streamChat(
        history,
        (delta) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + delta };
            return next;
          });
        },
        controller.signal
      );
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'assistant',
            content: '信号不太好……过一会儿再来找我吧。',
          };
          return next;
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* click-catcher over the scene: poke the guy */}
      <button
        type="button"
        aria-label="Poke Evan"
        onClick={poke}
        className="absolute inset-0 z-[5] cursor-pointer border-0 bg-transparent p-0"
      />

      {/* floating message-bubble launcher above his head */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
          setQuip(null);
        }}
        aria-label="Chat with Evan"
        className="absolute left-1/2 top-1 z-10 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border"
        style={{
          backgroundColor: 'rgba(33, 30, 28, 0.92)',
          borderColor: 'rgba(122, 144, 136, 0.5)',
          color: '#7a9088',
          boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-9 8.36 8.5 8.5 0 0 1-3.4-.7L3 21l1.84-4.6A8.38 8.38 0 0 1 3.5 11.5a8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 9 8.5Z" />
          <circle cx="8.5" cy="11.5" r="0.5" fill="currentColor" />
          <circle cx="12" cy="11.5" r="0.5" fill="currentColor" />
          <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor" />
        </svg>
      </motion.button>

      {/* poke quip — a small comic bubble above his head */}
      <AnimatePresence>
        {quip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2 whitespace-nowrap rounded-2xl px-3.5 py-2 text-xs font-medium"
            style={{ backgroundColor: '#e0d8cc', color: '#1a1816', boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }}
          >
            {quip}
            <span
              className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45"
              style={{ backgroundColor: '#e0d8cc' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* oval comic speech bubble — sits over the lamp side so his face stays visible */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.85, transformOrigin: '65% 100%' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute z-30"
            style={{ left: '-2%', bottom: 2, width: 'min(14.5rem, 72vw)', height: 'min(14rem, 48vh)' }}
          >
            {/* comic-bubble tail: two fading dots toward the guy */}
            <span
              className="absolute -bottom-1 right-[18%] h-3.5 w-4 rounded-full border"
              style={{ backgroundColor: 'rgba(26, 24, 22, 0.84)', borderColor: 'rgba(122, 144, 136, 0.4)' }}
            />
            <span
              className="absolute -bottom-4 right-[12%] h-2 w-2.5 rounded-full border"
              style={{ backgroundColor: 'rgba(26, 24, 22, 0.84)', borderColor: 'rgba(122, 144, 136, 0.35)' }}
            />

            <div
              className="flex h-full w-full flex-col overflow-hidden border"
              style={{
                borderRadius: '50% 50% 50% 50% / 45% 45% 45% 45%',
                backgroundColor: 'rgba(40, 38, 34, 0.92)',
                borderColor: 'rgba(122, 144, 136, 0.7)',
                boxShadow: '0 0 0 1px rgba(122, 144, 136, 0.2), 0 14px 40px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                padding: '1.3rem 2rem 1.2rem',
              }}
            >
            {/* header */}
            <div className="flex items-center justify-between pb-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: '#7a9088' }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#7a9088' }} />
                </span>
                <span className="text-xs font-semibold" style={{ color: '#e0d8cc' }}>
                  Evan
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 transition-colors hover:bg-white/10"
                style={{ color: '#b8b4aa' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* messages */}
            <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto pb-1.5">
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl rounded-bl-md px-3 py-1.5 text-xs leading-relaxed"
                  style={{ backgroundColor: '#2e2b27', color: '#e0d8cc' }}
                >
                  {GREETING}
                </div>
              </div>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-1.5 text-xs leading-relaxed ${
                      m.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                    }`}
                    style={
                      m.role === 'user'
                        ? { background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#1a1816' }
                        : { backgroundColor: '#2e2b27', color: '#e0d8cc' }
                    }
                  >
                    {m.content || (
                      <span className="inline-flex gap-1" aria-label="Thinking">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="h-1 w-1 rounded-full"
                            style={{ backgroundColor: '#7a9088' }}
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

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="说点什么…"
                aria-label="Chat with Evan"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full border bg-transparent px-3 py-1.5 text-xs outline-none transition-colors focus:border-[#7a9088]"
                style={{ borderColor: 'rgba(114, 110, 102, 0.35)', color: '#e0d8cc' }}
              />
              <button
                type="submit"
                disabled={busy || input.trim().length === 0}
                aria-label="Send"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 disabled:opacity-40"
                style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#1a1816' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
