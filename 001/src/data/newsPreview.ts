export const newsPreview = {
  "latestDate": "2026-10-07",
  "latestLabel": "October 7, 2026",
  "items": [
    {
      "id": "global-rss-b267d4dc968f3546539e",
      "title": "Zelensky condemns 'vile' large-scale Russian attacks that killed 20",
      "tag": "BREAKING",
      "date": "2026-10-07",
      "time": "13:02",
      "category": "global"
    },
    {
      "id": "global-rss-25a768bd5992df4d85b5",
      "title": "Trump to speak to Putin about plague lab worker's death in Russia",
      "tag": "BREAKING",
      "date": "2026-10-07",
      "time": "12:58",
      "category": "global"
    },
    {
      "id": "global-rss-96c9dd17d515ec75eb4f",
      "title": "Ten people linked to Kenya's first-ever Ebola case quarantined as screening concerns grow",
      "tag": "BREAKING",
      "date": "2026-10-07",
      "time": "12:46",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
