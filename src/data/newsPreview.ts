export const newsPreview = {
  "latestDate": "2026-10-04",
  "latestLabel": "October 4, 2026",
  "items": [
    {
      "id": "global-rss-bd9526dd54522978c8a4",
      "title": "Kyiv bridge hit in further Russian drone attack as German chancellor makes surprise visit",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "12:09",
      "category": "global"
    },
    {
      "id": "global-rss-899dbc8063186241a25d",
      "title": "What to know about Brazil's election pitting Lula against Flávio Bolsonaro",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "11:03",
      "category": "global"
    },
    {
      "id": "global-rss-664b39e9cf4ba58bb932",
      "title": "Australia investigating Flydubai co-pilot's links to country",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "06:19",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
