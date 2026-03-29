'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'splash_seen';

export function useSplashState() {
  const [showSplash, setShowSplash] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShowSplash(false);
      setChecked(true);
      return;
    }

    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      setShowSplash(!seen);
    } catch {
      setShowSplash(true);
    }
    setChecked(true);
  }, []);

  const dismissSplash = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  return { showSplash, dismissSplash, checked };
}
