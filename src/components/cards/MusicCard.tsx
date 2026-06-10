'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
import ScatterText from '@/components/ScatterText';
import { useState, useEffect } from 'react';

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
                {live ? 'NetEase · this week' : 'Live'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 flex-col justify-center">
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
                <span className="tabular-nums">{track.playCount} plays this week</span>
                <span className="inline-flex items-end gap-[2px]" aria-hidden="true">
                  {[0.5, 0.9, 0.65, 1, 0.75].map((peak, i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full"
                      style={{ backgroundColor: '#7a9088', height: 12 }}
                      animate={{ scaleY: [0.3, peak, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.1 + i * 0.13, ease: 'easeInOut' }}
                    />
                  ))}
                </span>
              </>
            ) : (
              <span>What I keep coming back to.</span>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
