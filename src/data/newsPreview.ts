export const newsPreview = {
  "latestDate": "2026-09-20",
  "latestLabel": "September 20, 2026",
  "items": [
    {
      "id": "global-rss-ad9e995a839bf16fad6e",
      "title": "'Massive' drone attack on Moscow region sees Ukraine hit oil refinery",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "10:45",
      "category": "global"
    },
    {
      "id": "global-rss-b3f0dc8693371ca7f1eb",
      "title": "German elections under way which could decide fate of Chancellor Merz",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "07:57",
      "category": "global"
    },
    {
      "id": "global-rss-60350867f16b230ba37b",
      "title": "Watch: Fans react as Ed Sheeran speaks out over Macklemore controversy at show",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "05:01",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
