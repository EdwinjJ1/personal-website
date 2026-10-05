export const newsPreview = {
  "latestDate": "2026-10-05",
  "latestLabel": "October 5, 2026",
  "items": [
    {
      "id": "global-rss-e7ad4bd0672a927424b8",
      "title": "Supporters of jailed ex-PM Imran Khan march to Pakistan capital",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "05:28",
      "category": "global"
    },
    {
      "id": "global-rss-4d9f80d91d4cefd4824c",
      "title": "US air force removes all bombers from British military base RAF Fairford",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "04:58",
      "category": "global"
    },
    {
      "id": "global-rss-74b4dbb03449ad07b70f",
      "title": "Watch: How Brazil's dramatic election unfolded",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "04:51",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
