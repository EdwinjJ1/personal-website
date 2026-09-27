export const newsPreview = {
  "latestDate": "2026-09-27",
  "latestLabel": "September 27, 2026",
  "items": [
    {
      "id": "global-rss-c68bfc5457aff9dae1fe",
      "title": "Watch: BBC reports from the front-line of an escalating war in Yemen",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "21:00",
      "category": "global"
    },
    {
      "id": "global-rss-99d9f8f5af36f631f8a7",
      "title": "Watch: The ups and downs of SpaceX's 13 Starship test flights",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "20:05",
      "category": "global"
    },
    {
      "id": "global-rss-ccd692e6d4bcf0054a11",
      "title": "Embattled Serbian president resigns, paving way for early elections",
      "tag": "BREAKING",
      "date": "2026-09-27",
      "time": "20:04",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
