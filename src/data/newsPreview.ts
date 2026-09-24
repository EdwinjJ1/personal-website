export const newsPreview = {
  "latestDate": "2026-09-24",
  "latestLabel": "September 24, 2026",
  "items": [
    {
      "id": "global-rss-416d6e7eb829ab0047cc",
      "title": "Ethiopia and Tigray accuse each of launching offensives, fuelling fears of new war",
      "tag": "BREAKING",
      "date": "2026-09-24",
      "time": "04:37",
      "category": "global"
    },
    {
      "id": "research-rss-57154098a79d16f7645e",
      "title": "Bayesian Belief Layer for Controllable Opinion Dynamics in LLM Agents",
      "tag": "RESEARCH",
      "date": "2026-09-24",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-20260721-0000-environment-free-synthetic-data-generation-for-api-calling-agent",
      "title": "Simulate to Generalize: Scaling Stateful Supervision for API-calling Agents using LLM World Models",
      "tag": "RESEARCH",
      "date": "2026-09-24",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
