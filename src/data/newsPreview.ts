export const newsPreview = {
  "latestDate": "2026-09-30",
  "latestLabel": "September 30, 2026",
  "items": [
    {
      "id": "global-rss-6a9f573ffc0c8810277e",
      "title": "South Korea demands apology from Pyongyang for landmine blasts that injured three",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "05:24",
      "category": "global"
    },
    {
      "id": "industry-rss-0b10a0cc8ae175ba3cf0",
      "title": "OpenAI unveils AI assistant 'dots' while safety worries delay new model",
      "tag": "PRODUCT",
      "date": "2026-09-30",
      "time": "05:18",
      "category": "industry"
    },
    {
      "id": "global-rss-7ae3429c5a0e9b545d62",
      "title": "Girl has multiple surgeries to control infections after strike in Gaza",
      "tag": "BREAKING",
      "date": "2026-09-30",
      "time": "05:02",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
