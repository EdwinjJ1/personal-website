export const newsPreview = {
  "latestDate": "2026-09-21",
  "latestLabel": "September 21, 2026",
  "items": [
    {
      "id": "global-rss-aeca218ae5605c5be07b",
      "title": "Three arrested in South Africa over one of nine women's body finds",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "12:22",
      "category": "global"
    },
    {
      "id": "global-rss-1c6eaeb0daa1d2788bd6",
      "title": "CNN, MS NOW and Politico to file lawsuit against Trump's White House ban",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "12:21",
      "category": "global"
    },
    {
      "id": "global-rss-5708f274c5144bb0d5fd",
      "title": "British Museum bans visitors from photographing Bayeux Tapestry",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "12:21",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
