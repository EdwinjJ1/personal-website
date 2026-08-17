export const newsPreview = {
  "latestDate": "2026-08-17",
  "latestLabel": "August 17, 2026",
  "items": [
    {
      "id": "industry-20260817-0903-bank-leumi-partners-with-galaxy-to-bring-btc-eth-sol-trading-to-",
      "title": "Bank Leumi Partners with Galaxy to Bring BTC, ETH, SOL Trading to 2.5M Israeli Customers in 2027",
      "tag": "PRODUCT",
      "date": "2026-08-17",
      "time": "09:03",
      "category": "industry"
    },
    {
      "id": "industry-20260817-0903-bitgo-captures-27-5-of-26-6b-real-world-asset-market-overtakes-s",
      "title": "BitGo Captures 27.5% of $26.6B Real-World Asset Market, Overtakes Securitize, Ondo, BlackRock",
      "tag": "PRODUCT",
      "date": "2026-08-17",
      "time": "09:03",
      "category": "industry"
    },
    {
      "id": "industry-20260817-0903-cboe-bzx-files-for-first-3x-leveraged-bitcoin-and-ether-etfs-in-",
      "title": "Cboe BZX Files for First 3x Leveraged Bitcoin and Ether ETFs in the U.S.",
      "tag": "PRODUCT",
      "date": "2026-08-17",
      "time": "09:03",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
