# Evan Lin — Projects

An overview of what I've built. Most of it is AI tooling for developers, plus a few full products. Featured projects have their own deep-dive docs linked below.

---

## Featured

### KnowMe Memory MCP — *Give every AI the right version of you*
Token-gated personal context server that turns profiles, resumes, notes, and durable facts into permissioned AI memory. Self-hosted memory engine for Claude, ChatGPT, Cursor, Codex, Gemini, and any MCP-capable AI client. Public/full/admin token tiers, Cloudflare Worker MCP server, D1 + Vectorize semantic search, and a self-correcting clarification loop.
**Stack:** Cloudflare Workers · MCP · D1 · Vectorize · Workers AI · Node.js
**Status:** In development · [GitHub](https://github.com/EdwinjJ1/memory-mcp)

### ChronoMap — *One map to understand the story behind every place*
Production-grade place-discovery experience combining a 3D Mapbox map, editorial storytelling, bilingual content, and then-and-now image comparisons. Sydney is the first content layer; the data model scales into more cities, film-location tours, and cultural partnerships. 50+ historical sites.
**Stack:** Next.js 16 · React 19 · Mapbox GL · Tailwind CSS · Framer Motion
**Status:** Live · [Site](https://chronomap.site) · [GitHub](https://github.com/EdwinjJ1/chrono-map)

### Chiron Prompt — *Augment-style prompt enhancement, inside the terminal*
Free, open-source prompt enhancer that scans a repo, reads relevant files and git state, then rewrites rough requests into scoped execution prompts for Gemini CLI and Claude Code. Ships as a slash command and a double-Ctrl+E overlay.
**Stack:** Node.js · Gemini CLI · Claude Code · JavaScript
**Status:** Live · [GitHub](https://github.com/EdwinjJ1/chiron-prompt)

### FinalBoss — *Beat any exam with AI*
AI exam-prep workspace: one workspace per exam, upload notes and past papers, generate mock exams or practice sets, then use a Socratic AI tutor that finds weak spots without just handing over answers. Free/basic/Pro tiers, Stripe subscriptions, campus-first UNSW launch.
**Stack:** Next.js 16 · Firebase · Stripe · Anthropic · Judge0
**Status:** In development · [Site](https://finalboss.cn) · [GitHub](https://github.com/EdwinjJ1/preuni-prexam)

---

## Other projects

### EgoTrace
AI-powered second brain and smart calendar for habit building, time management, and team collaboration. Smart calendar with AI import, gamified habit tracking, cross-platform via Capacitor.
**Stack:** Next.js 15 · React 19 · Prisma · Capacitor · Tailwind CSS
**Status:** In development · [Site](https://egotrace.vercel.app) · [GitHub](https://github.com/EdwinjJ1/calendar)

### Axon
Electron + React + TypeScript boilerplate for building prompt-engineering desktop assistants. Clean separation of main/preload/renderer, secure IPC, production-ready build pipeline.
**Stack:** Electron · React · TypeScript · Vite
**Status:** Live · [Site](https://www.promptenhenceraxon.top) · [GitHub](https://github.com/EdwinjJ1/Axon)

### 3D Print Skill for Claude
A Claude skill that searches real hardware specs before generating manifold-safe 3D models for Bambu Studio / PrusaSlicer.
**Status:** Live · [GitHub](https://github.com/EdwinjJ1/3d-print-skill)

### SafeEyes for macOS
Native macOS eye-strain reminder with customizable breaks, bilingual (EN/CN) notifications, and three launch modes. Zero external dependencies.
**Stack:** Python · AppleScript · macOS
**Status:** Live · [GitHub](https://github.com/EdwinjJ1/SafeEyes--mac)

### Study Materials (PreUni)
Interactive study platform for UNSW CS students with bilingual content and data visualisations. Earlier iterations had paying subscribers via Stripe.
**Stack:** JavaScript · Tailwind CSS · Chart.js · Plotly.js · Stripe
**Status:** Live · [Site](http://www.preuni.xyz)

### AI Equity Radar
UNSW AIP Hackathon project. Analyzes 184 countries using World Bank data to identify inequality hotspots, with composite risk scoring and recommended AI interventions.
**Stack:** Python · Flask · Pandas · Plotly.js

### Discord Bot
Feature-rich Discord bot with custom commands, automated moderation, role management, and robust logging.
**Stack:** Node.js · discord.js
**Status:** Live · [GitHub](https://github.com/EdwinjJ1/discord-bot)

---

More at [github.com/EdwinjJ1](https://github.com/EdwinjJ1) · Back to [about](https://evanlin.site/me.md)
