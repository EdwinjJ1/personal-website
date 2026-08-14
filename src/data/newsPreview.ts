export const newsPreview = {
  "latestDate": "2026-08-14",
  "latestLabel": "August 14, 2026",
  "items": [
    {
      "id": "industry-20260814-0914-cardinal-glass-to-install-world-first-carbon-capture-system-at-f",
      "title": "Cardinal Glass to Install World-First Carbon Capture System at Float Glass Plant",
      "tag": "POLICY",
      "date": "2026-08-14",
      "time": "09:14",
      "category": "industry"
    },
    {
      "id": "industry-20260814-0914-european-energy-closes-234-1m-financing-for-225-mw-italian-agriv",
      "title": "European Energy Closes €234.1M Financing for 225 MW Italian Agrivoltaic Project",
      "tag": "POLICY",
      "date": "2026-08-14",
      "time": "09:14",
      "category": "industry"
    },
    {
      "id": "industry-20260814-0914-microsoft-ppa-backed-150-mw-carwarp-solar-park-enters-operation-",
      "title": "Microsoft PPA-Backed 150 MW Carwarp Solar Park Enters Operation in Australia",
      "tag": "PRODUCT",
      "date": "2026-08-14",
      "time": "09:14",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
