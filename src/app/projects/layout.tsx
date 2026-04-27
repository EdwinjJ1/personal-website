import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    "Selected projects by Evan Lin — AI experiments, side projects, and tools built during CS studies and beyond.",
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects · Evan Lin',
    description:
      'Selected projects — AI experiments, side projects, and tools.',
    url: '/projects',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
