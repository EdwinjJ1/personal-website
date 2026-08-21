export const newsPreview = {
  "latestDate": "2026-08-21",
  "latestLabel": "August 21, 2026",
  "items": [
    {
      "id": "research-20260821-0000-ai4ai-bench-benchmarking-llm-agents-in-algorithmic-design-for-re",
      "title": "AI4AI-Bench: Benchmarking LLM Agents in Algorithmic Design for Recursive Self-Improvement",
      "tag": "RESEARCH",
      "date": "2026-08-21",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260821-0000-break-it-down-pass-it-on-cross-task-skill-transfer-in-llm-agents",
      "title": "Break It Down, Pass It On: Cross-Task Skill Transfer in LLM Agents",
      "tag": "RESEARCH",
      "date": "2026-08-21",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260821-0000-learning-when-to-think-adaptive-reasoning-for-test-time-compute-",
      "title": "Learning When to Think: Adaptive Reasoning for Test-Time Compute Allocation",
      "tag": "RESEARCH",
      "date": "2026-08-21",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
