import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Friends',
  description:
    "A constellation of Evan Lin's friends and fellow travellers — friend links and connections across the web.",
  alternates: { canonical: '/friends' },
  openGraph: {
    title: 'Friends · Evan Lin',
    description:
      "A constellation of Evan Lin's friends and fellow travellers.",
    url: '/friends',
  },
};

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
