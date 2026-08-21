import type { CSSProperties } from 'react';
import type { ProjectStatus } from '@/data/projects';

/**
 * One status vocabulary for every surface that shows project state —
 * the projects page, its list view, and the homepage card. Each status
 * stays distinguishable while sitting inside the sage palette: live is
 * the brightest sage, in-development a warm sand, the rest neutral.
 */
type DisplayStatus = ProjectStatus | 'Coming Soon';

const STATUS_ACCENTS: Record<DisplayStatus, string> = {
  Live: 'rgb(var(--p-sage-bright))',
  'In Development': 'rgb(var(--p-status-dev))',
  Ongoing: 'rgb(var(--p-teal))',
  Completed: 'rgb(var(--p-sage))',
  Archived: 'rgb(var(--p-ink-dim))',
  'Coming Soon': 'rgb(var(--p-ink-mid))',
};

export function getStatusStyle(status: DisplayStatus): CSSProperties {
  const accent = STATUS_ACCENTS[status];

  return {
    color: accent,
    backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
    borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
  };
}
