'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';

export interface FlowingMenuItem {
  text: string;
  images: string[];
  link: string;
}

interface MenuItemProps {
  text: string;
  images: string[];
  link: string;
  speed: number;
}

function distMetric(x: number, y: number, x2: number, y2: number) {
  const dx = x - x2; const dy = y - y2;
  return dx * dx + dy * dy;
}

function findClosestEdge(mx: number, my: number, w: number, h: number): 'top' | 'bottom' {
  return distMetric(mx, my, w / 2, 0) < distMetric(mx, my, w / 2, h) ? 'top' : 'bottom';
}

function MenuItem({ text, images, link, speed }: MenuItemProps) {
  const itemRef        = useRef<HTMLDivElement>(null);
  const marqueeRef     = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animRef        = useRef<gsap.core.Tween | null>(null);
  // Only load images after first hover — avoids loading large files upfront
  const [loaded, setLoaded] = useState(false);

  const ease = { duration: 0.55, ease: 'expo' };

  useEffect(() => {
    if (!loaded) return;
    const setup = () => {
      if (!marqueeInnerRef.current) return;
      const set = marqueeInnerRef.current.querySelector<HTMLElement>('.fpm__set');
      if (!set) return;
      const w = set.offsetWidth;
      if (!w) return;
      animRef.current?.kill();
      animRef.current = gsap.to(marqueeInnerRef.current, {
        x: -w, duration: speed, ease: 'none', repeat: -1,
      });
    };
    const t = setTimeout(setup, 80);
    return () => { clearTimeout(t); animRef.current?.kill(); };
  }, [loaded, speed]);

  const handleMouseEnter = useCallback((ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    setLoaded(true); // trigger image load on first hover
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap.timeline({ defaults: ease })
      .set(marqueeRef.current,      { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%'  : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  }, []);

  const handleMouseLeave = useCallback((ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap.timeline({ defaults: ease })
      .to(marqueeRef.current,      { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%'  : '-101%' }, 0);
  }, []);

  // Two identical sets for seamless GSAP loop
  const PhotoSet = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div
      className="fpm__set"
      aria-hidden={ariaHidden}
      style={{ display: 'flex', alignItems: 'stretch', height: '100%', flexShrink: 0 }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          style={{
            flexShrink: 0,
            width: 200,
            margin: '8px 6px',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(122, 144, 136, 0.25)',
          }}
        >
          {loaded && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              width={200}
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%', display: 'block' }}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={itemRef} style={{ position: 'relative', flex: 1, overflow: 'hidden', borderTop: '1px solid rgba(114, 110, 102, 0.25)' }}>
      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100%', position: 'relative', cursor: 'pointer',
          textDecoration: 'none', whiteSpace: 'nowrap', zIndex: 1, gap: '0.5em',
        }}
      >
        <span style={{ flex: 1, height: 1, background: 'rgba(224,216,204,0.15)', display: 'block', maxWidth: 40 }} />
        <span style={{
          fontStyle: 'italic', fontWeight: 300, fontSize: '2.4vh',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#c8c2b8', fontFamily: 'Georgia, "Times New Roman", serif',
        }}>
          {text}
        </span>
        <span style={{ flex: 1, height: 1, background: 'rgba(224,216,204,0.15)', display: 'block', maxWidth: 40 }} />
      </a>

      <div
        ref={marqueeRef}
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          pointerEvents: 'none', transform: 'translateY(101%)',
          backgroundColor: 'rgba(10, 12, 15, 0.92)', backdropFilter: 'blur(2px)',
        }}
      >
        <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
          <div
            ref={marqueeInnerRef}
            aria-hidden="true"
            style={{ display: 'flex', alignItems: 'stretch', height: '100%', width: 'fit-content', willChange: 'transform' }}
          >
            <PhotoSet />
            <PhotoSet ariaHidden />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PhotographerFlowingMenuProps {
  items: FlowingMenuItem[];
  speed?: number;
}

export default function PhotographerFlowingMenu({ items, speed = 14 }: PhotographerFlowingMenuProps) {
  return (
    <div style={{
      width: '100%', flex: 1, minHeight: 0,
      display: 'flex', flexDirection: 'column',
      borderRadius: '1rem', overflow: 'hidden',
      border: '1px solid rgba(114, 110, 102, 0.25)',
    }}>
      {items.map((item, i) => (
        <MenuItem key={i} {...item} speed={speed} />
      ))}
    </div>
  );
}
