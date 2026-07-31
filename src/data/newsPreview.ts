export const newsPreview = {
  "latestDate": "2026-07-31",
  "latestLabel": "July 31, 2026",
  "items": [
    {
      "id": "research-20260731-0000-aispa-user-centric-system-prompt-auditing-for-large-language-mod",
      "title": "AISPA: User-Centric System Prompt Auditing for Large Language Model Applications",
      "tag": "RESEARCH",
      "date": "2026-07-31",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260731-0000-askchem-claim-centered-infrastructure-for-chemistry-literature-s",
      "title": "AskChem: Claim-Centered Infrastructure for Chemistry Literature Synthesis",
      "tag": "RESEARCH",
      "date": "2026-07-31",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260731-0000-osreward-instituting-standardized-evaluation-for-cross-platform-",
      "title": "OSReward: Instituting Standardized Evaluation for Cross-Platform Computer-Use Reward Models",
      "tag": "RESEARCH",
      "date": "2026-07-31",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
