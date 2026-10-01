export const newsPreview = {
  "latestDate": "2026-10-01",
  "latestLabel": "October 1, 2026",
  "items": [
    {
      "id": "global-rss-9e867a33cfee2d99907e",
      "title": "US death row inmate Christa Pike taken to hospital after surviving two lethal injections, says lawyer",
      "tag": "BREAKING",
      "date": "2026-10-01",
      "time": "05:34",
      "category": "global"
    },
    {
      "id": "industry-rss-df6ead8af4b8279917c5",
      "title": "AI boom could trigger market shocks, Bank of England boss warns",
      "tag": "PRODUCT",
      "date": "2026-10-01",
      "time": "04:03",
      "category": "industry"
    },
    {
      "id": "research-rss-7a0705dd2d3b98ff4267",
      "title": "Privacy-Preserving Full-Body Meshing from mmWave Radar via Mesh Foundation Model Supervision",
      "tag": "RESEARCH",
      "date": "2026-10-01",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
