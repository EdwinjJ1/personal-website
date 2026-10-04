export const newsPreview = {
  "latestDate": "2026-10-04",
  "latestLabel": "October 4, 2026",
  "items": [
    {
      "id": "global-rss-675a68b0bd645e8fea55",
      "title": "Flydubai co-pilot attacked captain with axe, UAE official says",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "04:57",
      "category": "global"
    },
    {
      "id": "global-rss-13f4518d8251fbaea916",
      "title": "Rare tornado whips through small Australian town",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "04:15",
      "category": "global"
    },
    {
      "id": "global-rss-d42f52493b5f9fd61c41",
      "title": "Debris found from plane that went missing off US coast",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "03:49",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
