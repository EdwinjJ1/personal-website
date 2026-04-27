import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI News',
  description:
    'Daily AI and technology news curated by Evan Lin — from research breakthroughs to industry moves.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'AI News · Evan Lin',
    description:
      'Daily AI and technology news from research breakthroughs to industry moves.',
    url: '/news',
    type: 'website',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
