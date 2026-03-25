'use client';

import Image from 'next/image';
import Link from 'next/link';
import BaseCard from './BaseCard';
import { getAssetPath } from '@/lib/utils';

const highlight = {
  title: 'Golden Hour at the Harbour',
  location: 'Sydney Harbour Bridge',
  mood: 'Long exposure • cinematic tones',
};

const miniSets = [
  {
    title: 'Street Stories',
    subtitle: 'Candid city moments',
    palette: 'from-teal-500/30 via-cyan-500/30 to-teal-400/30',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="9" width="13" height="13"/><path d="M5 9V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M16 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      </svg>
    ),
  },
  {
    title: 'Portrait Sessions',
    subtitle: 'Natural light portraits',
    palette: 'from-teal-600/30 via-teal-500/30 to-cyan-500/30',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

interface PhotographerCardProps {
  delay?: number;
}

export default function PhotographerCard({ delay = 0.72 }: PhotographerCardProps) {
  return (
    <BaseCard size="md" hover={true} delay={delay} className="md:col-span-2 lg:col-span-4 overflow-hidden" glass={true}>
      <div className="flex h-full flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
              Photographer Notes
            </h3>
            <p className="text-sm mt-0.5" style={{ color: '#b8b4aa' }}>
              Favourite frames from recent shoots when I trade the keyboard for a camera.
            </p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}>
            Side Project
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="relative col-span-2 min-h-[90px] overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(114, 110, 102, 0.3)' }}>
            <Image
              src={getAssetPath('profile.jpg')}
              alt="Long exposure photograph at Sydney Harbour Bridge"
              fill
              className="object-cover brightness-[0.9]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 space-y-1">
              <p className="text-sm font-semibold flex.items-center gap-2" style={{ color: '#e0d8cc' }}>
                <span style={{ color: '#7a9088' }}>{highlight.location}</span>
                · {highlight.title}
              </p>
              <p className="text-xs" style={{ color: '#b8b4aa' }}>{highlight.mood}</p>
            </div>
          </div>

          {miniSets.map((set) => (
            <div
              key={set.title}
              className={`rounded-2xl border p-3 transition-all`}
              style={{
                borderColor: 'rgba(114, 110, 102, 0.3)',
                background: 'linear-gradient(to bottom right, rgba(122, 144, 136, 0.2), rgba(106, 138, 142, 0.2))'
              }}
            >
              <div className="mb-0.5">{set.icon}</div>
              <p className="mt-2 text-sm font-semibold" style={{ color: '#e0d8cc' }}>{set.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#b8b4aa' }}>{set.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <a
            href="mailto:jiaedwin0605@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}
          >
            Book a shoot
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <div className="flex items-center gap-4">
            <Link
              href="/photography#gear"
              className="inline-flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: '#b8b4aa' }}
            >
              Gear List
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/photography"
              className="inline-flex items-center gap-1 transition-colors"
              style={{ color: '#b8b4aa' }}
            >
              View Portfolio
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
