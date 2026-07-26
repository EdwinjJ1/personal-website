'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isTheme,
  themeClass,
  type Theme,
} from '@/lib/theme';

/**
 * Reads the stored choice, falling back to the site default. The OS
 * preference is intentionally not consulted — see THEME_SCRIPT.
 */
const readTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    // Safari private mode throws on any localStorage access.
    return DEFAULT_THEME;
  }
};

const applyToDocument = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove(themeClass('dark'), themeClass('light'));
  root.classList.add(themeClass(theme));
  root.style.colorScheme = theme;
};

/**
 * Reads and writes the site theme.
 *
 * `resolved` is null until after mount — the server cannot know which
 * theme the inline script chose, so any UI keyed on it must render a
 * stable placeholder first or it will hydrate-mismatch.
 */
export function useTheme() {
  const [resolved, setResolved] = useState<Theme | null>(null);

  // Adopt whatever the inline script already decided.
  useEffect(() => {
    setResolved(readTheme());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setResolved(next);
    applyToDocument(next);

    try {
      // Only the opt-out is worth persisting; the default needs no entry.
      if (next === DEFAULT_THEME) localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Choice just won't survive a reload; the page is still correct.
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  }, [resolved, setTheme]);

  return { resolved, setTheme, toggle };
}
