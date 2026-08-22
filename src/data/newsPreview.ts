export const newsPreview = {
  "latestDate": "2026-08-22",
  "latestLabel": "August 22, 2026",
  "items": [
    {
      "id": "industry-20260822-2315-compulsion-games-completes-management-buyout-from-xbox-regains-f",
      "title": "Compulsion Games Completes Management Buyout From Xbox, Regains Full IP Rights",
      "tag": "PRODUCT",
      "date": "2026-08-22",
      "time": "23:15",
      "category": "industry"
    },
    {
      "id": "industry-20260822-2315-double-fine-leaves-xbox-tim-schafer-regains-full-publishing-righ",
      "title": "Double Fine Leaves Xbox — Tim Schafer Regains Full Publishing Rights to Game Catalog",
      "tag": "PRODUCT",
      "date": "2026-08-22",
      "time": "23:15",
      "category": "industry"
    },
    {
      "id": "industry-20260822-2315-makers-fund-closes-250m-fund-iv-interactive-entertainment-vc-cro",
      "title": "Makers Fund Closes $250M Fund IV — Interactive-Entertainment VC Crosses $1.5B AUM",
      "tag": "PRODUCT",
      "date": "2026-08-22",
      "time": "23:15",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
