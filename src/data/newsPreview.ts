export const newsPreview = {
  "latestDate": "2026-10-02",
  "latestLabel": "October 2, 2026",
  "items": [
    {
      "id": "global-rss-2400839f5b3eb7f2c6aa",
      "title": "Who is the 'hero' Indian pilot who was stabbed on Israel-bound flight?",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "11:52",
      "category": "global"
    },
    {
      "id": "global-rss-89ad31c25c55fbfb642a",
      "title": "Christa Pike in critical condition after surviving two lethal injections, lawyer says",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "11:06",
      "category": "global"
    },
    {
      "id": "global-rss-7288a3d72a53e2492de4",
      "title": "Ethiopia and Eritrea cut diplomatic ties as northern conflict escalates",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "10:04",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
