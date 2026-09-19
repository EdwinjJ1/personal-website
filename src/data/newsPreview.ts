export const newsPreview = {
  "latestDate": "2026-09-19",
  "latestLabel": "September 19, 2026",
  "items": [
    {
      "id": "global-rss-cf8b44c111b0630642cf",
      "title": "Houthis say they targeted Saudi capital with ballistic missiles",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "20:16",
      "category": "global"
    },
    {
      "id": "global-rss-b71371a0e9fb39aeba28",
      "title": "Journalists denied White House access after Trump banned some media outlets",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "19:13",
      "category": "global"
    },
    {
      "id": "global-rss-42d346cc30283afe5296",
      "title": "Converse pulls 'deeply upsetting' advert after backlash",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "14:05",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
