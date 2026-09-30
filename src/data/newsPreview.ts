export const newsPreview = {
  "latestDate": "2026-09-30",
  "latestLabel": "September 30, 2026",
  "items": [
    {
      "id": "global-rss-c6a83b73af0564dc3ea3",
      "title": "Botswana condemned for slaughtering elephants for independence celebrations",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "12:06",
      "category": "global"
    },
    {
      "id": "global-rss-38619c509b1986d41015",
      "title": "Russia launches largest attack on Ukraine energy infrastructure since spring",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "11:47",
      "category": "global"
    },
    {
      "id": "global-rss-543752e81afbf5136f3f",
      "title": "Last UK and US troops leave Iraq as anti-Islamic State mission ends",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "11:36",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
