export const newsPreview = {
  "latestDate": "2026-09-27",
  "latestLabel": "September 27, 2026",
  "items": [
    {
      "id": "global-rss-b79f35a9c10fbf4bc63f",
      "title": "Woman charged with stealing from patients and staff at hospitals across Ontario",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "16:35",
      "category": "global"
    },
    {
      "id": "global-rss-63d1fabb62c41dafe4f6",
      "title": "Ten climbers missing after avalanche hits Himalayan base camp",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "16:22",
      "category": "global"
    },
    {
      "id": "global-rss-0584f789da0efe2e8284",
      "title": "Switzerland rejects stricter interpretation of its neutrality",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "16:02",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
