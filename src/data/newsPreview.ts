export const newsPreview = {
  "latestDate": "2026-06-25",
  "latestLabel": "June 25, 2026",
  "items": [
    {
      "id": "research-20260625-0407-learning-action-priors-for-cross-embodiment-robot-manipulation",
      "title": "Learning Action Priors for Cross-embodiment Robot Manipulation",
      "tag": "RESEARCH",
      "date": "2026-06-25",
      "time": "04:07",
      "category": "research"
    },
    {
      "id": "research-20260625-0407-model-forensics-investigating-whether-concerning-behavior-reflec",
      "title": "Model Forensics: Investigating Whether Concerning Behavior Reflects Misalignment",
      "tag": "RESEARCH",
      "date": "2026-06-25",
      "time": "04:07",
      "category": "research"
    },
    {
      "id": "research-20260625-0407-neglected-free-lunch-from-post-training-progress-advantage-for-l",
      "title": "Neglected Free Lunch from Post-training: Progress Advantage for LLM Agents",
      "tag": "RESEARCH",
      "date": "2026-06-25",
      "time": "04:07",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
