export const newsPreview = {
  "latestDate": "2026-08-24",
  "latestLabel": "August 24, 2026",
  "items": [
    {
      "id": "industry-20260824-0904-bitcoin-erupts-past-77k-to-80k-on-u-s-treasury-buyback-expansion",
      "title": "Bitcoin Erupts Past $77K to ~$80K on U.S. Treasury Buyback Expansion — $4B+ Short Liquidated, Total Crypto Market Cap Adds $500B to $2.74T",
      "tag": "PRODUCT",
      "date": "2026-08-24",
      "time": "09:04",
      "category": "industry"
    },
    {
      "id": "industry-20260824-0904-grayscale-files-5th-amendment-for-zcash-trust-the-zcash-etf-zcsh",
      "title": "Grayscale Files 5th Amendment for Zcash Trust → \"The Zcash ETF\" (ZCSH) — First U.S. Privacy-Coin Spot ETF in the Pipeline, 2.5% Fee, Possible 34% DCG Stake",
      "tag": "PRODUCT",
      "date": "2026-08-24",
      "time": "09:04",
      "category": "industry"
    },
    {
      "id": "industry-20260824-0904-trump-holds-white-house-crypto-summit-sets-sept-15-senate-proced",
      "title": "Trump Holds White House Crypto Summit, Sets Sept 15 Senate Procedural Vote on CLARITY Act — Ethics Provision Remains the Blocker",
      "tag": "POLICY",
      "date": "2026-08-24",
      "time": "09:04",
      "category": "industry"
    }
  ]
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
