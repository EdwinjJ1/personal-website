export const newsPreview = {
  "latestDate": "2026-10-05",
  "latestLabel": "October 5, 2026",
  "items": [
    {
      "id": "global-rss-3cd0e2456c0e0650ebba",
      "title": "Right-wing Flávio Bolsonaro wins first round of Brazil election",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "23:19",
      "category": "global"
    },
    {
      "id": "global-rss-0d245c72f21c683bc2a9",
      "title": "Trump says 'threat' led US to pull bombers from RAF Fairford",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "21:46",
      "category": "global"
    },
    {
      "id": "global-rss-e14684b03c01f1620cfd",
      "title": "US 'watching closely' after plague researcher dies in Russia",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "21:33",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
