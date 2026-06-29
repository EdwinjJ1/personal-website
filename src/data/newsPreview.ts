export const newsPreview = {
  "latestDate": "2026-06-27",
  "latestLabel": "June 27, 2026",
  "items": [
    {
      "id": "research-20260627-0000-ask-solve-generate-self-evolving-unified-multimodal-understandin",
      "title": "Ask, Solve, Generate: Self-Evolving Unified Multimodal Understanding and Generation via Self-Consistency Rewards",
      "tag": "RESEARCH",
      "date": "2026-06-27",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260627-0000-danceopd-on-policy-generative-field-distillation",
      "title": "DanceOPD: On-Policy Generative Field Distillation",
      "tag": "RESEARCH",
      "date": "2026-06-27",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260627-0000-don-t-settle-at-the-mode-mitigating-diversity-collapse-in-pretra",
      "title": "Don't Settle at the Mode! Mitigating Diversity Collapse in Pretrained Flow Models via Feature Self-Guidance",
      "tag": "RESEARCH",
      "date": "2026-06-27",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
