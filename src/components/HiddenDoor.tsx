'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const REVEAL_TIMEOUT_MS = 2400;

function isAtPageBottom() {
  const doc = document.documentElement;
  return window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
}

export default function HiddenDoor() {
  const router = useRouter();
  const [revealSteps, setRevealSteps] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const resetTimer = useRef<number | null>(null);

  const registerHiddenScroll = useCallback(() => {
    setRevealSteps((current) => {
      const next = Math.min(current + 1, 2);

      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }

      if (next < 2) {
        resetTimer.current = window.setTimeout(() => setRevealSteps(0), REVEAL_TIMEOUT_MS);
      }

      return next;
    });
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0 && isAtPageBottom()) {
        registerHiddenScroll();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartY.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartY.current = null;

      if (startY === null || endY === undefined) return;
      if (startY - endY > 34 && isAtPageBottom()) {
        registerHiddenScroll();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, [registerHiddenScroll]);

  const isVisible = revealSteps >= 2;
  const isHinting = revealSteps === 1;

  return (
    <>
      <AnimatePresence>
        {(isVisible || isHinting) && (
          <motion.button
            type="button"
            aria-label="Open the hidden private door"
            onClick={() => isVisible && setOpen(true)}
            initial={{ opacity: 0, x: 18, rotateY: -24 }}
            animate={{
              opacity: isVisible ? 1 : 0.42,
              x: 0,
              rotateY: isVisible ? 0 : -16,
            }}
            exit={{ opacity: 0, x: 18 }}
            transition={{ duration: 0.34, ease: 'easeOut' }}
            className="hidden-door-button"
            style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
          >
            <span className="hidden-door-frame" aria-hidden="true">
              <span className="hidden-door-slit" />
              <span className="hidden-door-knob" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="private-gate-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="private-gate-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="private-gate-panel"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <button
                type="button"
                className="private-gate-close"
                aria-label="Close private gate"
                onClick={() => setOpen(false)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="private-gate-key" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7.5" cy="14.5" r="3.5" />
                  <path d="M10.1 12 21 1.2M15 7.1l2.2 2.2M18 4.1l2 2" />
                </svg>
              </div>

              <h2 id="private-gate-title">钥匙孔</h2>
              <p>这里不会出现在导航里。进入后用你的口令打开本地加密的私人工作库。</p>

              <div className="private-gate-actions">
                <button type="button" onClick={() => setOpen(false)}>
                  关上
                </button>
                <button type="button" onClick={() => router.push('/private')}>
                  开门
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
