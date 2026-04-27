import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Blog by Evan Lin — notes and essays on AI, machine learning, software engineering, and CS coursework at UNSW.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog · Evan Lin',
    description:
      'Notes and essays on AI, machine learning, software engineering, and CS coursework.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
