export const newsPreview = {
  "latestDate": "2026-09-23",
  "latestLabel": "September 23, 2026",
  "items": [
    {
      "id": "global-rss-dfecf4f16d3efd50d1ba",
      "title": "Angry Anderson, rock star who soundtracked Kylie's wedding in Neighbours, dies aged 79",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "11:18",
      "category": "global"
    },
    {
      "id": "global-rss-6c8bc7fef5320e225db0",
      "title": "What's at stake when Trump and Xi meet in the US?",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "11:00",
      "category": "global"
    },
    {
      "id": "global-rss-b0c6a040cc34d454cdc8",
      "title": "Trump meets US-backed Venezuelan president for first time since Maduro seized",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "09:48",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
