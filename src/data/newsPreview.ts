export const newsPreview = {
  "latestDate": "2026-09-21",
  "latestLabel": "September 21, 2026",
  "items": [
    {
      "id": "global-rss-1c6eaeb0daa1d2788bd6",
      "title": "CNN, MS NOW and Politico file lawsuit against Trump's White House ban",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "21:52",
      "category": "global"
    },
    {
      "id": "global-rss-acbeb50af663ca4e10ec",
      "title": "Millions urged to evacuate as powerful Typhoon Dujuan hits Japan",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "20:26",
      "category": "global"
    },
    {
      "id": "global-rss-1cf5f9f6e248667200fc",
      "title": "Airlines criticise air traffic control as second glitch causes more disruption in UK",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "20:21",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
