export const newsPreview = {
  "latestDate": "2026-10-03",
  "latestLabel": "October 3, 2026",
  "items": [
    {
      "id": "global-rss-12bbd5dc0ec7d55d4e6b",
      "title": "Russia hits second major bridge in Ukraine's capital Kyiv",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "16:16",
      "category": "global"
    },
    {
      "id": "global-rss-d42f52493b5f9fd61c41",
      "title": "Medical plane with 6 on board missing off Massachusetts coast",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "15:56",
      "category": "global"
    },
    {
      "id": "global-rss-675a68b0bd645e8fea55",
      "title": "Flydubai co-pilot attacked captain with axe, UAE official says",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "14:27",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
