export const newsPreview = {
  "latestDate": "2026-09-29",
  "latestLabel": "September 29, 2026",
  "items": [
    {
      "id": "industry-rss-355c62d34bfd876c80e3",
      "title": "OpenAI scraps rollout of new model over safety concerns",
      "tag": "PRODUCT",
      "date": "2026-09-29",
      "time": "04:30",
      "category": "industry"
    },
    {
      "id": "global-rss-355c62d34bfd876c80e3",
      "title": "OpenAI scraps rollout of new model over safety concerns",
      "tag": "BREAKING",
      "date": "2026-09-29",
      "time": "04:30",
      "category": "global"
    },
    {
      "id": "global-rss-eb02fd37e5426483a5f6",
      "title": "US ban on Canadian alcohol and dairy comes into effect as trade war drags on",
      "tag": "BREAKING",
      "date": "2026-09-29",
      "time": "04:10",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
