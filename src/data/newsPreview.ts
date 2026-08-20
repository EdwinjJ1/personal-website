export const newsPreview = {
  "latestDate": "2026-08-20",
  "latestLabel": "August 20, 2026",
  "items": [
    {
      "id": "research-20260820-0000-beyond-teacher-likelihood-group-calibrated-on-policy-distillatio",
      "title": "Beyond Teacher Likelihood: Group-Calibrated On-Policy Distillation for Long-Context Reasoning",
      "tag": "RESEARCH",
      "date": "2026-08-20",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260820-0000-editbridge-towards-faithful-and-efficient-ultra-high-resolution-",
      "title": "EDITBRIDGE: Towards Faithful and Efficient Ultra-High-Resolution Image Editing",
      "tag": "RESEARCH",
      "date": "2026-08-20",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260820-0000-from-corpora-to-co-evolving-capabilities-capability-centric-data",
      "title": "From Corpora to Co-Evolving Capabilities: Capability-Centric Data Design for Generalist Image Generation",
      "tag": "RESEARCH",
      "date": "2026-08-20",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
