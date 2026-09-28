export const newsPreview = {
  "latestDate": "2026-09-28",
  "latestLabel": "September 28, 2026",
  "items": [
    {
      "id": "global-rss-348fc91433cefae306be",
      "title": "French PM warns against escalation of school protests after 164 arrested",
      "tag": "BREAKING",
      "date": "2026-09-28",
      "time": "21:46",
      "category": "global"
    },
    {
      "id": "global-rss-986a89d2a2521f2d7fe1",
      "title": "Stand-up comic released after being convicted of insulting Erdoğan",
      "tag": "BREAKING",
      "date": "2026-09-28",
      "time": "20:23",
      "category": "global"
    },
    {
      "id": "ai-rss-db713ef86bd59ea8f7ba",
      "title": "Watch the winning trailer from the Future Vision XPRIZE, The Gifted.",
      "tag": "PRODUCT",
      "date": "2026-09-28",
      "time": "19:00",
      "category": "ai"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
