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
    featured: true,
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
    githubUrl: 'https://github.com/EdwinJia1/SafeEyes-mac-',
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
    id: 6,
    title: 'Startup MVP Platform',
    description:
      'The MVP from my startup journey featuring real-time collaboration, analytics, and a scalable stack.',
    longDescription:
      'The production MVP that supported 1,000+ active users during my startup experience. Includes user authentication, real-time messaging powered by Socket.io, an analytics dashboard, and a microservices architecture deployed on AWS with Docker.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'AWS', 'Docker'],
    category: 'Entrepreneurship',
    featured: false,
    status: 'Archived',
    githubUrl: '#',
    icon: '🚀',
    highlights: [
      'Scaled to 1,000+ active users',
      'Real-time messaging engine',
      'Analytics and reporting dashboards',
      'Microservices-based architecture',
      'AWS + Docker deployment pipeline',
    ],
  },
  {
    id: 7,
    title: 'Bank Statement Automation',
    description:
      'Automated personal finance management system that reads bank statements, categorizes expenses, and provides real-time spending analytics.',
    longDescription:
      'A comprehensive financial automation tool that monitors email notifications, parses bank statements, and intelligently categorizes transactions. Features include real-time expense tracking, budget alerts, smart categorization with machine learning, and encrypted local storage for privacy. Integrates with multiple banks and supports multi-currency transactions.',
    technologies: ['Node.js', 'SQLite', 'crypto-js', 'node-cron', 'Chart.js'],
    category: 'AI & Automation',
    featured: false,
    status: 'In Development',
    githubUrl: '#',
    icon: '💰',
    highlights: [
      'Automated email parsing and OCR recognition',
      'Smart expense categorization with ML',
      'Real-time budget tracking and alerts',
      'End-to-end encryption for security',
      'Multi-bank and multi-currency support',
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
    id: 9,
    title: 'AI Gaming Platform',
    description:
      'Gamified learning platform leveraging AI to create interactive educational experiences and adaptive quizzes.',
    longDescription:
      'An innovative educational gaming platform that combines AI-powered content generation with interactive learning mechanics. Features adaptive difficulty, real-time feedback, and personalized learning paths to make education engaging and effective.',
    technologies: ['React', 'Node.js', 'OpenAI API', 'PostgreSQL', 'WebSocket'],
    category: 'AI & Automation',
    featured: false,
    status: 'In Development',
    githubUrl: '#',
    icon: '🎮',
    highlights: [
      'AI-generated educational content',
      'Adaptive difficulty system',
      'Real-time multiplayer quizzes',
      'Personalized learning analytics',
      'Gamification and reward systems',
    ],
  },
];

export const projectCategories: ProjectCategory[] = [
  'Education',
  'AI & Automation',
  'Web Development',
  'Machine Learning',
  'Entrepreneurship',
];
