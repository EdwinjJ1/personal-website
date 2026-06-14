export type ProjectStatus = 'Live' | 'In Development' | 'Ongoing' | 'Archived';

export type ProjectCategory =
  | 'Education'
  | 'AI & Automation'
  | 'Web Development'
  | 'Machine Learning'
  | 'Entrepreneurship';

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: ProjectCategory;
  featured: boolean;
  status: ProjectStatus;
  liveUrl?: string;
  githubUrl?: string;
  link?: string;
  icon?: string;
  tagline?: string;
  heroImage?: string;
  logoImage?: string;
  accent?: string;
  metrics?: { label: string; value: string }[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 106,
    title: 'KnowMe Memory MCP',
    tagline: 'Give every AI the right version of you.',
    description:
      'Token-gated personal context server that turns profiles, resumes, notes, and durable facts into permissioned AI memory.',
    longDescription:
      'KnowMe MCP is an open-source self-hosted memory engine for Claude, ChatGPT, Cursor, Codex, Gemini, Qwen, and any AI client that can call an MCP endpoint. It distills profile data into structured memories, separates public and private access with tokens, syncs to a Cloudflare Worker MCP server, and closes the loop with clarification questions so memory can be verified instead of silently drifting.',
    technologies: ['Cloudflare Workers', 'MCP', 'D1', 'Vectorize', 'Workers AI', 'Node.js'],
    category: 'AI & Automation',
    featured: true,
    status: 'In Development',
    githubUrl: 'https://github.com/EdwinjJ1/memory-mcp',
    icon: 'network',
    logoImage: '/images/projects/knowme-logo.png',
    accent: '#58d9e6',
    metrics: [
      { label: 'Token tiers', value: '3' },
      { label: 'AI clients', value: '6+' },
      { label: 'Memory tools', value: '8' },
    ],
    highlights: [
      'Public/full/admin token access tiers',
      'Cloudflare Worker remote MCP server',
      'Structured memory distillation pipeline',
      'D1 + Vectorize semantic search',
      'Self-correcting clarification loop',
    ],
  },
  {
    id: 101,
    title: 'EgoTrace',
    description:
      'AI-powered second brain and smart calendar for habit building, time management, and team collaboration.',
    longDescription:
      'A modern productivity suite that helps you build better habits, manage your schedule with AI, and understand yourself. Features include a smart calendar with AI import, habit tracking with gamification, team collaboration tools, and personality insights. Built with a modern tech stack including Next.js 15, Prisma, and Capacitor for mobile.',
    technologies: ['Next.js 15', 'React 19', 'Prisma', 'Tailwind CSS', 'Capacitor', 'AI Integration'],
    category: 'AI & Automation',
    featured: false,
    status: 'In Development',
    liveUrl: 'https://egotrace.vercel.app/',
    githubUrl: 'https://github.com/EdwinjJ1/calendar',
    icon: 'brain',
    highlights: [
      'Smart Calendar with AI Event Import',
      'Habit Tracking & Gamification',
      'Team Collaboration & Chat',
      'Cross-platform (Web & Mobile)',
      'Personality Insights & Analytics',
    ],
  },
  {
    id: 102,
    title: 'Axon',
    description:
      'Professional desktop application boilerplate for prompt engineering, built with Electron and React.',
    longDescription:
      'Electron + React + TypeScript boilerplate tailored for a prompt engineering desktop assistant. The template separates concerns between main, preload, and renderer processes, enabling plug-and-play AI feature integration. Designed for high performance and scalability.',
    technologies: ['Electron', 'React', 'TypeScript', 'Vite', 'Node.js'],
    category: 'AI & Automation',
    featured: false,
    status: 'Live',
    liveUrl: 'https://www.promptenhenceraxon.top',
    githubUrl: 'https://github.com/EdwinjJ1/Axon',
    icon: 'diamond',
    highlights: [
      'Electron + React + TypeScript Architecture',
      'Secure IPC Communication',
      'Hot Reloading Development Workflow',
      'Production-ready Build Pipeline',
      'Tailored for AI Applications',
    ],
  },
  {
    id: 103,
    title: 'Chiron Prompt Enhancer',
    tagline: 'Augment-style prompt enhancement, inside the terminal.',
    description:
      'Free, open-source prompt enhancer that turns rough requests into repo-aware execution prompts for Gemini CLI and Claude Code.',
    longDescription:
      'Chiron scans a repository, reads relevant files and git state, then rewrites rough developer requests into scoped execution prompts. It ships as a Gemini CLI slash command, an optional double Ctrl+E overlay, and a reusable Claude Code command, giving terminal-first builders an Augment-like enhancement flow without locking them into a heavyweight IDE agent.',
    technologies: ['Node.js', 'Gemini CLI', 'Claude Code', 'JavaScript', 'Prompt Engineering'],
    category: 'AI & Automation',
    featured: true,
    status: 'Live',
    githubUrl: 'https://github.com/EdwinjJ1/chiron-prompt',
    icon: 'terminal',
    accent: '#f7a64a',
    metrics: [
      { label: 'Shortcut', value: 'Ctrl+E' },
      { label: 'Modes', value: '6' },
      { label: 'Cost', value: '$0' },
    ],
    highlights: [
      'Augment-style Double Ctrl+E Enhancement',
      'Repo-aware Context Scanning',
      'Gemini CLI + Claude Code Integration',
      'Git State & Relevant File Detection',
      'Terminal-first Workflow',
    ],
  },
  {
    id: 105,
    title: 'FinalBoss',
    tagline: 'Beat any exam with AI.',
    description:
      'AI exam-prep workspace that turns notes and past papers into timed mocks, targeted practice, and Socratic tutor feedback.',
    longDescription:
      'FinalBoss is a focused AI study product: one workspace per exam, upload or paste notes and past papers, generate mock exams or practice sets, then use an AI tutor to identify weak spots without simply giving away answers. The business model is already mapped with free, basic, and Practice Pro tiers, Stripe subscriptions, Firebase auth, and a campus-first UNSW launch plan.',
    technologies: ['Next.js 16', 'Firebase', 'Stripe', 'Anthropic', 'Tailwind CSS', 'Judge0'],
    category: 'Education',
    featured: true,
    status: 'In Development',
    liveUrl: 'https://finalboss.cn/',
    githubUrl: 'https://github.com/EdwinjJ1/preuni-prexam',
    icon: 'graduation',
    logoImage: '/images/projects/finalboss-icon.png',
    heroImage: '/images/projects/finalboss-home.png',
    accent: '#f6c63f',
    metrics: [
      { label: 'Gross margin', value: '96%' },
      { label: 'MVP scope', value: '6 wk' },
      { label: 'Pro plan', value: 'A$39' },
    ],
    highlights: [
      'Exam workspaces with uploaded materials',
      'Mock and practice generation',
      'AI grading and weakness feedback',
      'Socratic tutor for CS/code exams',
      'Stripe subscription model and campus GTM',
    ],
  },
  {
    id: 1,
    title: 'Study Materials',
    description:
      'Interactive study notes and resources for UNSW Computer Science students with bilingual content and data visualisations.',
    longDescription:
      'A comprehensive educational platform tailored for UNSW Computer Science students. Features interactive code examples, bilingual content (English and Chinese), dynamic data visualisations powered by Chart.js and Plotly.js, and a responsive layout optimised for learning on any device. Earlier iterations also included a donations module powered by Stripe.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Chart.js', 'Plotly.js', 'Stripe'],
    category: 'Education',
    featured: false,
    status: 'Live',
    liveUrl: 'http://www.preuni.xyz/',
    icon: 'book',
    highlights: [
      'Interactive code examples',
      'Bilingual content (EN / CN)',
      'Chart.js and Plotly visualisations',
      'Responsive learning experience',
      'Optional Stripe donations module',
    ],
  },
  {
    id: 2,
    title: 'AI Personal Assistant System',
    description:
      'A Claude MCP-based personal productivity system that orchestrates specialised AI agents for daily work and wellbeing.',
    longDescription:
      'Built on Claude MCP, this system coordinates five autonomous agents for daily planning, AI news curation, daily reports, guided reflections, and wellness check-ins. It integrates with the Notion API and Google Calendar to automate workflows and deliver actionable insights.',
    technologies: ['Node.js', 'Claude MCP', 'Notion API', 'Google APIs', 'TypeScript', 'Jest'],
    category: 'AI & Automation',
    featured: false,
    status: 'In Development',
    githubUrl: '#',
    icon: 'bot',
    highlights: [
      'Five specialised AI agents',
      'Notion + Google Calendar integrations',
      'Automated workflow orchestration',
      'Time-based triggers and notifications',
      'Extensive logging and monitoring',
    ],
  },
  {
    id: 3,
    title: 'Machine Learning Portfolio',
    description:
      'A collection of machine-learning experiments spanning computer vision, NLP, recommendation systems, and forecasting.',
    longDescription:
      'A continuously evolving portfolio of machine-learning projects that explores computer vision, natural language processing, recommendation systems, and time-series forecasting. Models are built with TensorFlow, PyTorch, and scikit-learn, and documented with Jupyter notebooks.',
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter'],
    category: 'Machine Learning',
    featured: false,
    status: 'Ongoing',
    githubUrl: '#',
    icon: 'layers',
    highlights: [
      'Image classification experiments',
      'NLP sentiment analysis pipelines',
      'Collaborative filtering prototypes',
      'Time-series forecasting models',
      'Deployment-ready model packaging',
    ],
  },
  {
    id: 4,
    title: 'Personal Portfolio Website',
    description:
      'The website you are viewing now — a modern Next.js 15 build with dark mode styling and motion design.',
    longDescription:
      'A modern, responsive personal site that showcases my projects, skills, and writing. Built with Next.js 15, Tailwind CSS, and Framer Motion to deliver a fast, animated experience. Optimised for performance, accessibility, and SEO.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: 'Web Development',
    featured: false,
    status: 'Live',
    githubUrl: '#',
    icon: 'briefcase',
    highlights: [
      'Next.js App Router architecture',
      'Framer Motion micro-interactions',
      'Dark-mode design system',
      'Lighthouse performance tuning',
      'SEO metadata and OG tags',
    ],
  },
  {
    id: 5,
    title: 'SafeEyes for macOS',
    description:
      'A native macOS eye-strain reminder with customizable breaks, bilingual support, and multiple notification modes.',
    longDescription:
      'SafeEyes for macOS is a cross-platform eye-strain prevention tool adapted specifically for macOS users. It schedules customizable microbreaks and longer rest periods to reduce screen fatigue. Features include native AppleScript integration, bilingual notifications (English/Chinese), persistent settings, and three launch modes: native dialogs, fullscreen overlay, and lightweight menu flow.',
    technologies: ['Python', 'AppleScript', 'macOS', 'JSON'],
    category: 'AI & Automation',
    featured: false,
    status: 'Live',
    githubUrl: 'https://github.com/EdwinjJ1/SafeEyes--mac',
    icon: 'eye',
    highlights: [
      'Native macOS integration via AppleScript',
      'Bilingual support (EN / CN)',
      'Customizable work/break intervals',
      'Multiple notification modes',
      'Zero external dependencies',
    ],
  },
  {
    id: 8,
    title: 'AI Equity Radar',
    description:
      'Interactive dashboard identifying global poverty hotspots to prioritize AI intervention strategies for underserved communities.',
    longDescription:
      'Built for UNSW AIP Hackathon, this data-driven platform analyzes 184 countries using World Bank data to identify inequality hotspots. Features composite risk scoring, interactive visualizations with Plotly.js, and recommends targeted AI interventions including offline education kiosks, agricultural advisors, and mobile health assistants for rural communities.',
    technologies: ['Python', 'Flask', 'Pandas', 'Plotly.js', 'Bootstrap 5'],
    category: 'Machine Learning',
    featured: false,
    status: 'Live',
    githubUrl: '#',
    icon: 'globe',
    highlights: [
      'Analyzed 184 countries with 44 indicators',
      'Composite risk scoring algorithm',
      'Interactive data visualization dashboard',
      '4 AI intervention strategies designed',
      'Targets 250K+ people in Year 1',
    ],
  },
  {
    id: 104,
    title: 'Chrono-Map: Sydney Layers',
    tagline: 'One map to understand the story behind every place.',
    description:
      'Interactive heritage map showcasing Sydney\'s historical sites, cultural landmarks, and film locations across time periods.',
    longDescription:
      'Chrono-Map is a production-grade place-discovery experience that combines a 3D Mapbox map, editorial storytelling, bilingual content, and then-and-now image comparisons. Sydney is the first content layer, but the data model is designed to scale into more cities, route planning, QR plaques, film-location tours, and cultural institution partnerships.',
    technologies: ['Next.js 16', 'React 19', 'Mapbox GL', 'Tailwind CSS', 'Framer Motion'],
    category: 'Web Development',
    featured: true,
    status: 'Live',
    liveUrl: 'https://chrono-map-eight.vercel.app/',
    githubUrl: 'https://github.com/EdwinjJ1/chrono-map',
    icon: 'map',
    heroImage: '/images/projects/chrono-map-preview.png',
    accent: '#d4af37',
    metrics: [
      { label: 'Places', value: '50+' },
      { label: 'Languages', value: '2' },
      { label: 'Map mode', value: '3D' },
    ],
    highlights: [
      '50+ Historical Sites & Landmarks',
      '"Then & Now" Photo Comparisons',
      'Film Location Tours',
      'Interactive Mapbox Integration',
      'QR Code & AR Experiences',
      'Curated Walking Routes',
    ],
  },
  {
    id: 10,
    title: 'Discord Bot',
    description:
      'A versatile Discord bot with custom commands, moderation tools, and interactive features for community engagement.',
    longDescription:
      'A feature-rich Discord bot designed to enhance server management and community interaction. Includes custom commands, automated moderation, welcome messages, role management, and fun interactive features. Built with discord.js and deployed with robust error handling and logging.',
    technologies: ['Node.js', 'discord.js', 'JavaScript'],
    category: 'AI & Automation',
    featured: false,
    status: 'Live',
    githubUrl: 'https://github.com/EdwinjJ1/discord-bot',
    icon: 'message',
    highlights: [
      'Custom command system',
      'Automated moderation tools',
      'Welcome and role management',
      'Interactive community features',
      'Robust error handling and logging',
    ],
  }
];

export const projectCategories: ProjectCategory[] = [
  'Education',
  'AI & Automation',
  'Web Development',
  'Machine Learning',
  'Entrepreneurship',
];
