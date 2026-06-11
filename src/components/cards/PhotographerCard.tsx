'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import BaseCard from './BaseCard';
import ScatterText from '@/components/ScatterText';
import Folder from '@/components/Folder';
import PhotographerFlowingMenu from './PhotographerFlowingMenu';
import { getThumbnailUrl } from '@/lib/imageUtils';

/* eslint-disable @next/next/no-img-element */

// Crossfading two-pose sprite (both imgs render so the swap pose is preloaded)
function PoseSprite({
  idle,
  active,
  on,
  alt,
  className,
  style,
  activeStyle,
}: {
  idle: string;
  active: string;
  on: boolean;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
}) {
  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      <img
        src={idle}
        alt={alt}
        className="block w-full select-none transition-all duration-200"
        style={{ opacity: on ? 0 : 1 }}
      />
      <img
        src={active}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 block w-full select-none transition-all duration-200"
        style={{ opacity: on ? 1 : 0, ...activeStyle }}
      />
    </div>
  );
}

const menuItems = [
  {
    text: 'Street',
    images: [
      'P1032761.JPG', 'P1032763.JPG', 'P1034905.JPG',
      'P1035457.JPG', 'DSCF9161.JPG', 'DSCF9170.JPG',
      'DSCF9183.JPG', 'P1063344.JPG',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Portrait',
    // Trimmed to non-identifying shots while the portrait set is re-curated
    images: [
      'P1071596.JPG', 'P1140236.jpg',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Architecture',
    images: [
      'P1033380.JPG', 'P1033392.JPG', 'P1034944.JPG',
      'P1035469.JPG', 'P1035856.JPG', 'P1036367.JPG',
      'DSCF9162.JPG', 'DSCF9172.JPG',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Wildlife',
    images: [
      'P1035358.JPG', 'P1049329.JPG', 'P1049431.jpg',
      'P1052249-Enhanced-NR.jpg', 'P1052330.jpg', 'P1052475.jpg',
      'P1059821.jpg', 'P1139753.JPG',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Landscape',
    images: [
      'P1033646.JPG', 'P1034550.jpg', 'P1034572.JPG',
      'P1050229.JPG', 'P1071573.JPG',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Night',
    images: [
      'P1032794.JPG', 'P1034951.JPG',
      'P1049662.JPG', 'P1049663.JPG', 'P1140509.JPG',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Travel',
    images: [
      'P1033598.JPG', 'DSCF9146.JPG', 'P1037178.JPG',
      'P1048931.JPG', 'P1050029.JPG', 'P1071530.JPG',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
  {
    text: 'Nature',
    images: [
      'P1033357.JPG', 'P1035455.JPG', 'P1035875.JPG', 'DSC07507.jpg',
    ].map(f => getThumbnailUrl(`/images/photography/${f}`)),
    link: '/photography',
  },
];

// Three representative thumbnails for the folder papers
const folderPhotos = [
  getThumbnailUrl('/images/photography/P1032794.JPG'),
  getThumbnailUrl('/images/photography/P1033598.JPG'),
  getThumbnailUrl('/images/photography/DSCF9124.jpg'),
];

interface PhotographerCardProps {
  delay?: number;
}

export default function PhotographerCard({ delay = 0.72 }: PhotographerCardProps) {
  const router = useRouter();
  const [shooting, setShooting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click → the photographer drops low, the model presses the frame down,
  // the frame dips, the flash fires.
  const shoot = () => {
    if (shooting) return;
    setShooting(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShooting(false), 1600);
  };

  return (
    <BaseCard
      size="md"
      hover={true}
      delay={delay}
      className={`md:col-span-2 lg:col-span-4 ${shooting ? 'frame-press' : ''}`}
      glass={true}
    >
      <style>{`
        @keyframes frame-press {
          0% { transform: none; }
          28% { transform: translateY(6px) scaleY(0.978); }
          58% { transform: translateY(2px) scaleY(0.995); }
          100% { transform: none; }
        }
        .frame-press { animation: frame-press 1s cubic-bezier(.34,1.56,.64,1); transform-origin: 50% 100%; }
        @keyframes cam-flash {
          0% { opacity: 0; }
          14% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .frame-press { animation: none; }
        }
      `}</style>

      {/* Model draped over the top frame — click her to pose for a shot */}
      <button
        type="button"
        onClick={shoot}
        aria-label="Take a photo of the model on the frame"
        className="absolute left-1/2 z-20 w-[148px] -translate-x-1/2 cursor-pointer border-0 bg-transparent p-0"
        style={{ top: -62 }}
      >
        <PoseSprite
          idle="/images/sprites/girl-idle.png"
          active="/images/sprites/girl-press.png"
          on={shooting}
          alt="Model lying on the card frame"
          className="transition-transform duration-300"
          style={{
            transform: shooting ? 'translateY(9px) rotate(-1.5deg)' : 'none',
            transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)',
            filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))',
          }}
        />
      </button>

      {/* Photographer aiming up at her from inside the card */}
      <button
        type="button"
        onClick={shoot}
        aria-label="Take a photo"
        className="absolute bottom-9 left-1.5 z-20 w-[58px] cursor-pointer border-0 bg-transparent p-0"
      >
        <PoseSprite
          idle="/images/sprites/photographer-idle.png"
          active="/images/sprites/photographer-crouch.png"
          on={shooting}
          alt="Pixel Evan taking a photo"
          className="transition-transform duration-200"
          style={{
            transform: shooting ? 'translateY(4px)' : 'none',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
          }}
        />
      </button>

      {/* Camera flash */}
      {shooting && (
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-2xl"
          style={{
            background:
              'radial-gradient(circle at 18% 72%, rgba(255,252,240,0.95), rgba(255,252,240,0.55) 38%, transparent 72%)',
            animation: 'cam-flash 0.55s ease-out 0.32s both',
          }}
        />
      )}

      <div className="flex h-full flex-col gap-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
            <ScatterText scatterRadius={25} rotationRange={10} staggerDelay={0.015}>Photographer Notes</ScatterText>
          </h3>
          {/* Folder replaces "Side Project" badge — click a photo to go to /photography */}
          <Folder
            color="#7a9088"
            size={0.75}
            items={folderPhotos.map((src) => ({
              content: (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: '50% 50%',
                }} />
              ),
              onClick: () => router.push('/photography'),
            }))}
          />
        </div>

        {/* Flowing menu */}
        <PhotographerFlowingMenu items={menuItems} speed={14} />

        {/* Footer */}
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
            <Link href="/photography#gear" className="inline-flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: '#b8b4aa' }}>
              Gear List
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/photography" className="inline-flex items-center gap-1 transition-colors" style={{ color: '#b8b4aa' }}>
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
