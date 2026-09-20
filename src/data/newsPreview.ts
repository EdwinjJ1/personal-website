export const newsPreview = {
  "latestDate": "2026-09-20",
  "latestLabel": "September 20, 2026",
  "items": [
    {
      "id": "global-rss-478e73a6c211621ef240",
      "title": "Ed Sheeran admits 'mistakes' as he addresses Macklemore controversy at Philadelphia show",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "04:49",
      "category": "global"
    },
    {
      "id": "global-rss-71878062186a8b82ff58",
      "title": "Watch: Concertgoers and pro-Palestinian activists arrive at Ed Sheeran concert",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "02:45",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
