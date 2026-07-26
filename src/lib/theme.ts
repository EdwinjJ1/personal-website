/**
 * Theme plumbing shared between the no-flash inline script and the
 * React toggle. The script runs before paint and cannot import from
 * here, so the storage key and class names are duplicated there —
 * keep THEME_SCRIPT in sync with the constants below.
 */

export type Theme = 'dark' | 'light';
export type ThemePreference = Theme;

/** Dark is the site's own identity, so it wins unless the visitor opts out. */
export const DEFAULT_THEME: Theme = 'dark';

export const THEME_STORAGE_KEY = 'theme-preference';

export const themeClass = (theme: Theme): string => `theme-${theme}`;

export const isTheme = (value: unknown): value is Theme =>
  value === 'dark' || value === 'light';

/**
 * Runs in <head> before first paint to stamp the theme class on <html>,
 * so a visitor who chose light never sees a frame of the dark palette.
 * Deliberately ignores prefers-color-scheme: the warm charcoal palette is
 * the site's default look, and a light-mode OS should not override it —
 * only an explicit click on the header toggle does.
 *
 * Self-contained and defensive: private-mode Safari throws on any
 * localStorage access, and a failure here must not block the page.
 */
export const THEME_SCRIPT = `
(function () {
  try {
    var stored = null;
    try { stored = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch (e) {}
    var theme = stored === 'light' ? 'light' : '${DEFAULT_THEME}';
    var root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add('theme-' + theme);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;
