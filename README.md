# Evan Lin - Personal Portfolio

A modern, responsive personal portfolio website built with Next.js 15, showcasing projects, skills, and experience.

## Live Site

[https://evanlin.site](https://evanlin.site)

## Features

- Dark theme with teal accents and Galaxy starfield WebGL background
- Splash screen with decrypt animation on every visit
- Global mouse-following text cursor particle effect
- Real GitHub activity graph powered by GitHub API
- Multi-page architecture: Home, Blog, Projects, About, Photography, News
- Photography portfolio with category filtering and modal gallery
- AI/Research news hub synced from ClawdBot canvas
- Responsive design with mobile hamburger menu
- Smooth animations via Framer Motion and GSAP
- Static export optimized for GitHub Pages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP
- **3D**: OGL (WebGL galaxy background)
- **Deployment**: GitHub Pages with GitHub Actions

## Pages

| Path | Description |
|------|-------------|
| `/` | Card-based home with skills, GitHub activity, news hub |
| `/blog` | Blog posts on technology and entrepreneurship |
| `/projects` | Project showcase with category filtering |
| `/about` | Background, timeline, skills, and interests |
| `/photography` | Portfolio gallery with FlowingMenu hover effects |
| `/news` | AI/Research/Industry/Global news dashboard |

## Local Development

```bash
git clone https://github.com/EdwinjJ1/personal-website.git
cd personal-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## News Sync

Use the `/sync-news` Claude Code skill to sync news from ClawdBot canvas:

```bash
node scripts/sync-ai-news.js
```

Sources: `~/clawd/canvas/{ai-news,arxiv-papers,industry-news,global-news}`

## Build

```bash
npm run build
npx serve out
```

## License

Open source.
