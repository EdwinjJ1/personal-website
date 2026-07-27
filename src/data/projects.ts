export type ProjectStatus = 'Live' | 'In Development' | 'Ongoing' | 'Archived';

export type ProjectCategory =
  | 'Education'
  | 'AI & Automation'
  | 'Web Development';

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
  linkLabel?: string;
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
    id: 109,
    title: 'Roundtable',
    tagline: 'Turn AI coding sessions into reusable, reviewable workflows.',
    description:
      'A visual workflow and governance layer that makes multi-agent coding sessions inspectable, repeatable, and reviewable.',
    longDescription:
      'Roundtable gives local AI coding work a visible operating layer: turn a goal into a dependency-aware plan, coordinate specialist agents, and retain the handoffs, artifacts, review state, safety checks, and repair loops behind each delivery. It is built for a trusted operator who wants the work itself to remain inspectable instead of disappearing into a chat transcript.',
    technologies: ['Next.js 15', 'TypeScript', 'tRPC', 'NextAuth', 'PostgreSQL', 'Vitest'],
    category: 'AI & Automation',
    featured: true,
    status: 'In Development',
    githubUrl: 'https://github.com/EdwinjJ1/roundtable',
    icon: 'network',
    logoImage: '/images/projects/roundtable-logo.png',
    heroImage: '/images/projects/roundtable-workbench.png',
    accent: 'rgb(var(--p-teal))',
    metrics: [
      { label: 'Agent roles', value: '6+' },
      { label: 'Run views', value: '1' },
      { label: 'Repair loop', value: 'Bounded' },
    ],
    highlights: [
      'Dependency-aware planning and scheduling',
      'Persistent agent handoffs and artifacts',
      'Live visual workbench for each mission',
      'Review gates and capped repair rounds',
      'Pluggable local AI runtimes',
    ],
  },
  {
    id: 107,
    title: 'Akeso',
    tagline: 'Plan around the energy you actually have.',
    description:
      'A personal energy coach that turns a short daily check-in into an explainable, energy-aware plan and practical food guidance.',
    longDescription:
      'Akeso helps people understand their daily energy and protect the work that matters most. A quick check-in informs an explainable energy map, a responsive day plan, and nutrition suggestions matched to the day and available ingredients. The public showcase is live; the companion mobile app is still in development.',
    technologies: ['Expo', 'React Native', 'TypeScript', 'Express', 'Supabase', 'Zod'],
    category: 'AI & Automation',
    featured: true,
    status: 'In Development',
    liveUrl: 'https://akeso-showcase.vercel.app',
    githubUrl: 'https://github.com/EdwinjJ1/akeso',
    linkLabel: 'View showcase',
    icon: 'brain',
    logoImage: '/images/projects/akeso-icon.png',
    heroImage: '/images/projects/akeso-app-cover.png',
    accent: 'rgb(var(--p-sage-bright))',
    metrics: [
      { label: 'Daily check-in', value: '20 sec' },
      { label: 'Plan horizon', value: 'Today' },
      { label: 'App status', value: 'Building' },
    ],
    highlights: [
      'Explainable daily energy map',
      'Energy-aware task planning',
      'Rolling check-ins that update the plan',
      'Food suggestions matched to daily needs',
      'Native app for iOS and Android in development',
    ],
  },
  {
    id: 108,
    title: 'LensDex (镜库)',
    tagline: 'A clearer way to choose camera gear.',
    description:
      'A bilingual camera and lens database with reliable specifications, price context, editorial rankings, and community reviews.',
    longDescription:
      'LensDex, also known as 镜库, is a structured research companion for photographers. It brings together real camera and lens specifications, separate new and used price ranges, transparent editorial lists, ratings, reviews, and side-by-side comparisons—so gear decisions are informed by useful context rather than an endless product search.',
    technologies: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Playwright'],
    category: 'Web Development',
    featured: true,
    status: 'In Development',
    githubUrl: 'https://github.com/EdwinjJ1/cameraweb',
    icon: 'camera',
    logoImage: '/images/projects/lensdex-logo.png',
    heroImage: '/images/projects/lensdex-cover.png',
    accent: 'rgb(var(--p-status-dev))',
    metrics: [
      { label: 'Languages', value: '2' },
      { label: 'Price views', value: 'New + used' },
      { label: 'Research', value: 'Open' },
    ],
    highlights: [
      'Camera and lens specification database',
      'New and used price reference ranges',
      'Transparent editorial ranking rules',
      'Ratings, reviews, and comparison paths',
      'Chinese and English discovery flows',
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
    accent: 'rgb(var(--p-sage-mist))',
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
    accent: 'rgb(var(--p-teal))',
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
    icon: 'chiron',
    heroImage: '/images/projects/chiron-repository.png',
    accent: 'rgb(var(--p-status-dev))',
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
  },
];

export const projectCategories: ProjectCategory[] = [
  'Education',
  'AI & Automation',
  'Web Development',
];
