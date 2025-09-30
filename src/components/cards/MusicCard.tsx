'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
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
            className="text-2xl"
          >
            🎵
          </motion.div>
          <div>
            <h3 className="text-white font-semibold text-sm">Now Playing</h3>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-green-400 text-xs">Live</span>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <div className="bg-gray-900/50 rounded-xl p-3 mb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                {currentTrack.albumArt}
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-white font-medium text-sm truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  by {currentTrack.artist}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {currentTrack.album}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1.5 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>2:45</span>
              <span>5:55</span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
