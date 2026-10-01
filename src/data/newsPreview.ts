export const newsPreview = {
  "latestDate": "2026-10-01",
  "latestLabel": "October 1, 2026",
  "items": [
    {
      "id": "global-rss-89ad31c25c55fbfb642a",
      "title": "Christa Pike in critical condition after surviving two lethal injections, lawyer says",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "22:28",
      "category": "global"
    },
    {
      "id": "global-rss-0bc6100d01a0747bab1f",
      "title": "Renee Good: Family of US woman killed by ICE agent sues Trump officials",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "20:30",
      "category": "global"
    },
    {
      "id": "global-rss-0e1fbbdfe06f638053a8",
      "title": "Netanyahu says Flydubai attacker had 'Islamist radical indoctrination'",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "19:59",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
