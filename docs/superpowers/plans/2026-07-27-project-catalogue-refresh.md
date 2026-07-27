# Project Catalogue Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace retired portfolio entries with the current Akeso, LensDex, and Roundtable work across site and AI-readable sources.

**Architecture:** Keep `src/data/projects.ts` as the rendered catalogue and update its page ordering explicitly. Synchronize static project references in the in-site AI payload and public Markdown so every reader receives the same current portfolio.

**Tech Stack:** Next.js 15, React 19, TypeScript, static Markdown.

## Global Constraints

- Retain EgoTrace, Chiron Prompt Enhancer, FinalBoss, Study Materials, Chrono-Map, and Discord Bot.
- Delete KnowMe Memory MCP, Axon, AI Personal Assistant System, Machine Learning Portfolio, Personal Portfolio Website, SafeEyes for macOS, and AI Equity Radar from project-facing sources.
- Place Roundtable first, followed by Akeso and LensDex.
- Akeso copy must not mention a hackathon; link only its public showcase at `https://akeso-showcase.vercel.app`.

---

### Task 1: Refresh the rendered project catalogue

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/app/projects/page.tsx`

**Interfaces:**
- Consumes: `Project` and `projects` exports from `src/data/projects.ts`.
- Produces: an ordered active `Project[]` for the projects page and homepage.

- [ ] **Step 1: Replace retired project records**

Remove the retired records listed in Global Constraints. Add three records using the existing `Project` shape:

```ts
{
  title: 'Roundtable',
  tagline: 'Turn AI coding sessions into reusable, reviewable workflows.',
  category: 'AI & Automation',
  featured: true,
  status: 'In Development',
  githubUrl: 'https://github.com/EdwinjJ1/roundtable',
}
```

Add Akeso with its showcase URL and LensDex without an unpublished product URL. Give both project-specific descriptions, technology tags, metrics, highlights, icons, and accents matching the existing catalogue conventions.

- [ ] **Step 2: Set the showcase ordering**

Replace the `flagshipOrder` constant with:

```ts
const flagshipOrder = [
  'Roundtable',
  'Akeso',
  'LensDex',
  'FinalBoss',
  'Chrono-Map: Sydney Layers',
  'Chiron Prompt Enhancer',
];
```

- [ ] **Step 3: Verify source references**

Run: `rg -n -i "knowme|memory mcp|axon|ai personal assistant|machine learning portfolio|personal portfolio website|safeeyes|ai equity radar" src/data/projects.ts src/app/projects/page.tsx`

Expected: no matches.

### Task 2: Synchronize AI-readable project information

**Files:**
- Modify: `src/data/aiCard.ts`
- Modify: `public/projects.md`
- Modify: `public/llms.txt`

**Interfaces:**
- Consumes: the approved catalogue names and descriptions from Task 1.
- Produces: consistent in-site AI and external AI project context.

- [ ] **Step 1: Replace the AI brief's retired project reference**

Update the `What he's done` product bullet in `aiCardFullPayload` to name Roundtable, Akeso, LensDex, Chrono-Map, FinalBoss, and Chiron Prompt. Do not name KnowMe.

- [ ] **Step 2: Rewrite the public project catalogue**

Make `public/projects.md` present Roundtable, Akeso, and LensDex as the first three featured entries, retain the approved active entries, and remove retired records. Akeso's only public URL is its showcase; explicitly describe its app as in development.

- [ ] **Step 3: Update the AI index summary**

Change the Projects summary in `public/llms.txt` to name Roundtable, Akeso, LensDex, ChronoMap, Chiron Prompt, and FinalBoss.

- [ ] **Step 4: Verify public and AI sources**

Run: `rg -n -i "knowme|memory mcp|axon|ai personal assistant|machine learning portfolio|personal portfolio website|safeeyes|ai equity radar" src/data/aiCard.ts public/projects.md public/llms.txt`

Expected: no matches.

### Task 3: Build the updated website

**Files:**
- Verify: `src/app/projects/page.tsx`
- Verify: `src/app/page.tsx`
- Verify: `public/projects.md`

**Interfaces:**
- Consumes: the active catalogue and synchronized AI source content.
- Produces: a production Next.js build.

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: successful Next.js production build.

- [ ] **Step 2: Inspect the working-tree diff**

Run: `git diff --check && git diff -- src/data/projects.ts src/app/projects/page.tsx src/data/aiCard.ts public/projects.md public/llms.txt`

Expected: no whitespace errors and only the intended catalogue and information-source changes.
