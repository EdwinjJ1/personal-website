export const newsPreview = {
  "latestDate": "2026-08-04",
  "latestLabel": "August 4, 2026",
  "items": [
    {
      "id": "research-20260804-0000-aurora-lm-autoencoding-unified-representation-for-continuous-lat",
      "title": "AURORA-LM: Autoencoding Unified Representation for Continuous-Latent Diffusion Language Modeling",
      "tag": "RESEARCH",
      "date": "2026-08-04",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260804-0000-atumai-a-principled-framework-for-agentic-generation-of-datacent",
      "title": "AtumAI: A Principled Framework for Agentic Generation of Datacenter Control-Plane Policies",
      "tag": "RESEARCH",
      "date": "2026-08-04",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260804-0000-cmuon-accelerating-and-stabilizing-diffusion-transformer-trainin",
      "title": "CMuon: Accelerating and Stabilizing Diffusion Transformer Training via Chunked Momentum Orthogonalization",
      "tag": "RESEARCH",
      "date": "2026-08-04",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
