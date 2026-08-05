export const newsPreview = {
  "latestDate": "2026-08-05",
  "latestLabel": "August 5, 2026",
  "items": [
    {
      "id": "research-20260805-0000-logic-before-language-pre-pretraining-on-formal-derivations-fost",
      "title": "Logic Before Language: Pre-pretraining on Formal Derivations Fosters Skill Acquisition and Compressibility",
      "tag": "RESEARCH",
      "date": "2026-08-05",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260805-0000-parvl-parallel-scaling-and-expandable-compute-allocation-for-mul",
      "title": "ParVL: Parallel Scaling and Expandable Compute Allocation for Multimodal LLMs",
      "tag": "RESEARCH",
      "date": "2026-08-05",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260805-0000-societybench-forecasting-counterfactual-social-world-evolution",
      "title": "SocietyBench: Forecasting Counterfactual Social-World Evolution",
      "tag": "RESEARCH",
      "date": "2026-08-05",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
