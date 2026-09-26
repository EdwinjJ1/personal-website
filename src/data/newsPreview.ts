export const newsPreview = {
  "latestDate": "2026-09-26",
  "latestLabel": "September 26, 2026",
  "items": [
    {
      "id": "global-rss-1f401a94e62a96911835",
      "title": "Republic of Ireland news conference delayed before controversial Israel game",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "10:44",
      "category": "global"
    },
    {
      "id": "global-rss-947aa80905841d5b69a3",
      "title": "At least two dead after explosion destroys building close to Acropolis in Athens",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "10:18",
      "category": "global"
    },
    {
      "id": "global-rss-3905074a13675726570d",
      "title": "Bangkok roads submerged as flood disaster declared",
      "tag": "BREAKING",
      "date": "2026-09-26",
      "time": "07:21",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
