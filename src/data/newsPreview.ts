export const newsPreview = {
  "latestDate": "2026-08-23",
  "latestLabel": "August 23, 2026",
  "items": [
    {
      "id": "industry-20260823-2304-china-releases-three-edtech-llm-group-standards-at-gse2026-first",
      "title": "China Releases Three EdTech LLM Group Standards at GSE2026 — First Sector-Level Guardrails for \"AI + Education\"",
      "tag": "PRODUCT",
      "date": "2026-08-23",
      "time": "23:04",
      "category": "industry"
    },
    {
      "id": "industry-20260823-2304-jiuxuewang-tencent-cloud-launch-future-learning-center-at-wwec-2",
      "title": "Jiuxuewang + Tencent Cloud Launch \"Future Learning Center\" at WWEC 2026 — \"AI Dual-Learning · Dual-Planning\" System 3.0 + AI Self-Study Room Franchise",
      "tag": "PRODUCT",
      "date": "2026-08-23",
      "time": "23:04",
      "category": "industry"
    },
    {
      "id": "industry-20260823-2304-medly-ai-london-closes-8m-seed-led-by-felix-capital-joins-uk-dep",
      "title": "Medly AI (London) Closes $8M Seed Led by Felix Capital — Joins UK Dept. for Education AI Tutoring Pioneers Alongside Pearson & ElevenLabs",
      "tag": "PRODUCT",
      "date": "2026-08-23",
      "time": "23:04",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
