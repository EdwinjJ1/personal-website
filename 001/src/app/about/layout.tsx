import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Evan Lin — Computer Science student at UNSW Sydney, former startup founder. Background, skills, and journey.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About · Evan Lin',
    description:
      'About Evan Lin — Computer Science student at UNSW Sydney, former startup founder.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
