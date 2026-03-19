---
name: ai-news-sync
description: Sync local news sources from `/Users/edwinj/clawd/canvas` into this personal website's news data and UI. Use when the user asks to read or sync `ai-news`, `arxiv-papers`, `industry-news`, `global-news`, refresh the website news calendar, or keep `personal-website` news in sync with the local Clawd news feeds.
---

# AI News Sync

Use this skill when working inside the `personal-website` repo and the user wants the local news feeds synced into the website.

## What To Check First

1. Confirm the repo contains `scripts/sync-ai-news.js` and `src/data/news-data.json`.
2. Confirm the source root exists at `/Users/edwinj/clawd/canvas`.
3. Check the relevant source folders:
   - `/Users/edwinj/clawd/canvas/ai-news`
   - `/Users/edwinj/clawd/canvas/arxiv-papers`
   - `/Users/edwinj/clawd/canvas/industry-news`
   - `/Users/edwinj/clawd/canvas/global-news`
4. Inspect the latest dated subfolders if the user asks what changed.

## Default Workflow

1. Read the current site wiring:
   - `src/app/news/page.tsx`
   - `src/components/cards/NewsCard.tsx`
   - `src/data/news-data.json`
2. Run the sync:
   - `npm run news:sync`
3. Verify the newest date and item counts landed in `src/data/news-data.json`.
4. If the user asked for UI updates too, adjust the news page or card so the newest synced data is visible.
5. Run targeted validation on touched files first.
   - Example: `npx eslint src/app/news/page.tsx src/components/cards/NewsCard.tsx scripts/sync-ai-news.js`
6. If broader verification is needed, run:
   - `npm run build`
   - `npx tsc --noEmit`
   - `npm run lint`

## Important Context

- `ai-news` maps to category `ai`.
- `arxiv-papers` maps to category `research`.
- `industry-news` maps to category `industry`.
- `global-news` maps to category `global`.
- Some industry/global source files contain source names but no outbound links; keep those cards readable instead of forcing a broken link.
- Prefer updating the reusable sync script over hand-editing `src/data/news-data.json`.

## When The User Wants More Than Sync

- If the user asks for calendar/date UX improvements, update `src/app/news/page.tsx`.
- If the user asks for homepage highlights to reflect the latest sync, update `src/components/cards/NewsCard.tsx`.
- If the source HTML format changes, patch `scripts/sync-ai-news.js` instead of working around it in the data file.
