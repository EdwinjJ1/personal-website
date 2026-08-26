export const newsPreview = {
  "latestDate": "2026-08-26",
  "latestLabel": "August 26, 2026",
  "items": [
    {
      "id": "research-20260826-0000-browserforge-scaling-web-episode-via-parallel-browser-sandboxes",
      "title": "BrowserForge: Scaling Web Episode via Parallel Browser Sandboxes",
      "tag": "RESEARCH",
      "date": "2026-08-26",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260826-0000-do-robotic-world-models-really-follow-actions-diagnosing-and-ali",
      "title": "Do Robotic World Models Really Follow Actions? Diagnosing and Aligning Action-Conditioned Generation for Policy Learning",
      "tag": "RESEARCH",
      "date": "2026-08-26",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260826-0000-effective-learning-rate-governs-loss-dynamics-in-language-model-",
      "title": "Effective Learning Rate Governs Loss Dynamics in Language Model Pretraining",
      "tag": "RESEARCH",
      "date": "2026-08-26",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
