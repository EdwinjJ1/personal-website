export const newsPreview = {
  "latestDate": "2026-09-29",
  "latestLabel": "September 29, 2026",
  "items": [
    {
      "id": "global-rss-d77b9be5bd7c100cc2ae",
      "title": "Spain announces new housing measures after protests over 87-year-old woman's eviction",
      "tag": "BREAKING",
      "date": "2026-09-29",
      "time": "12:14",
      "category": "global"
    },
    {
      "id": "global-rss-2154fd5eaf09cffa3927",
      "title": "Hurricane Polo makes landfall on Mexico's Pacific coast",
      "tag": "BREAKING",
      "date": "2026-09-29",
      "time": "10:34",
      "category": "global"
    },
    {
      "id": "industry-rss-355c62d34bfd876c80e3",
      "title": "OpenAI scraps rollout of new model over safety concerns",
      "tag": "PRODUCT",
      "date": "2026-09-29",
      "time": "09:14",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
