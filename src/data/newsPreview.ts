export const newsPreview = {
  "latestDate": "2026-09-20",
  "latestLabel": "September 20, 2026",
  "items": [
    {
      "id": "global-rss-e791fd7ad415206f7cf9",
      "title": "Trump says his planned triumphal arch will double as a military complex to store ammunition",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "13:50",
      "category": "global"
    },
    {
      "id": "global-rss-ad9e995a839bf16fad6e",
      "title": "Largest attack on Moscow sees Ukraine fire hundreds of drones, mayor says",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "10:45",
      "category": "global"
    },
    {
      "id": "global-rss-b3f0dc8693371ca7f1eb",
      "title": "German elections under way which could decide fate of Chancellor Merz",
      "tag": "BREAKING",
      "date": "2026-09-20",
      "time": "07:57",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
