export const newsPreview = {
  "latestDate": "2026-08-27",
  "latestLabel": "August 27, 2026",
  "items": [
    {
      "id": "industry-20260827-2333-flipkart-minutes-overtakes-swiggy-instamart-in-dark-store-count-",
      "title": "Flipkart Minutes Overtakes Swiggy Instamart in Dark-Store Count Across India's Top 10 Cities — CLSA Sees Eternal +53.5% Upside",
      "tag": "PRODUCT",
      "date": "2026-08-27",
      "time": "23:33",
      "category": "industry"
    },
    {
      "id": "industry-20260827-2333-honasa-consumer-mamaearth-calls-off-135-cr-fluence-pharma-acquis",
      "title": "Honasa Consumer (Mamaearth) Calls Off ₹135 Cr Fluence Pharma Acquisition — Closing Conditions Not Met, Nutraceuticals Strategy Intact",
      "tag": "PRODUCT",
      "date": "2026-08-27",
      "time": "23:33",
      "category": "industry"
    },
    {
      "id": "industry-20260827-2333-kkr-buys-out-l-catterton-to-take-full-control-of-japan-s-ci-flav",
      "title": "KKR Buys Out L Catterton to Take Full Control of Japan's Ci FLAVORS (&honey, 8 THE THALASSO, unlabel)",
      "tag": "PRODUCT",
      "date": "2026-08-27",
      "time": "23:33",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
