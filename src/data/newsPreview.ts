export const newsPreview = {
  "latestDate": "2026-10-06",
  "latestLabel": "October 6, 2026",
  "items": [
    {
      "id": "global-rss-d12cb19015e1afd72c25",
      "title": "OpenAI admits response to Australian government hacks 'not good enough'",
      "tag": "BREAKING",
      "date": "2026-10-06",
      "time": "06:00",
      "category": "global"
    },
    {
      "id": "global-rss-14fbad747ccf53478dd9",
      "title": "Watch: Moment Indonesian sneaker shop is torn apart by explosion",
      "tag": "BREAKING",
      "date": "2026-10-06",
      "time": "04:57",
      "category": "global"
    },
    {
      "id": "global-rss-2ca30dde97389635551d",
      "title": "Yemeni military says it has 'secured' Red Sea waterway",
      "tag": "BREAKING",
      "date": "2026-10-06",
      "time": "04:29",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
