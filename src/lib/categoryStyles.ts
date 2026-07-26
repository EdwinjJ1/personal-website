/**
 * One category vocabulary for the news list and the article pages, which
 * previously coloured the same categories differently. The four stay
 * legible against each other by varying temperature and lightness inside
 * the sage palette rather than by hue-cycling through a rainbow.
 */
export const NEWS_CATEGORIES = {
  ai: { label: 'AI News', color: '#8fb0a6', icon: '🤖' },
  research: { label: 'Research', color: '#adc3bb', icon: '📚' },
  industry: { label: 'Industry', color: '#c9a86a', icon: '🏢' },
  global: { label: 'Global', color: '#6a8a8e', icon: '🌍' },
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORIES;

export const ALL_CATEGORY = { value: 'all', label: 'All', color: '#7a9088' };

/** Tag chips reuse the category accents so a story reads as one object. */
export const TAG_ACCENTS: Record<string, string> = {
  BREAKING: '#c9a86a',
  PRODUCT: '#6a8a8e',
  RESEARCH: '#adc3bb',
  POLICY: '#8a8680',
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
