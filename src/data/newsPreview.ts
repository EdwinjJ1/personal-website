export const newsPreview = {
  "latestDate": "2026-10-01",
  "latestLabel": "October 1, 2026",
  "items": [
    {
      "id": "global-rss-de1fdf8dd853114289ec",
      "title": "Zimbabwe tycoon Wicknell Chivayo and wife killed in helicopter crash",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "13:13",
      "category": "global"
    },
    {
      "id": "global-rss-c84b44b4d5b0c1b17f2d",
      "title": "What happened in failed execution of Christa Pike - and what next?",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "12:51",
      "category": "global"
    },
    {
      "id": "global-rss-5dfeef78afdafbc8acff",
      "title": "Explosions heard in Ethiopia's capital after drone flights banned",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "12:38",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
