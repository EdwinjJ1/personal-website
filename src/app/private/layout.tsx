import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private',
  description: 'Private local workspace.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
