import type { CSSProperties } from 'react';

/**
 * One status vocabulary for every surface that shows project state —
 * the projects page, its list view, and the homepage card. Each status
 * stays distinguishable while sitting inside the sage palette: live is
 * the brightest sage, in-development a warm sand, the rest neutral.
 */
const STATUS_ACCENTS: Record<string, string> = {
  Live: '#8fb0a6',
  'In Development': '#c9a86a',
  Ongoing: '#6a8a8e',
  Archived: '#8a8680',
};

const FALLBACK_ACCENT = '#b8b4aa';

export function getStatusStyle(status: string): CSSProperties {
  const accent = STATUS_ACCENTS[status] ?? FALLBACK_ACCENT;

  return {
    color: accent,
    backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
    borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
  };
}
