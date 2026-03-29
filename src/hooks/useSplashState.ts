'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSplashState() {
  const [showSplash, setShowSplash] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShowSplash(false);
      setChecked(true);
      return;
    }

    setShowSplash(true);
    setChecked(true);
  }, []);

  const dismissSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  return { showSplash, dismissSplash, checked };
}
