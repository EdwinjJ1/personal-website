export const newsPreview = {
  "latestDate": "2026-09-28",
  "latestLabel": "September 28, 2026",
  "items": [
    {
      "id": "research-rss-a7fa72d763d6f21fedaf",
      "title": "PUBG Ally: A Conversational Embodied Agent as an AI Teammate",
      "tag": "RESEARCH",
      "date": "2026-09-28",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-rss-f930b46c6edd83283f1d",
      "title": "PrivDrift: Auditing User-Secret Leakage Under Topic Drift in Active LLM Conversations",
      "tag": "RESEARCH",
      "date": "2026-09-28",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-rss-50fd716fb2131ca92e63",
      "title": "AD-WM: Action-Discriminative World Models for Counterfactual Model Predictive Control",
      "tag": "RESEARCH",
      "date": "2026-09-28",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
