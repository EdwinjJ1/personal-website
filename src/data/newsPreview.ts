export const newsPreview = {
  "latestDate": "2026-09-30",
  "latestLabel": "September 30, 2026",
  "items": [
    {
      "id": "global-rss-910b86dd7216aa80cf03",
      "title": "Trekkers helicoptered off mountains as more deadly landslides hit Nepal",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "22:01",
      "category": "global"
    },
    {
      "id": "global-rss-e9673cefe626ee197cf0",
      "title": "Flydubai passenger describes putting attacker in chokehold after cockpit stabbing",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "21:38",
      "category": "global"
    },
    {
      "id": "global-rss-6e51ebb4942878ed179f",
      "title": "What we know about stabbing on Flydubai flight to Israel",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "21:36",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
