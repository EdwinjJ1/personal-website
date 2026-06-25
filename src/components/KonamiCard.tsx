'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import AICardPanel from '@/components/AICardPanel';

// Type "74" anywhere on the site (Evan's lucky number) to summon the AI business card.
// Same panel as /74, but as an in-page surprise — no navigation.
const SECRET = '74';
const RESET_MS = 1200;

export default function KonamiCard() {
  const [open, setOpen] = useState(false);
  const buffer = useRef('');
  const resetTimer = useRef<number | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore when the user is typing into a field.
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key < '0' || event.key > '9') {
        return;
      }

      buffer.current = (buffer.current + event.key).slice(-SECRET.length);

      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
      resetTimer.current = window.setTimeout(() => {
        buffer.current = '';
      }, RESET_MS);

      if (buffer.current === SECRET) {
        buffer.current = '';
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 14, 12, 0.78)', backdropFilter: 'blur(4px)' }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <p className="text-sm" style={{ color: '#7a9088' }}>
                Lucky number 74 — nice.
              </p>
            </div>

            <AICardPanel compact />

            <div className="flex items-center justify-center gap-4 mt-5">
              <Link
                href="/74"
                onClick={close}
                className="text-xs transition-colors"
                style={{ color: '#7a9088' }}
              >
                Open as a page →
              </Link>
              <button
                type="button"
                onClick={close}
                className="text-xs transition-colors"
                style={{ color: '#8a857b' }}
              >
                Close (Esc)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
