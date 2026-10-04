export const newsPreview = {
  "latestDate": "2026-10-04",
  "latestLabel": "October 4, 2026",
  "items": [
    {
      "id": "global-rss-3cd0e2456c0e0650ebba",
      "title": "Polls close in Brazil as Lula and Flávio Bolsonaro remain neck and neck",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "21:11",
      "category": "global"
    },
    {
      "id": "global-rss-899dbc8063186241a25d",
      "title": "What to know about Brazil's election as Lula and Flávio Bolsonaro face off",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "20:14",
      "category": "global"
    },
    {
      "id": "global-rss-8c43e1cec6b55b13e3ca",
      "title": "Indian police accused of sexually harassing journalists at protest",
      "tag": "BREAKING",
      "date": "2026-10-04",
      "time": "17:01",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
