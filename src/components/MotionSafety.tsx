'use client';

import { MotionConfig } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Content animates in from opacity 0 — via framer-motion on pages, via the
 * .page-enter / .card-enter classes elsewhere. Browsers pause animations in
 * a backgrounded tab, so a page opened in a new tab (cmd-click, a restored
 * session) used to sit blank until it was focused.
 *
 * Two guards, one for each animation system:
 *  - `reducedMotion: 'always'` makes framer-motion tweens resolve instantly
 *  - `data-visible` gates the CSS keyframes, which only attach once the
 *    document reports itself visible
 *
 * Either way the resting state is visible, and motion returns for anyone
 * actually looking at the page.
 */
export default function MotionSafety({ children }: { children: ReactNode }) {
  const [documentHidden, setDocumentHidden] = useState(true);

  useEffect(() => {
    const sync = () => {
      const hidden = document.hidden;
      setDocumentHidden(hidden);
      document.documentElement.dataset.visible = String(!hidden);
    };

    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <MotionConfig reducedMotion={documentHidden ? 'always' : 'user'}>
      {children}
    </MotionConfig>
  );
}
