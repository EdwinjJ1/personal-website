'use client';

import Image from 'next/image';
import BaseCard from './BaseCard';

const highlight = {
  title: 'Golden Hour at the Harbour',
  location: 'Sydney Harbour Bridge',
  mood: 'Long exposure • cinematic tones',
};

const miniSets = [
  {
    title: 'Street Stories',
    subtitle: 'Candid city moments',
    palette: 'from-purple-500/30 via-indigo-500/30 to-teal-500/30',
    icon: '🌆',
  },
  {
    title: 'Portrait Sessions',
    subtitle: 'Natural light portraits',
    palette: 'from-rose-500/30 via-orange-400/30 to-amber-400/30',
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
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl text-teal-300">📷</span>
              Photographer Notes
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Favourite frames from recent shoots when I trade the keyboard for a camera.
            </p>
          </div>
          <span className="rounded-full border border-gray-700/70 px-3 py-1 text-xs text-gray-300">
            Side Project
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="relative col-span-2 min-h-[90px] overflow-hidden rounded-2xl border border-gray-700/60">
            <Image
              src="/profile.jpg"
              alt="Long exposure photograph at Sydney Harbour Bridge"
              fill
              className="object-cover brightness-[0.9]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 space-y-1">
              <p className="text-sm font-semibold text-white flex.items-center gap-2">
                <span className="text-teal-300">{highlight.location}</span>
                · {highlight.title}
              </p>
              <p className="text-xs text-gray-300">{highlight.mood}</p>
            </div>
          </div>

          {miniSets.map((set) => (
            <div
              key={set.title}
              className={`rounded-2xl border border-gray-700/60 bg-gradient-to-br ${set.palette} p-3 transition-all hover:border-teal-400/50`}
            >
              <p className="text-lg">{set.icon}</p>
              <p className="mt-2 text-sm font-semibold text-white">{set.title}</p>
              <p className="text-xs text-gray-100/80 leading-relaxed">{set.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <a
            href="mailto:jiaedwin0605@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-3 py-1.5 font-semibold text-white transition-transform hover:scale-105"
          >
            Book a shoot
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/photography"
            className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
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
