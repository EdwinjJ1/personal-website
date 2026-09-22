export const newsPreview = {
  "latestDate": "2026-09-22",
  "latestLabel": "September 22, 2026",
  "items": [
    {
      "id": "research-20260317-0805-crystal-benchmark-for-transparent-multimodal-reasoning-evaluatio",
      "title": "Beyond Final Answers: CRYSTAL Benchmark for Transparent Multimodal Reasoning Evaluation",
      "tag": "RESEARCH",
      "date": "2026-09-22",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-rss-7517c50358dbe9ce4cc6",
      "title": "RBS-Attention: Radius-Bounded Sparse Prefill for Long-Context Large Language Models",
      "tag": "RESEARCH",
      "date": "2026-09-22",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-rss-a51d145ffe436938784a",
      "title": "Attention-Aware Routing: Coupling Routing and Attention in MoEs",
      "tag": "RESEARCH",
      "date": "2026-09-22",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
