export const newsPreview = {
  "latestDate": "2026-10-02",
  "latestLabel": "October 2, 2026",
  "items": [
    {
      "id": "global-rss-dce3b7690583e839bec2",
      "title": "US pressures Europe over diesel reserves as Trump threatens export ban",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "05:26",
      "category": "global"
    },
    {
      "id": "global-rss-79a1e11c828341024be5",
      "title": "Australia says platforms like Steam and Roblox have 'significant' child safety gaps",
      "tag": "BREAKING",
      "date": "2026-10-02",
      "time": "04:21",
      "category": "global"
    },
    {
      "id": "research-rss-f2be228cf342a968b219",
      "title": "NesTok: Nested Self-Aligned 1D Tokenizer for Autoregressive Image Generation",
      "tag": "RESEARCH",
      "date": "2026-10-02",
      "time": "04:00",
      "category": "research"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
