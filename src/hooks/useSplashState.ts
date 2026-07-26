'use client';

import { useState, useEffect, useCallback } from 'react';

const SEEN_KEY = 'splash-seen';

/**
 * The splash plays once per browser session. The flag is written as soon
 * as we decide to show it, so reloading mid-animation doesn't replay it.
 */
export function useSplashState() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Private mode or storage disabled — still show it, just don't remember.
    }

    setShowSplash(true);
  }, []);

  const dismissSplash = useCallback(() => setShowSplash(false), []);

  return { showSplash, dismissSplash };
}
