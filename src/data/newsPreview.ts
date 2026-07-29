export const newsPreview = {
  "latestDate": "2026-07-29",
  "latestLabel": "July 29, 2026",
  "items": [
    {
      "id": "research-20260729-0000-self-speculating-agent-predict-your-next-tool-call-via-joint-age",
      "title": "⚡ Self-Speculating Agent: Predict Your Next Tool Call via Joint Agent-Speculator RL",
      "tag": "RESEARCH",
      "date": "2026-07-29",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260729-0000-rethinking-classifier-free-guidance-in-on-policy-diffusion-disti",
      "title": "🌀 Rethinking Classifier-Free Guidance in On-Policy Diffusion Distillation",
      "tag": "RESEARCH",
      "date": "2026-07-29",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260729-0000-modus-decoder-only-any-to-any-multimodal-icml-2026-apple-epfl",
      "title": "🌐 MODUS: Decoder-Only Any-to-Any Multimodal (ICML 2026, Apple × EPFL)",
      "tag": "RESEARCH",
      "date": "2026-07-29",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
