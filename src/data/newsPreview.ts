export const newsPreview = {
  "latestDate": "2026-08-11",
  "latestLabel": "August 11, 2026",
  "items": [
    {
      "id": "research-20260811-0000-bdh-cq-in-context-learning-with-recurrent-latent-reasoning",
      "title": "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning",
      "tag": "RESEARCH",
      "date": "2026-08-11",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260811-0000-evo-bench-can-language-models-improve-agent-harness",
      "title": "Evo-Bench: Can Language Models Improve Agent Harness?",
      "tag": "RESEARCH",
      "date": "2026-08-11",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260811-0000-intent-speaks-louder-controllable-user-simulation-beyond-respons",
      "title": "Intent Speaks Louder: Controllable User Simulation Beyond Response Imitation",
      "tag": "RESEARCH",
      "date": "2026-08-11",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
