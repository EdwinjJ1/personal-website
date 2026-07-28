export const newsPreview = {
  "latestDate": "2026-07-28",
  "latestLabel": "July 28, 2026",
  "items": [
    {
      "id": "research-20260728-0000-a-roadmap-to-impactful-pluralistic-alignment-research",
      "title": "A Roadmap to Impactful Pluralistic Alignment Research",
      "tag": "RESEARCH",
      "date": "2026-07-28",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260728-0000-nanbeige4-2-3b-unlocking-agentic-capabilities-in-a-compact-model",
      "title": "Nanbeige4.2-3B: Unlocking Agentic Capabilities in a Compact Model",
      "tag": "RESEARCH",
      "date": "2026-07-28",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260728-0000-on-the-identifiability-of-controlled-world-models",
      "title": "On the Identifiability of Controlled World Models",
      "tag": "RESEARCH",
      "date": "2026-07-28",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
