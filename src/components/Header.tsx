'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScatterText from '@/components/ScatterText';

const NAV_ITEMS = [
  { label: 'News',     href: '/news' },
  { label: 'Friends',  href: '/friends' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'About',    href: '/about' },
];

// Pill hover animation — one circle per nav item
function PillItem({
  label,
  href,
  active,
  ease,
}: {
  label: string;
  href: string;
  active: boolean;
  ease: string;
}) {
  const pillRef     = useRef<HTMLAnchorElement>(null);
  const circleRef   = useRef<HTMLSpanElement>(null);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);
  const tweenRef    = useRef<gsap.core.Tween | null>(null);

  // Layout the circle geometry and build the timeline
  const layout = () => {
    const pill   = pillRef.current;
    const circle = circleRef.current;
    if (!pill || !circle) return;

    const { width: w, height: h } = pill.getBoundingClientRect();
    if (!w || !h) return;

    const R      = ((w * w) / 4 + h * h) / (2 * h);
    const D      = Math.ceil(2 * R) + 2;
    const delta  = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
    const originY = D - delta;

    circle.style.width  = `${D}px`;
    circle.style.height = `${D}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

    const labelEl = pill.querySelector<HTMLElement>('.pill-label');
    const hoverEl = pill.querySelector<HTMLElement>('.pill-label-hover');
    if (labelEl) gsap.set(labelEl, { y: 0 });
    if (hoverEl) gsap.set(hoverEl, { y: h + 12, opacity: 0 });

    tlRef.current?.kill();
    const tl = gsap.timeline({ paused: true });
    tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
    if (labelEl) tl.to(labelEl, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
    if (hoverEl) {
      gsap.set(hoverEl, { y: Math.ceil(h + 100), opacity: 0 });
      tl.to(hoverEl, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
    }
    tlRef.current = tl;
  };

  useEffect(() => {
    layout();
    window.addEventListener('resize', layout);
    document.fonts?.ready?.then(layout).catch(() => {});
    return () => window.removeEventListener('resize', layout);
  }, []);

  const handleEnter = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tweenRef.current?.kill();
    tweenRef.current = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tweenRef.current?.kill();
    tweenRef.current = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  return (
    <li>
      <Link
        ref={pillRef}
        href={href}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 16px',
          borderRadius: 9999,
          overflow: 'hidden',
          textDecoration: 'none',
          background: active ? '#7a9088' : 'transparent',
          color: active ? '#1a1816' : '#e0d8cc',
          fontWeight: 500,
          fontSize: 14,
          transition: 'background 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Animated fill circle */}
        <span
          ref={circleRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            borderRadius: '50%',
            background: '#7a9088',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Label stack */}
        <span style={{ position: 'relative', zIndex: 1, overflow: 'hidden', height: '1.2em', display: 'flex', flexDirection: 'column' }}>
          <span className="pill-label" style={{ display: 'block', color: active ? '#1a1816' : '#e0d8cc' }}>{label}</span>
          <span className="pill-label-hover" aria-hidden="true" style={{ display: 'block', position: 'absolute', color: '#1a1816' }}>{label}</span>
        </span>
      </Link>
    </li>
  );
}

export default function Header() {
  const pathname   = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef   = useRef<HTMLButtonElement>(null);
  const mobileMenuRef  = useRef<HTMLDivElement>(null);
  const ease = 'power3.out';

  // Init mobile menu hidden
  useEffect(() => {
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0 });
    }
  }, []);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);

    const hamburger = hamburgerRef.current;
    const menu      = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll<HTMLSpanElement>('.h-line');
      if (next) {
        gsap.to(lines[0], { rotation: 45,  y: 4,  duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -4, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (next) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease });
      } else {
        gsap.to(menu, { opacity: 0, y: -8, duration: 0.2, ease, onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); } });
      }
    }
  };

  return (
    <>
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm"
      style={{ backgroundColor: 'rgba(26, 24, 22, 0.95)', borderColor: 'rgba(114, 110, 102, 0.3)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold" style={{ color: '#e0d8cc' }}>
          <Link href="/" style={{ color: '#e0d8cc', textDecoration: 'none' }}>
            <ScatterText scatterRadius={30} staggerDelay={0.015}>Evan Lin</ScatterText>
          </Link>
        </h1>

        {/* Desktop pill nav */}
        <nav className="hidden md:block">
          <ul style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_ITEMS.map(item => (
              <PillItem
                key={item.href}
                label={item.label}
                href={item.href}
                active={pathname === item.href || pathname.startsWith(item.href + '/')}
                ease={ease}
              />
            ))}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          className="md:hidden p-2 flex flex-col gap-1.5 justify-center"
          style={{ color: '#e0d8cc', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="h-line" style={{ display: 'block', width: 22, height: 2, background: '#e0d8cc', borderRadius: 2, transformOrigin: 'center' }} />
          <span className="h-line" style={{ display: 'block', width: 22, height: 2, background: '#e0d8cc', borderRadius: 2, transformOrigin: 'center' }} />
        </button>
      </div>

    </motion.header>

      {/* Mobile menu - full screen overlay, outside header */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed inset-0 z-40"
        style={{ visibility: 'hidden', opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(26, 24, 22, 0.97)' }}
          onClick={toggleMenu}
        />
        {/* Menu content */}
        <div className="relative z-10 px-8 pt-24 space-y-2">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={toggleMenu}
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: 12,
                fontWeight: 500,
                fontSize: 18,
                color: pathname === item.href ? '#7a9088' : '#e0d8cc',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
