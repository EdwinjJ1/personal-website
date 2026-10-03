export const newsPreview = {
  "latestDate": "2026-10-03",
  "latestLabel": "October 3, 2026",
  "items": [
    {
      "id": "global-rss-afee19a0de7066b3eb55",
      "title": "Protesters across Spain demand action over housing crisis",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "11:35",
      "category": "global"
    },
    {
      "id": "global-rss-675a68b0bd645e8fea55",
      "title": "Flydubai co-pilot attacked captain with axe, UAE official says",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "11:20",
      "category": "global"
    },
    {
      "id": "global-rss-2fb3c89a6646aaedbbc9",
      "title": "UK-Iranian dual national bailed after RAF Fairford incident arrest",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "10:58",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
