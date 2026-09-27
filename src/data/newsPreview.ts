export const newsPreview = {
  "latestDate": "2026-09-27",
  "latestLabel": "September 27, 2026",
  "items": [
    {
      "id": "global-rss-072cbec4247becf3f014",
      "title": "'Scourge' of abuse must be rooted out, says Pope, during Lourdes visit",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "11:38",
      "category": "global"
    },
    {
      "id": "global-rss-b32914394325e0f93e4d",
      "title": "Two mass shootings in South Africa leave 27 dead",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "10:00",
      "category": "global"
    },
    {
      "id": "global-rss-cb7921681dd9d30c6047",
      "title": "Iranian minister says only negotiation can end conflict after Trump rejects Hormuz deal",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "07:44",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
