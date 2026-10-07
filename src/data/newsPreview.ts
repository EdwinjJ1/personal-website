export const newsPreview = {
  "latestDate": "2026-10-07",
  "latestLabel": "October 7, 2026",
  "items": [
    {
      "id": "global-rss-30aff8c73f16b43abd3f",
      "title": "Residents of kibbutz destroyed in 7 October Hamas-led attacks grapple with how to rebuild",
      "tag": "BREAKING",
      "date": "2026-10-07",
      "time": "05:02",
      "category": "global"
    },
    {
      "id": "global-rss-64cac8fe46cd91557e4d",
      "title": "The Republican candidates walking a Trump tightrope",
      "tag": "BREAKING",
      "date": "2026-10-07",
      "time": "05:00",
      "category": "global"
    },
    {
      "id": "global-rss-9563253029d534a9e095",
      "title": "Pornhub returns to Australia but only for adults with Apple devices",
      "tag": "BREAKING",
      "date": "2026-10-07",
      "time": "04:39",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
