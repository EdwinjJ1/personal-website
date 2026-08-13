export const newsPreview = {
  "latestDate": "2026-08-13",
  "latestLabel": "August 13, 2026",
  "items": [
    {
      "id": "research-20260813-0000-ai4ai-at-test-time-strong-to-weak-capability-transfer-via-harnes",
      "title": "AI4AI at Test-Time: Strong-to-Weak Capability Transfer via Harnesses",
      "tag": "RESEARCH",
      "date": "2026-08-13",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260813-0000-ava-encoder-towards-agent-native-video-representation-learning",
      "title": "AVA-Encoder: Towards Agent-Native Video Representation Learning",
      "tag": "RESEARCH",
      "date": "2026-08-13",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260813-0000-information-abundance-paradox-long-context-training-undermines-p",
      "title": "Information Abundance Paradox: Long-Context Training Undermines Parametric Knowledge",
      "tag": "RESEARCH",
      "date": "2026-08-13",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
