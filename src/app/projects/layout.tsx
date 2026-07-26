import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    "Current products by Evan Lin — AI workflows, personal energy planning, camera research, education, and developer tools.",
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects · Evan Lin',
    description:
      'Current products — AI workflows, personal energy planning, camera research, education, and developer tools.',
    url: '/projects',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
