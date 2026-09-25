export const newsPreview = {
  "latestDate": "2026-09-25",
  "latestLabel": "September 25, 2026",
  "items": [
    {
      "id": "research-rss-d9c35de2f3af8be7995d",
      "title": "Dual-Frontier: When Can an Agent Trust Its World Model?",
      "tag": "RESEARCH",
      "date": "2026-09-25",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-rss-ea664bf32981ed76a775",
      "title": "Type-Safe Is Not Error-Free: A Constrained Decision Head Follows the Option Name, Not the Rubric Bound to It",
      "tag": "RESEARCH",
      "date": "2026-09-25",
      "time": "04:00",
      "category": "research"
    },
    {
      "id": "research-rss-12bb3566a490c1d0e70e",
      "title": "Grow the Harness, Not the Context: From Strategy-Free Scaffolds to Reusable Specialist Agents",
      "tag": "RESEARCH",
      "date": "2026-09-25",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
