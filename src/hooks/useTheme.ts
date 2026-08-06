'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  isTheme,
  themeClass,
  type Theme,
} from '@/lib/theme';

/**
 * Reads the stored choice, falling back to the operating system preference.
 */
const getSystemTheme = (): Theme => {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const readPreference = (): 'system' | Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME_PREFERENCE;
  } catch {
    // Safari private mode throws on any localStorage access.
    return DEFAULT_THEME_PREFERENCE;
  }
};

const readTheme = (): Theme => {
  const preference = readPreference();
  return preference === 'system' ? getSystemTheme() : preference;
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

  // Adopt whatever the inline script already decided and follow later OS
  // changes while the visitor has not made an explicit theme choice.
  useEffect(() => {
    setResolved(readTheme());

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (readPreference() !== 'system') return;
      const next = getSystemTheme();
      setResolved(next);
      applyToDocument(next);
    };

    media.addEventListener?.('change', handleSystemChange);
    return () => media.removeEventListener?.('change', handleSystemChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setResolved(next);
    applyToDocument(next);

    try {
      // A click is an explicit preference, so preserve it across reloads.
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Choice just won't survive a reload; the page is still correct.
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  }, [resolved, setTheme]);

  return { resolved, setTheme, toggle };
}
