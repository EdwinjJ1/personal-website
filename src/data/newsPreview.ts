export const newsPreview = {
  "latestDate": "2026-09-24",
  "latestLabel": "September 24, 2026",
  "items": [
    {
      "id": "global-rss-97baa5d0c93b2661b7db",
      "title": "White House restores access to media outlets banned by Trump after judge's order",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "16:42",
      "category": "global"
    },
    {
      "id": "global-rss-60bd4982154542e53aee",
      "title": "Greek PM urges UK PM to return Elgin Marbles permanently",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "16:36",
      "category": "global"
    },
    {
      "id": "global-rss-923ffca2a455a278ab2b",
      "title": "Poland says fire at Starlink station is sabotage as Denmark warns of rising Russian threat",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "16:00",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
