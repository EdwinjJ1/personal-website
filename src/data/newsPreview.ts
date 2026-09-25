export const newsPreview = {
  "latestDate": "2026-09-25",
  "latestLabel": "September 25, 2026",
  "items": [
    {
      "id": "global-rss-cef9fc91331bcf002d0a",
      "title": "Russia targeting 'ordinary life' with attacks on Ukraine's data centres, Zelensky says",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "20:47",
      "category": "global"
    },
    {
      "id": "global-rss-899d6295eefe8b61be5f",
      "title": "Supreme Court allows Trump to use controversial database to check voter citizenship",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "19:13",
      "category": "global"
    },
    {
      "id": "global-rss-97baa5d0c93b2661b7db",
      "title": "Media outlets banned by Trump resume White House coverage after judge's order",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "18:36",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
