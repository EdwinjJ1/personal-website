export const newsPreview = {
  "latestDate": "2026-09-22",
  "latestLabel": "September 22, 2026",
  "items": [
    {
      "id": "global-rss-2d07e8f1b5d5acfd5b60",
      "title": "Doctor in court to face Rwanda genocide charges in UK",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "11:25",
      "category": "global"
    },
    {
      "id": "global-rss-1fb27fe8888fcdedb8cb",
      "title": "Lithuania ready to 'fight back' but has evacuation plans in face of Russia threats, PM tells BBC",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "10:45",
      "category": "global"
    },
    {
      "id": "global-rss-0bf9156e89877657c1cb",
      "title": "Eleven injured in shooting outside Turkish school",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "10:42",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
