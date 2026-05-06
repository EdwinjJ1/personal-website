'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BaseCard from './BaseCard';
import ScatterText from '@/components/ScatterText';
import Folder from '@/components/Folder';
import PhotographerFlowingMenu from './PhotographerFlowingMenu';
import { getThumbnailUrl } from '@/lib/imageUtils';

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
    images: [
      'P1033994.JPG', 'P1034288.JPG', 'P1034416.JPG',
      'P1034242_(2).jpg', 'P1071517.JPG', 'P1071518.JPG',
      'P1071562.JPG', 'P1141379.JPG',
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

  return (
    <BaseCard size="md" hover={true} delay={delay} className="md:col-span-2 lg:col-span-4 overflow-hidden" glass={true}>
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
