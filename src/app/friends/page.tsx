'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import ScatterText from '@/components/ScatterText';
import { friends, type Friend } from '@/data/friends';

const RING_CAPACITY = [6, 10, 14];
const RING_RADIUS_DESKTOP = [180, 300, 420];
const RING_RADIUS_MOBILE = [120, 200, 280];
const RING_DURATION = [40, 60, 80];

interface PlacedFriend extends Friend {
  ring: number;
  angle: number;
}

function distributeFriends(list: Friend[]): PlacedFriend[][] {
  const rings: PlacedFriend[][] = [[], [], []];
  let cursor = 0;
  for (const friend of list) {
    let ring = cursor;
    while (ring < rings.length - 1 && rings[ring].length >= RING_CAPACITY[ring]) {
      ring++;
    }
    rings[ring].push({ ...friend, ring, angle: 0 });
    cursor = ring;
  }
  return rings.map((ringFriends) => {
    const count = ringFriends.length;
    if (count === 0) return ringFriends;
    const step = 360 / count;
    return ringFriends.map((f, idx) => ({ ...f, angle: idx * step }));
  });
}

function FriendNode({
  friend,
  radiusDesktop,
  radiusMobile,
  duration,
  onHover,
  onLeave,
}: {
  friend: PlacedFriend;
  radiusDesktop: number;
  radiusMobile: number;
  duration: number;
  onHover: (f: PlacedFriend, x: number, y: number) => void;
  onLeave: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const radius = isMobile ? radiusMobile : radiusDesktop;

  return (
    <div
      className="orbit-track"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        animation: `orbit-spin-${friend.ring} ${duration}s linear infinite`,
        transformOrigin: '0 0',
        ['--start-angle' as string]: `${friend.angle}deg`,
      }}
    >
      <a
        href={friend.link}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => {
          const rect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
          onHover(friend, rect.left + rect.width / 2, rect.top);
        }}
        onMouseLeave={onLeave}
        className="orbit-node"
        style={{
          position: 'absolute',
          left: radius,
          top: 0,
          width: 56,
          height: 56,
          marginLeft: -28,
          marginTop: -28,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(122, 144, 136, 0.6)',
          boxShadow: '0 0 20px rgba(122, 144, 136, 0.4), inset 0 0 10px rgba(0,0,0,0.3)',
          background: '#1a1816',
          cursor: 'pointer',
          animation: `orbit-counter-${friend.ring} ${duration}s linear infinite`,
          transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
          display: 'block',
        }}
      >
        <img
          src={friend.avatar}
          alt={friend.name}
          width={56}
          height={56}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </a>
    </div>
  );
}

export default function FriendsPage() {
  const rings = useMemo(() => distributeFriends(friends), []);
  const [hovered, setHovered] = useState<{ friend: PlacedFriend; x: number; y: number } | null>(null);

  const handleHover = (friend: PlacedFriend, x: number, y: number) => {
    setHovered({ friend, x, y });
  };

  const handleLeave = () => setHovered(null);

  return (
    <PageTransition>
      <style jsx global>{`
        @keyframes orbit-spin-0 {
          from { transform: rotate(var(--start-angle, 0deg)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)); }
        }
        @keyframes orbit-spin-1 {
          from { transform: rotate(calc(var(--start-angle, 0deg) * -1)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) * -1 - 360deg)); }
        }
        @keyframes orbit-spin-2 {
          from { transform: rotate(var(--start-angle, 0deg)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)); }
        }
        @keyframes orbit-counter-0 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes orbit-counter-1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-counter-2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }

        .orbit-stage:hover .orbit-track,
        .orbit-stage:hover .orbit-node {
          animation-play-state: paused !important;
        }

        .orbit-node:hover {
          transform: scale(1.25);
          border-color: #e0d8cc !important;
          box-shadow: 0 0 30px rgba(224, 216, 204, 0.7), 0 0 60px rgba(122, 144, 136, 0.5) !important;
          z-index: 5;
        }

        .orbit-ring-line {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px dashed rgba(122, 144, 136, 0.18);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        @keyframes center-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(122, 144, 136, 0.5), 0 0 60px rgba(122, 144, 136, 0.25); }
          50%      { box-shadow: 0 0 50px rgba(122, 144, 136, 0.8), 0 0 90px rgba(122, 144, 136, 0.4); }
        }
      `}</style>

      <div className="min-h-screen pt-20" style={{ color: '#e0d8cc' }}>
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-5xl font-bold mb-4">
              <ScatterText as="span" scatterRadius={60} rotationRange={15} color="transparent">
                <GradientText
                  colors={['#7a9088', '#6a8a8e', '#7a9088', '#6a8a8e', '#7a9088']}
                  animationSpeed={6}
                  showBorder={false}
                >
                  Friends
                </GradientText>
              </ScatterText>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#b8b4aa' }}>
              A constellation of friends and fellow travellers. Hover to learn more, click to visit.
            </p>
          </motion.div>

          {/* Orbit stage */}
          <div
            className="orbit-stage relative mx-auto"
            style={{
              width: '100%',
              maxWidth: 960,
              height: 'min(80vh, 720px)',
              minHeight: 520,
              position: 'relative',
            }}
          >
            {/* Ring guide lines */}
            {rings.map((ringFriends, idx) =>
              ringFriends.length > 0 ? (
                <React.Fragment key={`ring-${idx}`}>
                  <div
                    className="orbit-ring-line hidden md:block"
                    style={{
                      width: RING_RADIUS_DESKTOP[idx] * 2,
                      height: RING_RADIUS_DESKTOP[idx] * 2,
                    }}
                  />
                  <div
                    className="orbit-ring-line md:hidden"
                    style={{
                      width: RING_RADIUS_MOBILE[idx] * 2,
                      height: RING_RADIUS_MOBILE[idx] * 2,
                    }}
                  />
                </React.Fragment>
              ) : null
            )}

            {/* Center node — Evan */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 4,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #7a9088',
                  background: '#1a1816',
                  animation: 'center-pulse 3s ease-in-out infinite',
                  margin: '0 auto',
                }}
              >
                <Image
                  src="/profile.jpg"
                  alt="Evan Lin"
                  width={96}
                  height={96}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  priority
                />
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: '#e0d8cc',
                  textTransform: 'uppercase',
                }}
              >
                Evan Lin
              </div>
            </div>

            {/* Friend nodes on orbits */}
            {rings.map((ringFriends, ringIdx) =>
              ringFriends.map((friend) => (
                <FriendNode
                  key={`${ringIdx}-${friend.link}`}
                  friend={friend}
                  radiusDesktop={RING_RADIUS_DESKTOP[ringIdx]}
                  radiusMobile={RING_RADIUS_MOBILE[ringIdx]}
                  duration={RING_DURATION[ringIdx]}
                  onHover={handleHover}
                  onLeave={handleLeave}
                />
              ))
            )}

            {/* Hover card (fixed-position tooltip following the node) */}
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'fixed',
                  left: hovered.x,
                  top: hovered.y - 16,
                  transform: 'translate(-50%, -100%)',
                  zIndex: 50,
                  pointerEvents: 'none',
                  minWidth: 240,
                  maxWidth: 320,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: 'linear-gradient(to bottom right, rgba(40, 38, 34, 0.98), rgba(33, 30, 28, 0.98))',
                  border: '1px solid rgba(122, 144, 136, 0.5)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(122, 144, 136, 0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '1px solid rgba(122, 144, 136, 0.6)',
                      flexShrink: 0,
                      background: '#1a1816',
                    }}
                  >
                    <img
                      src={hovered.friend.avatar}
                      alt=""
                      width={36}
                      height={36}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#e0d8cc', lineHeight: 1.3 }}>
                      {hovered.friend.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#7a9088', marginTop: 2, wordBreak: 'break-all' }}>
                      {hovered.friend.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#b8b4aa', lineHeight: 1.5 }}>
                  {hovered.friend.desc}
                </div>
              </motion.div>
            )}
          </div>

          {/* Add friend hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mt-4"
            style={{ color: '#726e66', fontSize: 13 }}
          >
            Want to exchange links? Reach out via the{' '}
            <a href="/about" style={{ color: '#7a9088', textDecoration: 'underline' }}>
              About
            </a>{' '}
            page.
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
