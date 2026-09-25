export const newsPreview = {
  "latestDate": "2026-09-25",
  "latestLabel": "September 25, 2026",
  "items": [
    {
      "id": "global-rss-0e34f3bdf0b7dd17bbb3",
      "title": "Netanyahu defends Israeli military action as delegates walk out before UN speech",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "11:44",
      "category": "global"
    },
    {
      "id": "global-rss-0671bf4a49ebdd634c83",
      "title": "Jay-Z rape accuser says her allegation was false",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "10:51",
      "category": "global"
    },
    {
      "id": "global-rss-8e7c0fb37fb0df800647",
      "title": "Trump and Xi exchange warm words at state dinner but little progress on key issues",
      "tag": "BREAKING",
      "date": "2026-09-25",
      "time": "10:36",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
