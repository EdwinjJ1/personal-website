export const newsPreview = {
  "latestDate": "2026-09-22",
  "latestLabel": "September 22, 2026",
  "items": [
    {
      "id": "global-rss-a0d4c8b969aca2a61624",
      "title": "How Ceuta, football and Israel are shaping Morocco's election",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "20:59",
      "category": "global"
    },
    {
      "id": "industry-rss-a5840e5a42f749a2ff4d",
      "title": "Tech Life",
      "tag": "PRODUCT",
      "date": "2026-09-22",
      "time": "20:00",
      "category": "industry"
    },
    {
      "id": "global-rss-25b91f8afeb701b30b85",
      "title": "Sri Lanka court convicts 15 men over deadly Easter Sunday bombings",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "19:47",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
