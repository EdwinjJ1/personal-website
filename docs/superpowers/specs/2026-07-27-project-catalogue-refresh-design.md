# Project Catalogue Refresh Design

## Goal

Refresh the portfolio so it foregrounds the active product work and gives the same project information to the website, the homepage, the in-site AI brief, and external AI readers.

## Scope

- Keep the existing active catalogue entries: EgoTrace, Chiron Prompt Enhancer, FinalBoss, Study Materials, Chrono-Map, and Discord Bot.
- Remove KnowMe Memory MCP, Axon, AI Personal Assistant System, Machine Learning Portfolio, Personal Portfolio Website, SafeEyes for macOS, and AI Equity Radar from every project-facing source.
- Add Roundtable, Akeso, and LensDex.
- Make Roundtable the first flagship. Follow it with Akeso and LensDex, then retain the existing active featured work in a recruiter-friendly order.
- Describe Akeso only as a personal energy coach. Do not reference a hackathon. The public showcase points to `https://akeso-showcase.vercel.app`; the native app remains explicitly in development and has no public app link.

## Catalogue and presentation

`src/data/projects.ts` remains the canonical rendered catalogue. The projects page derives its flagship showcase, homepage preview, filters, counts, and remaining list from this array.

The flagship order is: Roundtable, Akeso, LensDex, FinalBoss, Chrono-Map, and Chiron Prompt Enhancer. The homepage uses the same ordering and therefore previews Roundtable and Akeso first.

Roundtable is a visual, reviewable workflow layer for local AI coding agents. Akeso turns a short daily check-in into an explainable energy-aware plan and practical nutrition guidance. LensDex is a bilingual camera and lens database with verified specifications, price context, editorial rankings, and community ratings.

## AI-readable sources

The in-site AI payload in `src/data/aiCard.ts`, the public project catalogue in `public/projects.md`, and the index in `public/llms.txt` are updated in the same change. Their project lists use the same active catalogue and avoid names removed from the site.

## Error handling and validation

No runtime data fetching or new interaction is introduced. The update is static content and existing link behavior. Run the production build after the patch; it compiles the affected routes and verifies TypeScript/Next.js integration.

## Constraints

- Keep existing project categories and status vocabulary.
- Preserve unrelated working-tree changes.
- Do not add a link for Akeso's unreleased app.
- Do not mention hackathons in Akeso copy.
