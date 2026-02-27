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
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 101,
    title: 'EgoTrace',
    description:
      'AI-powered second brain and smart calendar for habit building, time management, and team collaboration.',
    longDescription:
      'A modern productivity suite that helps you build better habits, manage your schedule with AI, and understand yourself. Features include a smart calendar with AI import, habit tracking with gamification, team collaboration tools, and personality insights. Built with a modern tech stack including Next.js 15, Prisma, and Capacitor for mobile.',
    technologies: ['Next.js 15', 'React 19', 'Prisma', 'Tailwind CSS', 'Capacitor', 'AI Integration'],
    category: 'AI & Automation',
    featured: true,
    status: 'In Development',
    liveUrl: 'https://egotrace.vercel.app/',
    githubUrl: 'https://github.com/EdwinjJ1/calendar',
    icon: '🧠',
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
    featured: true,
    status: 'Live',
    liveUrl: 'https://www.promptenhenceraxon.top',
    githubUrl: 'https://github.com/EdwinjJ1/Axon',
    icon: '💠',
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
    description:
      'An open-source Claude Code skill that transforms basic prompts into expert-grade specifications and executes them.',
    longDescription:
      'Chiron Prompt Enhancer is a skill for Claude Code that upgrades underspecified requests into expert-grade specs and then executes the work. It features 7 optimization strategies (Concise, Detailed, Creative, etc.), smart auto-detection, and bilingual support.',
    technologies: ['Claude Code', 'Python', 'Prompt Engineering', 'Markdown'],
    category: 'AI & Automation',
    featured: true,
    status: 'Live',
    githubUrl: 'https://github.com/EdwinjJ1/chiron-prompt',
    icon: '🏹',
    highlights: [
      '7 Smart Optimization Strategies',
      'Auto-detection of Intent',
      'Bilingual Support (EN/CN)',
      'Agentic Execution Capability',
      'Local Prompt History Logging',
    ],
  },
  {
    id: 1,
    title: 'UNSW Study Materials Platform',
    description:
      'Interactive study notes and resources for UNSW Computer Science students with bilingual content and data visualisations.',
    longDescription:
      'A comprehensive educational platform tailored for UNSW Computer Science students. Features interactive code examples, bilingual content (English and Chinese), dynamic data visualisations powered by Chart.js and Plotly.js, and a responsive layout optimised for learning on any device. Earlier iterations also included a donations module powered by Stripe.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Chart.js', 'Plotly.js', 'Stripe'],
    category: 'Education',
    featured: true,
    status: 'Live',
    liveUrl: 'http://www.preuni.xyz/',
    icon: '📚',
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
    icon: '🤖',
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
    icon: '🧠',
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
    icon: '💼',
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
    icon: '👁️',
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
    featured: true,
    status: 'Live',
    githubUrl: '#',
    icon: '🌍',
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
    description:
      'Interactive heritage map showcasing Sydney\'s historical sites, cultural landmarks, and film locations across time periods.',
    longDescription:
      'Chrono-Map is a digital heritage platform that helps users explore Sydney\'s transformation over 100+ years. Features include an interactive map with 50+ historic sites, "then and now" photo comparisons, film location tours (including The Matrix), QR code scanning for augmented reality experiences, and curated walking routes. Built with modern geospatial technology to make Sydney\'s cultural history accessible to everyone.',
    technologies: ['Next.js 16', 'React 19', 'Mapbox GL', 'Tailwind CSS', 'Framer Motion'],
    category: 'Web Development',
    featured: true,
    status: 'Live',
    liveUrl: 'https://chrono-map-eight.vercel.app/',
    githubUrl: 'https://github.com/EdwinjJ1/chrono-map',
    icon: '🗺️',
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
    icon: '🤖',
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
