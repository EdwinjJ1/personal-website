'use client';

import { useTheme } from '@/hooks/useTheme';

/**
 * Sun/moon toggle for the header. Renders the icon frame on the server
 * and fills in the glyph after mount, since the active theme is only
 * known client-side (see useTheme).
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const isLight = resolved === 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label={
        resolved ? `Switch to ${isLight ? 'dark' : 'light'} theme` : 'Switch theme'
      }
      title={resolved ? `Switch to ${isLight ? 'dark' : 'light'} theme` : 'Switch theme'}
    >
      <span className="theme-toggle-glyph" aria-hidden="true">
        {resolved === null ? null : isLight ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" />
    </svg>
  );
}
