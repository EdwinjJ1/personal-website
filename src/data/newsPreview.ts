export const newsPreview = {
  "latestDate": "2026-08-07",
  "latestLabel": "August 7, 2026",
  "items": [
    {
      "id": "research-20260807-0404-beyond-top-k-replacing-black-box-retrieval-with-interpretable-ag",
      "title": "Beyond Top-K: Replacing Black-Box Retrieval with Interpretable Agentic Operations",
      "tag": "RESEARCH",
      "date": "2026-08-07",
      "time": "04:04",
      "category": "research"
    },
    {
      "id": "research-20260807-0404-mass-multiplayer-world-models-with-authoritative-shared-state",
      "title": "MASS: Multiplayer World Models with Authoritative Shared State",
      "tag": "RESEARCH",
      "date": "2026-08-07",
      "time": "04:04",
      "category": "research"
    },
    {
      "id": "research-20260807-0404-on-policy-self-distillation-without-any-supervision",
      "title": "On-Policy Self-Distillation without Any Supervision",
      "tag": "RESEARCH",
      "date": "2026-08-07",
      "time": "04:04",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
