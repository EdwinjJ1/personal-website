export const newsPreview = {
  "latestDate": "2026-09-24",
  "latestLabel": "September 24, 2026",
  "items": [
    {
      "id": "industry-rss-90aa3aaf99feda11a772",
      "title": "FBI investigates claim by hackers they stole data on all agency staff",
      "tag": "PRODUCT",
      "date": "2026-09-24",
      "time": "11:46",
      "category": "industry"
    },
    {
      "id": "industry-rss-08be7c7455990ed07a65",
      "title": "Are we back in big tech's 'move fast and break things' era?",
      "tag": "PRODUCT",
      "date": "2026-09-24",
      "time": "11:29",
      "category": "industry"
    },
    {
      "id": "global-rss-923ffca2a455a278ab2b",
      "title": "Poland says fire at Starlink station is sabotage as Denmark warns of rising Russian threat",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "11:16",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
