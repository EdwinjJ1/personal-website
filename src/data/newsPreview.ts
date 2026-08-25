export const newsPreview = {
  "latestDate": "2026-08-25",
  "latestLabel": "August 25, 2026",
  "items": [
    {
      "id": "industry-20260825-0000-china-s-palantir-zhongshu-ruizhi-closes-multi-hundred-million-rm",
      "title": "\"China's Palantir\" Zhongshu Ruizhi (中数睿智) Closes Multi-Hundred-Million RMB Strategic Round — National Team Capital Goes All In",
      "tag": "PRODUCT",
      "date": "2026-08-25",
      "time": "00:00",
      "category": "industry"
    },
    {
      "id": "industry-20260825-0000-alibaba-closes-hk-80b-top-up-placement-100-to-full-stack-ai-jack",
      "title": "Alibaba Closes HK$80B Top-Up Placement — 100% to Full-Stack AI; Jack Ma Personally Adds HK$800M+ in Show of Confidence",
      "tag": "PRODUCT",
      "date": "2026-08-25",
      "time": "00:00",
      "category": "industry"
    },
    {
      "id": "industry-20260825-0000-bytedance-launches-doubao-work-ai-office-agent-goes-head-to-head",
      "title": "ByteDance Launches \"Doubao Work\" AI Office Agent — Goes Head-to-Head with Tencent WorkBuddy and Alibaba Qianwen Office",
      "tag": "PRODUCT",
      "date": "2026-08-25",
      "time": "00:00",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
