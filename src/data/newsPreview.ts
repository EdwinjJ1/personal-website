export const newsPreview = {
  "latestDate": "2026-09-23",
  "latestLabel": "September 23, 2026",
  "items": [
    {
      "id": "global-rss-416d6e7eb829ab0047cc",
      "title": "Ethiopia and Tigray accuse each of launching offensives, fuelling fears of new war",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "16:53",
      "category": "global"
    },
    {
      "id": "global-rss-90210de10b2a2e91ed7f",
      "title": "Harvey Weinstein sentenced to 15 years in prison for sexual assault",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "16:40",
      "category": "global"
    },
    {
      "id": "global-rss-4dcb53e3691638b9cb01",
      "title": "Iran's president tells Trump it will never 'bend the knee'",
      "tag": "BREAKING",
      "date": "2026-09-23",
      "time": "15:58",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
