export const newsPreview = {
  "latestDate": "2026-09-23",
  "latestLabel": "September 23, 2026",
  "items": [
    {
      "id": "research-rss-57154098a79d16f7645e",
      "title": "Bayesian Belief Layer for Controllable Opinion Dynamics in LLM Agents",
      "tag": "RESEARCH",
      "date": "2026-09-23",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-20260721-0000-environment-free-synthetic-data-generation-for-api-calling-agent",
      "title": "Simulate to Generalize: Scaling Stateful Supervision for API-calling Agents using LLM World Models",
      "tag": "RESEARCH",
      "date": "2026-09-23",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-20260614-1206-multiagent-protocols-with-aggregated-confidence-signals",
      "title": "Confidence Composition for Multiagent Language Model Systems",
      "tag": "RESEARCH",
      "date": "2026-09-23",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
