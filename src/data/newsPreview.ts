export const newsPreview = {
  "latestDate": "2026-08-12",
  "latestLabel": "August 12, 2026",
  "items": [
    {
      "id": "research-20260812-0000-attention-path-fragility-as-an-uncertainty-signal-in-large-langu",
      "title": "Attention-Path Fragility as an Uncertainty Signal in Large Language Models",
      "tag": "RESEARCH",
      "date": "2026-08-12",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260812-0000-long-horizon-ai-research-for-grothendieck-constant-a-case-study-",
      "title": "Long-Horizon AI Research for Grothendieck Constant: A Case Study in Human-AI Mathematical Collaboration",
      "tag": "RESEARCH",
      "date": "2026-08-12",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260812-0000-test-time-self-evolving-gui-visual-grounding-via-reflection-guid",
      "title": "Test-Time Self-Evolving GUI Visual Grounding via Reflection-Guided On-Policy Self-Distillation",
      "tag": "RESEARCH",
      "date": "2026-08-12",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
