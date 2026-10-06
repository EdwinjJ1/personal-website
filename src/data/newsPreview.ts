export const newsPreview = {
  "latestDate": "2026-10-06",
  "latestLabel": "October 6, 2026",
  "items": [
    {
      "id": "global-rss-bfdfa4b1ba902d86e409",
      "title": "Lawyer for one of Cornell 7 calls for special prosecutor to be removed over previous comments",
      "tag": "BREAKING",
      "date": "2026-10-06",
      "time": "18:05",
      "category": "global"
    },
    {
      "id": "industry-rss-1e1fb6600fb2f6ae1420",
      "title": "Asos confirms hackers sent 'unauthorised' notification to app users",
      "tag": "PRODUCT",
      "date": "2026-10-06",
      "time": "17:50",
      "category": "industry"
    },
    {
      "id": "industry-rss-f74f87d0584cad18b66d",
      "title": "Finland orders halt to work on two Google data centres",
      "tag": "PRODUCT",
      "date": "2026-10-06",
      "time": "17:15",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
