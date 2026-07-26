/**
 * One category vocabulary for the news list and the article pages, which
 * previously coloured the same categories differently. The four stay
 * legible against each other by varying temperature and lightness inside
 * the sage palette rather than by hue-cycling through a rainbow.
 */
export const NEWS_CATEGORIES = {
  ai: { label: 'AI News', color: 'rgb(var(--p-sage-bright))', icon: '🤖' },
  research: { label: 'Research', color: 'rgb(var(--p-sage-mist))', icon: '📚' },
  industry: { label: 'Industry', color: 'rgb(var(--p-status-dev))', icon: '🏢' },
  global: { label: 'Global', color: 'rgb(var(--p-teal))', icon: '🌍' },
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORIES;

export const ALL_CATEGORY = { value: 'all', label: 'All', color: 'rgb(var(--p-sage))' };

/** Tag chips reuse the category accents so a story reads as one object. */
export const TAG_ACCENTS: Record<string, string> = {
  BREAKING: 'rgb(var(--p-status-dev))',
  PRODUCT: 'rgb(var(--p-teal))',
  RESEARCH: 'rgb(var(--p-sage-mist))',
  POLICY: 'rgb(var(--p-ink-dim))',
};

export function getCategoryColor(category: string): string {
  return NEWS_CATEGORIES[category as NewsCategory]?.color ?? ALL_CATEGORY.color;
}

/** Soft-filled chip: tinted background and border derived from one accent. */
export function chipStyle(accent: string) {
  return {
    color: accent,
    backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`,
    borderColor: `color-mix(in srgb, ${accent} 38%, transparent)`,
  };
}
