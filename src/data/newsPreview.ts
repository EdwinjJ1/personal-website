export const newsPreview = {
  "latestDate": "2026-08-18",
  "latestLabel": "August 18, 2026",
  "items": [
    {
      "id": "research-20260818-0000-an-empirical-study-of-training-pixel-space-text-to-image-diffusi",
      "title": "An Empirical Study of Training Pixel-Space Text-to-Image Diffusion Models",
      "tag": "RESEARCH",
      "date": "2026-08-18",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260818-0000-clawgym-ii-exploring-black-box-rl-on-agent-harness",
      "title": "ClawGym II: Exploring Black-Box RL on Agent Harness",
      "tag": "RESEARCH",
      "date": "2026-08-18",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260818-0000-don-t-drop-the-baton-long-horizon-robot-manipulation-via-agentic",
      "title": "Don't Drop the BATON: Long-Horizon Robot Manipulation via Agentic Subtask Exploration and Transition-aware Memory",
      "tag": "RESEARCH",
      "date": "2026-08-18",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
