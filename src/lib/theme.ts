/**
 * Theme plumbing shared between the no-flash inline script and the
 * React toggle. The script runs before paint and cannot import from
 * here, so the storage key and class names are duplicated there —
 * keep THEME_SCRIPT in sync with the constants below.
 */

export type Theme = 'dark' | 'light';
/** What the user picked. 'system' defers to prefers-color-scheme. */
export type ThemePreference = Theme | 'system';

export const THEME_STORAGE_KEY = 'theme-preference';

export const themeClass = (theme: Theme): string => `theme-${theme}`;

export const isTheme = (value: unknown): value is Theme =>
  value === 'dark' || value === 'light';

export const isThemePreference = (value: unknown): value is ThemePreference =>
  isTheme(value) || value === 'system';

/**
 * Runs in <head> before first paint to stamp the theme class on <html>,
 * so a light-mode visitor never sees a frame of the dark palette.
 * Self-contained and defensive: private-mode Safari throws on
 * localStorage access, and a failure here must not block the page.
 */
export const THEME_SCRIPT = `
(function () {
  try {
    var stored = null;
    try { stored = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch (e) {}
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add('theme-' + theme);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;
