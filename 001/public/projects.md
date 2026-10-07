# Evan Lin — Active Projects

An overview of the products I am actively building and maintaining. The list prioritises current work across AI workflows, personal planning, creator tools, education, and developer experience.

---

## Featured

### Roundtable — *Turn AI coding sessions into reusable, reviewable workflows*

A visual workflow and governance layer for local AI coding agents. It turns a goal into a dependency-aware plan, coordinates specialist agents, and retains artifacts, handoffs, review state, safety checks, and repair loops in one inspectable history.

**Stack:** Next.js 15 · TypeScript · tRPC · NextAuth · PostgreSQL · Vitest

**Status:** In development · [GitHub](https://github.com/EdwinjJ1/roundtable)

### Akeso — *Plan around the energy you actually have*

A personal energy coach that converts a short daily check-in into an explainable energy map, an energy-aware plan for today, and practical nutrition guidance. The public showcase is live; the companion mobile app is still in development.

**Stack:** Expo · React Native · TypeScript · Express · Supabase · Zod

**Status:** In development · [Showcase](https://akeso-showcase.vercel.app) · [GitHub](https://github.com/EdwinjJ1/akeso)

### LensDex / 镜库 — *A clearer way to choose camera gear*

A bilingual camera and lens research database with real specifications, separate new and used price reference ranges, transparent editorial rankings, ratings, reviews, and comparison paths.

**Stack:** Next.js 15 · TypeScript · Prisma · PostgreSQL · Tailwind CSS · Playwright

**Status:** In development · [GitHub](https://github.com/EdwinjJ1/cameraweb)

### FinalBoss — *Beat any exam with AI*

AI exam-prep workspace used by 150+ users: create an exam workspace, upload notes and past papers, generate mock exams or practice sets, then use a Socratic AI tutor that finds weak spots without simply giving answers away.

**Stack:** Next.js 16 · Firebase · Stripe · Anthropic · Judge0

**Status:** In development · 150+ users · [Site](https://finalboss.cn) · [GitHub](https://github.com/EdwinjJ1/preuni-prexam)

### ChronoMap — *One map to understand the story behind every place*

Place-discovery experience combining a 3D Mapbox map, editorial storytelling, bilingual content, and then-and-now image comparisons. Sydney is the first layer in a system designed to scale city by city.

**Stack:** Next.js 16 · React 19 · Mapbox GL · Tailwind CSS · Framer Motion

**Status:** Live · [Site](https://chrono-map-eight.vercel.app) · [GitHub](https://github.com/EdwinjJ1/chrono-map)

### Chiron Prompt — *Augment-style prompt enhancement, inside the terminal*

Free, open-source prompt enhancer that scans a repository, reads relevant files and git state, then rewrites rough developer requests into scoped execution prompts for Gemini CLI and Claude Code.

**Stack:** Node.js · Gemini CLI · Claude Code · JavaScript

**Status:** Live · [GitHub](https://github.com/EdwinjJ1/chiron-prompt)

---

## Academic machine learning

### Fake News Detection — *Leakage-aware NLP model comparison*

COMP9444 group project comparing TF-IDF with Logistic Regression, an embedding-based BiLSTM, and title-only `google-bert/bert-base-uncased` fine-tuning on 44,267 labelled English news articles. I contributed to the dataset audit, de-duplication pipeline, model evaluation, and error analysis. The audit identified 1,399 overlapping train-test articles; after rebuilding leakage-controlled splits, the tuned character TF-IDF model achieved 99.43% accuracy and 99.42% F1 on 8,084 test articles. We also documented source and writing-style artifacts that limit real-world generalisation.

**Stack:** Python · PyTorch · Hugging Face Transformers · BERT · scikit-learn · pandas

**Status:** Completed academic group project · [Dataset](https://huggingface.co/datasets/ErfanMoosaviMonazzah/fake-news-detection-dataset-English) · [BERT](https://huggingface.co/google-bert/bert-base-uncased)

---

## Other active projects

### EgoTrace

AI-powered second brain and smart calendar for habit building, time management, and team collaboration. Includes AI calendar import, gamified habits, and cross-platform delivery.

**Stack:** Next.js 15 · React 19 · Prisma · Capacitor · Tailwind CSS

**Status:** In development · [Site](https://egotrace.vercel.app) · [GitHub](https://github.com/EdwinjJ1/calendar)

### 3D Print Skill for Claude

A Claude skill that searches real hardware specifications before generating manifold-safe 3D models for Bambu Studio and PrusaSlicer.

**Status:** Live · [GitHub](https://github.com/EdwinjJ1/3d-print-skill)

### Study Materials (PreUni)

Interactive study platform for UNSW Computer Science students with bilingual content and data visualisations.

**Stack:** JavaScript · Tailwind CSS · Chart.js · Plotly.js · Stripe

**Status:** Live · [Site](http://www.preuni.xyz)

### Discord Bot

Discord bot with custom commands, moderation tools, role management, and community interaction features.

**Stack:** Node.js · discord.js

**Status:** Live · [GitHub](https://github.com/EdwinjJ1/discord-bot)

---

More at [github.com/EdwinjJ1](https://github.com/EdwinjJ1) · Back to [about](https://evanlin.site/me.md)
