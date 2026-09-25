export const newsPreview = {
  "latestDate": "2026-09-25",
  "latestLabel": "September 25, 2026",
  "items": [
    {
      "id": "global-rss-373e7b36324e48390839",
      "title": "Internet restricted after fighting breaks out in Ethiopia's Tigray region",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "17:13",
      "category": "global"
    },
    {
      "id": "global-rss-899d6295eefe8b61be5f",
      "title": "Supreme Court revives controversial US data system for citizenship checks",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "16:35",
      "category": "global"
    },
    {
      "id": "global-rss-535466d2fc7082a15530",
      "title": "Students strike across Germany in protest against military service",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "15:36",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
