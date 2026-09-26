export const newsPreview = {
  "latestDate": "2026-09-26",
  "latestLabel": "September 26, 2026",
  "items": [
    {
      "id": "global-rss-6096d6a184eb3059d866",
      "title": "Iran offers US deal to reopen Strait of Hormuz in seven days",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "04:14",
      "category": "global"
    },
    {
      "id": "global-rss-b26cc2f8862a6966c50c",
      "title": "OpenAI bots meddled with multiple US government agency sites",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "02:50",
      "category": "global"
    },
    {
      "id": "industry-rss-b26cc2f8862a6966c50c",
      "title": "OpenAI bots meddled with multiple US government agency sites",
      "tag": "PRODUCT",
      "date": "2026-09-26",
      "time": "02:50",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
