export const newsPreview = {
  "latestDate": "2026-07-25",
  "latestLabel": "July 25, 2026",
  "items": [
    {
      "id": "research-20260725-0000-emergent-misalignment-recruits-a-pre-existing-persona-subspace",
      "title": "Emergent Misalignment Recruits a Pre-existing Persona Subspace",
      "tag": "RESEARCH",
      "date": "2026-07-25",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260725-0000-mirror-learning-from-the-other-view-for-multi-modal-reasoning",
      "title": "MIRROR: Learning from the Other View for Multi-Modal Reasoning",
      "tag": "RESEARCH",
      "date": "2026-07-25",
      "time": "00:00",
      "category": "research"
    },
    {
      "id": "research-20260725-0000-openforgerl-train-harness-native-agents-in-any-environment",
      "title": "OpenForgeRL: Train Harness-native Agents in Any Environment",
      "tag": "RESEARCH",
      "date": "2026-07-25",
      "time": "00:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
