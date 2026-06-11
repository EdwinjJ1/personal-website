'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
import ScatterText from '@/components/ScatterText';
import MusicPixelScene from './MusicPixelScene';
import { useState, useEffect } from 'react';

// Pixel-style equalizer — chunky stepped bars, "the band playing live"
function PixelEqualizer({ live }: { live: boolean }) {
  const bars = [0.45, 0.8, 0.6, 1, 0.5, 0.9, 0.7, 1, 0.55, 0.85, 0.65, 0.95];
  return (
    <div className="flex h-5 items-end justify-center gap-[3px]" aria-hidden="true">
      <style>{`
        @keyframes px-eq { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { .px-eq { animation: none !important; } }
      `}</style>
      {bars.map((peak, i) => (
        <span
          key={i}
          className="px-eq w-[5px] rounded-[1px] origin-bottom"
          style={{
            height: `${peak * 100}%`,
            backgroundColor: i % 3 === 0 ? '#7a9088' : 'rgba(122, 144, 136, 0.55)',
            animation: live
              ? `px-eq ${(0.9 + (i % 5) * 0.18).toFixed(2)}s steps(3, end) ${(i * 0.11).toFixed(2)}s infinite`
              : 'none',
            transform: live ? undefined : 'scaleY(0.25)',
          }}
        />
      ))}
    </div>
  );
}

// Line-art headphones draped over the card's top frame
function HangingHeadphones() {
  return (
    <svg
      width="58"
      height="64"
      viewBox="0 0 58 64"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute -top-[22px] right-6 z-10"
      style={{ transform: 'rotate(8deg)' }}
    >
      {/* band hooked over the frame */}
      <path
        d="M8 30 C8 10, 50 10, 50 30"
        stroke="#7a9088"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* left cup hanging inside the card */}
      <rect x="3" y="29" width="11" height="15" rx="4" fill="#3a342e" stroke="#7a9088" strokeWidth="2" />
      <rect x="5.5" y="32" width="6" height="9" rx="2.5" fill="#7a9088" opacity="0.85" />
      {/* right cup, slightly lower for a draped feel */}
      <rect x="44" y="33" width="11" height="15" rx="4" fill="#3a342e" stroke="#7a9088" strokeWidth="2" />
      <rect x="46.5" y="36" width="6" height="9" rx="2.5" fill="#7a9088" opacity="0.85" />
      {/* cable curling down */}
      <path
        d="M49 48 C46 56, 54 56, 51 63"
        stroke="rgba(122,144,136,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface Track {
  title: string;
  artist: string;
  album: string;
  cover: string | null;
  playCount?: number;
}

const FALLBACK_TRACK: Track = {
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera',
  cover: null,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export default function MusicCard() {
  const [track, setTrack] = useState<Track>(FALLBACK_TRACK);
  const [live, setLive] = useState(false);

  // Pull the most-played track of the week from NetEase Cloud Music (via worker proxy)
  useEffect(() => {
    if (!API_BASE) return;
    const controller = new AbortController();

    fetch(`${API_BASE}/now-playing`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.track?.title) {
          setTrack(data.track);
          setLive(true);
        }
      })
      .catch(() => { /* keep fallback */ });

    return () => controller.abort();
  }, []);

  return (
    <BaseCard size="md" delay={0.5} className="lg:col-span-4">
      <HangingHeadphones />
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#e0d8cc' }}>
              <ScatterText scatterRadius={20} rotationRange={8} staggerDelay={0.015}>On Repeat</ScatterText>
            </h3>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#7a9088' }}
              />
              <span className="text-xs" style={{ color: '#7a9088' }}>
                <ScatterText scatterRadius={15} rotationRange={6}>{live ? 'NetEase · this week' : 'Live'}</ScatterText>
              </span>
            </div>
          </div>
        </div>

        {/* Pixel me, coding on the sofa */}
        <div className="flex-1 min-h-0 mb-1.5">
          <MusicPixelScene />
        </div>

        {/* The band, playing live */}
        <div className="mb-2">
          <PixelEqualizer live={live} />
        </div>

        <div className="flex flex-col justify-end">
          <div className="rounded-xl p-3" style={{ backgroundColor: '#211e1c' }}>
            <div className="flex items-center gap-3">
              {track.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.cover}
                  alt={`${track.album} album cover`}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-lg object-cover"
                  style={{ border: '1px solid rgba(122, 144, 136, 0.25)' }}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #7a9088, #6a8a8e)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e0d8cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm truncate" style={{ color: '#e0d8cc' }}>
                  <ScatterText scatterRadius={15} rotationRange={6} staggerDelay={0.01}>{track.title}</ScatterText>
                </h4>
                <p className="text-xs truncate" style={{ color: '#b8b4aa' }}>
                  by {track.artist}
                </p>
                <p className="text-xs truncate" style={{ color: '#8a8680' }}>
                  {track.album}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs" style={{ color: '#8a8680' }}>
            {live && track.playCount ? (
              <>
                <span className="tabular-nums"><ScatterText scatterRadius={15} rotationRange={6}>{`${track.playCount} plays this week`}</ScatterText></span>
                <span style={{ color: '#7a9088' }}>♪</span>
              </>
            ) : (
              <span><ScatterText scatterRadius={15} rotationRange={6}>What I keep coming back to.</ScatterText></span>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
