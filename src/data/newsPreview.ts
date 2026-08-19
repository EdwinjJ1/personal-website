export const newsPreview = {
  "latestDate": "2026-08-19",
  "latestLabel": "August 19, 2026",
  "items": [
    {
      "id": "research-20260819-0000-autoresearch-insight-in-hallucination-out",
      "title": "AutoResearch: Insight In, Hallucination Out",
      "tag": "RESEARCH",
      "date": "2026-08-19",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260819-0000-procedural-content-metageneration-via-program-search-and-continu",
      "title": "Procedural Content Metageneration via Program Search and Continual Abstraction Discovery",
      "tag": "RESEARCH",
      "date": "2026-08-19",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260819-0000-stagedworkspace-a-versioned-workspace-for-knowledge-work-agents",
      "title": "StagedWorkspace: A Versioned Workspace for Knowledge-Work Agents",
      "tag": "RESEARCH",
      "date": "2026-08-19",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
