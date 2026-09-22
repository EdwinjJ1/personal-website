export const newsPreview = {
  "latestDate": "2026-09-22",
  "latestLabel": "September 22, 2026",
  "items": [
    {
      "id": "global-rss-5436f3eec4b1eb117806",
      "title": "Father admits causing death of his son in Cyprus hotel fall",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "15:52",
      "category": "global"
    },
    {
      "id": "global-rss-76c585a3c7072075d8bf",
      "title": "Autopsy shows Hayden Panettiere died from a drug overdose",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "15:17",
      "category": "global"
    },
    {
      "id": "global-rss-3b79a23a7c6179a841b0",
      "title": "Call of Duty's Activision to make next Halo game as Xbox cuts more jobs",
      "tag": "BREAKING",
      "date": "2026-09-22",
      "time": "14:51",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
