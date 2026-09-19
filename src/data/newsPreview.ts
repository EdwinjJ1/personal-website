export const newsPreview = {
  "latestDate": "2026-09-19",
  "latestLabel": "September 19, 2026",
  "items": [
    {
      "id": "global-rss-4f739bafcf5315620ce4",
      "title": "US and Denmark reach deal over Greenland after Trump annexation threats",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "11:01",
      "category": "global"
    },
    {
      "id": "global-rss-f4b390b8712ebbb37182",
      "title": "Millions without power as Cuba hit by latest major blackout",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "10:27",
      "category": "global"
    },
    {
      "id": "global-rss-d8b7730cfe224684723d",
      "title": "Deadly shark attack prompts rare kill order in Western Australia",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "09:19",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
