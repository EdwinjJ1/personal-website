export const newsPreview = {
  "latestDate": "2026-09-21",
  "latestLabel": "September 21, 2026",
  "items": [
    {
      "id": "global-rss-1c6eaeb0daa1d2788bd6",
      "title": "CNN, MS NOW and Politico to file lawsuit against Trump's White House ban",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "12:21",
      "category": "global"
    },
    {
      "id": "global-rss-15afdceaa225b5702739",
      "title": "US strikes on alleged drug boats could be crimes against humanity, says UN",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "12:08",
      "category": "global"
    },
    {
      "id": "global-rss-bc09a6f0c3452f7035d5",
      "title": "Seven Ethiopian rebel groups form new alliance",
      "tag": "BREAKING",
      "date": "2026-09-21",
      "time": "11:46",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
