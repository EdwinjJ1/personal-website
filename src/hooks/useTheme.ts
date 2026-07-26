'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  isThemePreference,
  themeClass,
  type Theme,
  type ThemePreference,
} from '@/lib/theme';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

const systemTheme = (): Theme =>
  window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'system';
  } catch {
    // Safari private mode throws on any localStorage access.
    return 'system';
  }
};

const resolve = (preference: ThemePreference): Theme =>
  preference === 'system' ? systemTheme() : preference;

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
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [resolved, setResolved] = useState<Theme | null>(null);

  // Adopt whatever the inline script already decided.
  useEffect(() => {
    const initial = readPreference();
    setPreference(initial);
    setResolved(resolve(initial));
  }, []);

  // Follow the OS while the user has no explicit preference.
  useEffect(() => {
    if (preference !== 'system') return;

    const media = window.matchMedia(LIGHT_QUERY);
    const sync = () => {
      const next = systemTheme();
      setResolved(next);
      applyToDocument(next);
    };

    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [preference]);

  const setThemePreference = useCallback((next: ThemePreference) => {
    const theme = resolve(next);

    setPreference(next);
    setResolved(theme);
    applyToDocument(theme);

    try {
      if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference just won't survive a reload; the page is still correct.
    }
  }, []);

  const toggle = useCallback(() => {
    // Toggling always commits to an explicit choice — a user who clicks
    // the button wants that theme regardless of what the OS later does.
    setThemePreference(resolved === 'light' ? 'dark' : 'light');
  }, [resolved, setThemePreference]);

  return { preference, resolved, setThemePreference, toggle };
}
