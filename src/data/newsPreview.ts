export const newsPreview = {
  "latestDate": "2026-08-03",
  "latestLabel": "August 3, 2026",
  "items": [
    {
      "id": "research-20260803-0000-data-turnstile-a-scalable-open-framework-for-function-calling-da",
      "title": "Data Turnstile: A Scalable Open Framework for Function-Calling Data Generation",
      "tag": "RESEARCH",
      "date": "2026-08-03",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260803-0000-mixture-of-translators-translating-kv-caches-across-heterogeneou",
      "title": "Mixture-of-Translators: Translating KV Caches Across Heterogeneous Large Language Models",
      "tag": "RESEARCH",
      "date": "2026-08-03",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260803-0000-moroute-dynamic-routing-for-in-context-multimodal-video-generati",
      "title": "MoRoute: Dynamic Routing for In-Context Multimodal Video Generation",
      "tag": "RESEARCH",
      "date": "2026-08-03",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
