export const newsPreview = {
  "latestDate": "2026-09-26",
  "latestLabel": "September 26, 2026",
  "items": [
    {
      "id": "global-rss-6096d6a184eb3059d866",
      "title": "Trump rejects Iran deal to reopen Strait of Hormuz in seven days",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "16:16",
      "category": "global"
    },
    {
      "id": "global-rss-21cd6a4ef40d68b003a5",
      "title": "German town bans 'stumbling stone' memorials to Nazi victims",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "15:48",
      "category": "global"
    },
    {
      "id": "global-rss-a894c7ff0c754d765fb0",
      "title": "Brazil's Lula bans online gambling ahead of presidential election",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "15:46",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
