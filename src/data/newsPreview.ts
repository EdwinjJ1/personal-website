export const newsPreview = {
  "latestDate": "2026-09-27",
  "latestLabel": "September 27, 2026",
  "items": [
    {
      "id": "global-rss-3905074a13675726570d",
      "title": "Bangkok roads submerged as flood disaster declared",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "04:45",
      "category": "global"
    },
    {
      "id": "global-rss-c40a3dfae780cf5bfc42",
      "title": "Nor'easter brings flooding as New York and New Jersey declare emergency",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "04:23",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
