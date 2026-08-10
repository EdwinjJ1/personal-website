export const newsPreview = {
  "latestDate": "2026-08-10",
  "latestLabel": "August 10, 2026",
  "items": [
    {
      "id": "research-20260810-0406-creativeinstruct-scalably-teaching-llms-to-balance-quality-creat",
      "title": "CreativeInstruct: Scalably Teaching LLMs to Balance Quality, Creativity, and Diversity",
      "tag": "RESEARCH",
      "date": "2026-08-10",
      "time": "04:06",
      "category": "research"
    },
    {
      "id": "research-20260810-0406-fisher-r1-training-llm-agents-for-reliable-hypothesis-testing",
      "title": "Fisher-R1: Training LLM Agents for Reliable Hypothesis Testing",
      "tag": "RESEARCH",
      "date": "2026-08-10",
      "time": "04:06",
      "category": "research"
    },
    {
      "id": "research-20260810-0406-modular-ttt-rethinking-test-time-training-as-composable-modules",
      "title": "Modular TTT: Rethinking Test-Time Training as Composable Modules",
      "tag": "RESEARCH",
      "date": "2026-08-10",
      "time": "04:06",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
