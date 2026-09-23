export const newsPreview = {
  "latestDate": "2026-09-23",
  "latestLabel": "September 23, 2026",
  "items": [
    {
      "id": "global-rss-4264506216ba0f46403c",
      "title": "Trump's Board of Peace unveils $2.45bn plan to begin Gaza's reconstruction",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "21:26",
      "category": "global"
    },
    {
      "id": "global-rss-46dd0b19303bba2bbeb4",
      "title": "UK survivor of Canadian poison seller says he exploited her despair",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "21:16",
      "category": "global"
    },
    {
      "id": "global-rss-90210de10b2a2e91ed7f",
      "title": "Harvey Weinstein sentenced to 15 years in prison for sexual assault",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "18:51",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
