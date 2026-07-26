'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
import MusicChat from './MusicChat';
import { useState, useEffect, useRef, useCallback } from 'react';

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

// Headphones hanging over the card's top frame
/** Hangs off the card's top-left; the chat bubble owns the top-right. */
function HangingHeadphones() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/sprites/headphones.png"
      alt=""
      aria-hidden="true"
      width={62}
      height={65}
      className="pointer-events-none absolute -top-7 left-6 z-10 w-[62px] select-none"
      style={{ transform: 'rotate(10deg)', filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.45))' }}
    />
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

type WebkitAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function PlayIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />
    </svg>
  );
}

export default function MusicCard() {
  const [track, setTrack] = useState<Track>(FALLBACK_TRACK);
  const [live, setLive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<{
    context: AudioContext | null;
    master: GainNode | null;
    interval: number | null;
    step: number;
  }>({ context: null, master: null, interval: null, step: 0 });

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

  const stopRadioLoop = useCallback(() => {
    const audio = audioRef.current;
    if (audio.interval !== null) {
      window.clearInterval(audio.interval);
      audio.interval = null;
    }

    if (audio.master && audio.context) {
      const now = audio.context.currentTime;
      audio.master.gain.cancelScheduledValues(now);
      audio.master.gain.setTargetAtTime(0.0001, now, 0.05);
    }
  }, []);

  const playTone = useCallback((frequency: number, start: number, duration: number, gain: number) => {
    const audio = audioRef.current;
    if (!audio.context || !audio.master) return;

    const oscillator = audio.context.createOscillator();
    const envelope = audio.context.createGain();
    const filter = audio.context.createBiquadFilter();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, start);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(980, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(audio.master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }, []);

  const scheduleRadioStep = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.context || !audio.master) return;

    const now = audio.context.currentTime;
    const melody = [196, 246.94, 293.66, 329.63, 293.66, 246.94, 220, 196];
    const step = audio.step % melody.length;

    playTone(melody[step], now, 0.16, 0.035);
    if (step % 2 === 0) playTone(98, now + 0.02, 0.22, 0.025);
    if (step % 4 === 2) playTone(392, now + 0.08, 0.12, 0.018);

    audio.step += 1;
  }, [playTone]);

  const startRadioLoop = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio.context) {
      const AudioContextCtor = window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
      if (!AudioContextCtor) {
        setIsPlaying(true);
        return;
      }

      audio.context = new AudioContextCtor();
      audio.master = audio.context.createGain();
      audio.master.gain.value = 0.0001;
      audio.master.connect(audio.context.destination);
    }

    try {
      await audio.context.resume();
      if (audio.master) {
        const now = audio.context.currentTime;
        audio.master.gain.cancelScheduledValues(now);
        audio.master.gain.setTargetAtTime(0.42, now, 0.08);
      }

      scheduleRadioStep();
      audio.interval = window.setInterval(scheduleRadioStep, 360);
    } finally {
      setIsPlaying(true);
    }
  }, [scheduleRadioStep]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopRadioLoop();
      setIsPlaying(false);
      return;
    }

    void startRadioLoop();
  }, [isPlaying, startRadioLoop, stopRadioLoop]);

  useEffect(() => {
    return () => {
      stopRadioLoop();
      void audioRef.current.context?.close();
    };
  }, [stopRadioLoop]);

  return (
    <BaseCard size="md" delay={0.5} className="lg:col-span-4">
      <HangingHeadphones />
      <div className="h-full flex flex-col">
        <style>{`
          @keyframes radio-spin { to { transform: rotate(360deg); } }
          @keyframes radio-glow { 0%, 100% { opacity: 0.28; transform: scale(0.95); } 50% { opacity: 0.68; transform: scale(1.04); } }
          @keyframes radio-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          @media (prefers-reduced-motion: reduce) {
            .radio-spin, .radio-glow, .radio-scan { animation: none !important; }
          }
        `}</style>
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#e0d8cc' }}>
              On Repeat
            </h3>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#7a9088' }}
              />
              <span className="text-xs" style={{ color: '#7a9088' }}>
                {isPlaying ? 'Playing · soft loop' : live ? 'NetEase · this week' : 'Tap to play'}
              </span>
            </div>
          </div>
        </div>

        {/* Me, coding on the sofa — poke me or open the chat bubble */}
        <div className="relative flex-1 min-h-0 mb-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/music-scene.webp"
            alt="Illustration of Evan coding on a sofa with headphones on"
            className={`h-full w-full select-none rounded-xl object-cover object-center transition duration-500 ${isPlaying ? 'brightness-110 saturate-[1.08]' : ''}`}
          />
          {isPlaying && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
              <div
                className="radio-scan absolute inset-y-0 w-1/2"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(224, 216, 204, 0.08), transparent)', animation: 'radio-scan 2.4s linear infinite' }}
              />
            </div>
          )}
          {/* vignette so the artwork melts into the card background */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ boxShadow: 'inset 0 0 26px 14px #282622' }}
          />
          {/* Playback is triggered from the track row below — a second
              button here just crowded the artwork's other three circles. */}
          <MusicChat />
        </div>

        {/* The band, playing live */}
        <div className="mb-2">
          <PixelEqualizer live={isPlaying || live} />
        </div>

        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            aria-pressed={isPlaying}
            className="group w-full rounded-xl p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[#7a9088]/60"
            style={{ backgroundColor: '#211e1c', boxShadow: isPlaying ? '0 0 0 1px rgba(122, 144, 136, 0.35)' : undefined }}
          >
            <div className="flex items-center gap-3">
              {track.cover ? (
                <div className="relative h-12 w-12 shrink-0">
                  <div
                    className={isPlaying ? 'radio-spin h-12 w-12 overflow-hidden rounded-full' : 'h-12 w-12 overflow-hidden rounded-lg transition group-hover:rounded-xl'}
                    style={{ animation: isPlaying ? 'radio-spin 5.5s linear infinite' : undefined }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.cover}
                      alt={`${track.album} album cover`}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 object-cover"
                      style={{ border: '1px solid rgba(122, 144, 136, 0.25)' }}
                    />
                  </div>
                  {isPlaying && <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: '#211e1c', border: '1px solid rgba(224, 216, 204, 0.55)' }} />}
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-lg flex shrink-0 items-center justify-center ${isPlaying ? 'radio-spin' : ''}`}
                  style={{
                    background: 'linear-gradient(to bottom right, #7a9088, #6a8a8e)',
                    animation: isPlaying ? 'radio-spin 5.5s linear infinite' : undefined,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e0d8cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm truncate" style={{ color: '#e0d8cc' }}>
                  {track.title}
                </h4>
                <p className="text-xs truncate" style={{ color: '#b8b4aa' }}>
                  by {track.artist}
                </p>
                <p className="text-xs truncate" style={{ color: '#8a8680' }}>
                  {track.album}
                </p>
              </div>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition group-hover:scale-105"
                style={{ color: '#e0d8cc', backgroundColor: isPlaying ? '#7a9088' : 'rgba(122, 144, 136, 0.18)' }}
              >
                <PlayIcon playing={isPlaying} />
              </span>
            </div>
          </button>

          <div className="mt-2.5 flex items-center justify-between text-xs" style={{ color: '#8a8680' }}>
            {live && track.playCount ? (
              <>
                <span className="tabular-nums">{`${track.playCount} plays this week`}</span>
                <span style={{ color: '#7a9088' }}>♪</span>
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
