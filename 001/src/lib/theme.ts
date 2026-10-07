/**
 * Theme plumbing shared between the no-flash inline script and the
 * React toggle. The script runs before paint and cannot import from
 * here, so the storage key and class names are duplicated there —
 * keep THEME_SCRIPT in sync with the constants below.
 */

export type Theme = 'dark' | 'light';
export type ThemePreference = Theme | 'system';

/** New visitors follow the operating system; a light OS therefore starts white. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export const THEME_STORAGE_KEY = 'theme-preference';

export const themeClass = (theme: Theme): string => `theme-${theme}`;

export const isTheme = (value: unknown): value is Theme =>
  value === 'dark' || value === 'light';

/**
 * Runs in <head> before first paint to stamp the theme class on <html>,
 * so a visitor who chose light never sees a frame of the dark palette. With
 * no saved choice, the first paint follows the operating system preference.
 *
 * Self-contained and defensive: private-mode Safari throws on any
 * localStorage access, and a failure here must not block the page.
 */
export const THEME_SCRIPT = `
(function () {
  try {
    var stored = null;
    try { stored = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch (e) {}
    var prefersDark = false;
    try { prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) {}
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (prefersDark ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add('theme-' + theme);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;
