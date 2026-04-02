'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
import ScatterText from '@/components/ScatterText';
import { useState, useEffect } from 'react';

interface Track {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  isPlaying: boolean;
}

export default function MusicCard() {
  // Mock currently playing track
  const [currentTrack] = useState<Track>({
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    albumArt: "🎵", // Using emoji as placeholder
    isPlaying: true
  });

  const [progress, setProgress] = useState(0);

  // Simulate music progress
  useEffect(() => {
    if (currentTrack.isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev + 1) % 100);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTrack.isPlaying]);

  return (
    <BaseCard size="md" delay={0.5} className="lg:col-span-4">
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: currentTrack.isPlaying ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#e0d8cc' }}>
              <ScatterText scatterRadius={20} rotationRange={8} staggerDelay={0.015}>Now Playing</ScatterText>
            </h3>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#7a9088' }}
              />
              <span className="text-xs" style={{ color: '#7a9088' }}>Live</span>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <div className="rounded-xl p-3 mb-2.5" style={{ backgroundColor: '#211e1c' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #7a9088, #6a8a8e)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e0d8cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm truncate" style={{ color: '#e0d8cc' }}>
                  <ScatterText scatterRadius={15} rotationRange={6} staggerDelay={0.01}>{currentTrack.title}</ScatterText>
                </h4>
                <p className="text-xs truncate" style={{ color: '#b8b4aa' }}>
                  by {currentTrack.artist}
                </p>
                <p className="text-xs truncate" style={{ color: '#8a8680' }}>
                  {currentTrack.album}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#312e2a' }}>
              <motion.div
                className="h-1.5 rounded-full"
                style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: '#8a8680' }}>
              <span>2:45</span>
              <span>5:55</span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
