export const newsPreview = {
  "latestDate": "2026-08-08",
  "latestLabel": "August 8, 2026",
  "items": [
    {
      "id": "research-20260808-0409-on-policy-self-distillation-without-any-supervision",
      "title": "On-Policy Self-Distillation without Any Supervision",
      "tag": "RESEARCH",
      "date": "2026-08-08",
      "time": "04:09",
      "category": "research"
    },
    {
      "id": "research-20260808-0409-rrc-unlocking-generative-reward-models-in-llm-reinforcement-lear",
      "title": "RRC: Unlocking Generative Reward Models in LLM Reinforcement Learning via Ranking-Based Reward Construction",
      "tag": "RESEARCH",
      "date": "2026-08-08",
      "time": "04:09",
      "category": "research"
    },
    {
      "id": "research-20260808-0409-the-bitter-lesson-of-tool-calling",
      "title": "The Bitter Lesson of Tool Calling",
      "tag": "RESEARCH",
      "date": "2026-08-08",
      "time": "04:09",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
