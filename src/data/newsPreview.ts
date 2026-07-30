export const newsPreview = {
  "latestDate": "2026-07-30",
  "latestLabel": "July 30, 2026",
  "items": [
    {
      "id": "research-20260730-0000-inferscale-gpu-native-kv-injection-for-personalized-llm-serving",
      "title": "⚡ InferScale: GPU-Native KV Injection for Personalized LLM Serving",
      "tag": "RESEARCH",
      "date": "2026-07-30",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260730-0000-freqforcing-autoregressive-long-video-generation-via-spectral-se",
      "title": "🎬 FreqForcing: Autoregressive Long Video Generation via Spectral Self-Anchoring",
      "tag": "RESEARCH",
      "date": "2026-07-30",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260730-0000-pangram-4-technical-report-sota-ai-text-detection",
      "title": "🛡️ Pangram 4 Technical Report — SOTA AI-Text Detection",
      "tag": "RESEARCH",
      "date": "2026-07-30",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
