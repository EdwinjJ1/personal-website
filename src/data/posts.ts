export interface PostSummary {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug?: string;
}

export const posts: PostSummary[] = [
  {
    title: 'Building AI-Powered Personal Assistants',
    excerpt: 'Exploring Claude MCP servers and how they can transform personal productivity workflows.',
    date: '2024-03-15',
    readTime: '5 min read',
    tags: ['AI', 'Productivity', 'Claude'],
    slug: '/blog/ai-assistants',
  },
  {
    title: 'From Startup to Student: My Entrepreneurial Journey',
    excerpt: 'Lessons learned from founding a startup at 18 and transitioning back into university life.',
    date: '2024-02-28',
    readTime: '8 min read',
    tags: ['Entrepreneurship', 'Personal'],
    slug: '/blog/startup-to-student',
  },
  {
    title: 'Next.js 15 and the Future of React Development',
    excerpt: 'A deep dive into the latest Next.js features and how they improve developer experience.',
    date: '2024-02-10',
    readTime: '6 min read',
    tags: ['React', 'Next.js', 'Web Dev'],
    slug: '/blog/nextjs-15',
  },
];
