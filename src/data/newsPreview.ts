export const newsPreview = {
  "latestDate": "2026-10-02",
  "latestLabel": "October 2, 2026",
  "items": [
    {
      "id": "global-rss-e4b583dc89b9a5a7bae2",
      "title": "Riot police clash with students as education protests rage in France",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "21:13",
      "category": "global"
    },
    {
      "id": "global-rss-5275757e5c7e60152d1f",
      "title": "Hawaii's iconic 550-year-old Hōlei Sea Arch collapses",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "21:00",
      "category": "global"
    },
    {
      "id": "global-rss-08e18bac009fdf43b537",
      "title": "US murderer Christa Pike unconscious and on ventilator after failed execution, lawyers say",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "20:32",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
