export const newsPreview = {
  "latestDate": "2026-09-24",
  "latestLabel": "September 24, 2026",
  "items": [
    {
      "id": "global-rss-0e34f3bdf0b7dd17bbb3",
      "title": "Netanyahu defends Israeli military actions in Middle East in UN speech",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "21:21",
      "category": "global"
    },
    {
      "id": "global-rss-021ad3c5587ee9583664",
      "title": "Italy ministers agree to ban burqa and niqab in school and cap foreigners in class",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "19:32",
      "category": "global"
    },
    {
      "id": "global-rss-acbb0a103fd294d65813",
      "title": "Priest killed and four injured in knife attack at Polish abbey",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "19:18",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
