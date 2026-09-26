export const newsPreview = {
  "latestDate": "2026-09-26",
  "latestLabel": "September 26, 2026",
  "items": [
    {
      "id": "global-rss-1d7078360a489aa3c567",
      "title": "Pope praises young people's 'energy and commitment' at huge open-air Mass in Paris",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "19:48",
      "category": "global"
    },
    {
      "id": "global-rss-93518d29afda753734a7",
      "title": "White House bars CNN from travelling with Trump on Air Force One",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "19:16",
      "category": "global"
    },
    {
      "id": "global-rss-389fd0490c34466e78bf",
      "title": "Tenth woman's body found in South Africa suburb as police probe killings",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "18:30",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
