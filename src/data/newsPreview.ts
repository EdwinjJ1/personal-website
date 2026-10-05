export const newsPreview = {
  "latestDate": "2026-10-05",
  "latestLabel": "October 5, 2026",
  "items": [
    {
      "id": "global-rss-e25b642c8acffc89c8f5",
      "title": "Teenager's hand blown off during confrontation between France school protesters and police",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "14:30",
      "category": "global"
    },
    {
      "id": "global-rss-8d0753946b5492df251e",
      "title": "No10 insists UK military base RAF Fairford is safe after US withdraws bombers",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "13:16",
      "category": "global"
    },
    {
      "id": "global-rss-ac501aaf3cb7299a3a7b",
      "title": "Bombs preventing rescue of kidnapped youths, Nigerian police say",
      "tag": "BREAKING",
      "date": "2026-10-05",
      "time": "12:59",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
