export const newsPreview = {
  "latestDate": "2026-10-03",
  "latestLabel": "October 3, 2026",
  "items": [
    {
      "id": "global-rss-36367861a20bb5c741a5",
      "title": "G7 to release millions of barrels of oil and diesel after Trump threat",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "04:38",
      "category": "global"
    },
    {
      "id": "global-rss-888ac0a61f6b891150c0",
      "title": "Cornell frat house rape accuser 'under siege' online, says lawyer",
      "tag": "BREAKING",
      "date": "2026-10-03",
      "time": "02:23",
      "category": "global"
    },
    {
      "id": "industry-rss-2d0c1972c36b2f83c7e4",
      "title": "Tech Now",
      "tag": "PRODUCT",
      "date": "2026-10-03",
      "time": "01:00",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
