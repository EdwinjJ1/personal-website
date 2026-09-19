export const newsPreview = {
  "latestDate": "2026-09-19",
  "latestLabel": "September 19, 2026",
  "items": [
    {
      "id": "global-rss-0dd033f2a0e63c735454",
      "title": "Google's Gemini AI hacked three companies in security test",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "13:39",
      "category": "global"
    },
    {
      "id": "industry-rss-0dd033f2a0e63c735454",
      "title": "Google's Gemini AI hacked three companies in security test",
      "tag": "PRODUCT",
      "date": "2026-09-19",
      "time": "13:39",
      "category": "industry"
    },
    {
      "id": "global-rss-d8b7730cfe224684723d",
      "title": "Shark attack prompts rare kill order in Western Australia as victim named",
      "tag": "BREAKING",
      "date": "2026-09-19",
      "time": "11:50",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
