import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photography',
  description:
    "Photography by Evan Lin — moments captured from Sydney and travels.",
  alternates: { canonical: '/photography' },
  openGraph: {
    title: 'Photography · Evan Lin',
    description:
      'Moments captured from Sydney and travels.',
    url: '/photography',
  },
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
