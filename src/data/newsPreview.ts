export const newsPreview = {
  "latestDate": "2026-09-29",
  "latestLabel": "September 29, 2026",
  "items": [
    {
      "id": "global-rss-16d4086c4603d691182f",
      "title": "Former American Idol contestant and pastor found guilty of murdering wife",
      "tag": "BREAKING",
      "date": "2026-09-29",
      "time": "22:13",
      "category": "global"
    },
    {
      "id": "industry-rss-0b10a0cc8ae175ba3cf0",
      "title": "OpenAI agents get rebrand - as 'dots' - while safety worries delay new model",
      "tag": "PRODUCT",
      "date": "2026-09-29",
      "time": "22:06",
      "category": "industry"
    },
    {
      "id": "global-rss-36d5ffadc69d1e0f776c",
      "title": "More than 400 detained as France student protests escalate",
      "tag": "BREAKING",
      "date": "2026-09-29",
      "time": "21:55",
      "category": "global"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
