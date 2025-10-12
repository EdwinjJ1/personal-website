'use client';

import Image from 'next/image';
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
    icon: '🌆',
  },
  {
    title: 'Portrait Sessions',
    subtitle: 'Natural light portraits',
    palette: 'from-teal-600/30 via-teal-500/30 to-cyan-500/30',
    icon: '📸',
  },
];

interface PhotographerCardProps {
  delay?: number;
}

export default function PhotographerCard({ delay = 0.72 }: PhotographerCardProps) {
  return (
    <BaseCard size="md" hover={false} delay={delay} className="md:col-span-2 lg:col-span-4 overflow-hidden">
      <div className="flex h-full flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#c8c0b4' }}>
              <span className="text-2xl" style={{ color: '#7a9088' }}>📷</span>
              Photographer Notes
            </h3>
            <p className="text-sm mt-0.5" style={{ color: '#9a968e' }}>
              Favourite frames from recent shoots when I trade the keyboard for a camera.
            </p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#9a968e' }}>
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
              <p className="text-sm font-semibold flex.items-center gap-2" style={{ color: '#c8c0b4' }}>
                <span style={{ color: '#7a9088' }}>{highlight.location}</span>
                · {highlight.title}
              </p>
              <p className="text-xs" style={{ color: '#9a968e' }}>{highlight.mood}</p>
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
              <p className="text-lg">{set.icon}</p>
              <p className="mt-2 text-sm font-semibold" style={{ color: '#c8c0b4' }}>{set.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#9a968e' }}>{set.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <a
            href="mailto:jiaedwin0605@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#c8c0b4' }}
          >
            Book a shoot
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/photography"
            className="inline-flex items-center gap-1 transition-colors"
            style={{ color: '#9a968e' }}
          >
            View Portfolio
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </BaseCard>
  );
}
