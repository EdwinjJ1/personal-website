export const newsPreview = {
  "latestDate": "2026-09-20",
  "latestLabel": "September 20, 2026",
  "items": [
    {
      "id": "global-rss-313473f6a5135e709440",
      "title": "German Chancellor Merz calls state election a 'disaster' for his party but vows to stay on",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "20:21",
      "category": "global"
    },
    {
      "id": "global-rss-7a1bf5c96410d1e96d8c",
      "title": "Sister of Pakistan's ex-PM Imran Khan arrested",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "19:04",
      "category": "global"
    },
    {
      "id": "global-rss-e791fd7ad415206f7cf9",
      "title": "Trump says triumphal arch will be military complex with drones and snipers",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "16:36",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
