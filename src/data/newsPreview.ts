export const newsPreview = {
  "latestDate": "2026-09-28",
  "latestLabel": "September 28, 2026",
  "items": [
    {
      "id": "global-rss-864b9fdb8d8b923525aa",
      "title": "Plan for controversial Sydney data centre scrapped after push-back",
      "tag": "BREAKING",
      "date": "2026-09-28",
      "time": "12:47",
      "category": "global"
    },
    {
      "id": "industry-rss-af5b32a27fa22138ec17",
      "title": "Apple ordered to pay $5.7bn after losing vibration tech patent suit",
      "tag": "PRODUCT",
      "date": "2026-09-28",
      "time": "11:16",
      "category": "industry"
    },
    {
      "id": "global-rss-2154fd5eaf09cffa3927",
      "title": "Mexico's Pacific coast braces for Hurricane Polo",
      "tag": "BREAKING",
      "date": "2026-09-28",
      "time": "11:05",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
