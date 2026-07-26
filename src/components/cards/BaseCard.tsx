'use client';

import { motion } from 'framer-motion';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glass?: boolean;
  /** Ignored. Staggered entry needed an animation fill-mode that left
   *  cards blank whenever the browser paused animations. Kept so the
   *  existing call sites don't all have to change. */
  delay?: number;
}

const sizeClasses = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-1 md:col-span-2 row-span-1',
  lg: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2',
  xl: 'col-span-1 md:col-span-2 lg:col-span-4 row-span-2'
};

const MAX_TILT = 2.5;

export default function BaseCard({
  children,
  className = '',
  size = 'sm',
  hover = true,
  glass = false,
}: BaseCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    if (tiltRef.current) {
      const rx = (0.5 - py) * MAX_TILT;
      const ry = (px - 0.5) * MAX_TILT;
      tiltRef.current.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    }
    if (spotRef.current) {
      spotRef.current.style.opacity = '1';
      spotRef.current.style.background =
        `radial-gradient(240px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(122, 144, 136, 0.12), transparent 65%)`;
    }
  }, [canHover]);

  const handleMouseLeave = useCallback(() => {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    if (spotRef.current) spotRef.current.style.opacity = '0';
  }, []);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '900px',
        ...(glass ? {} : {
          backgroundColor: 'var(--color-surface-3)',
          borderColor: 'var(--color-line)',
        }),
      }}
      className={`
        relative rounded-2xl p-5 card-enter
        ${sizeClasses[size]}
        ${glass ? 'glass-card' : 'backdrop-blur-sm border'}
        ${hover ? 'transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? {
        scale: 1.02,
        y: -4,
        ...(glass ? {} : { borderColor: 'rgb(122 144 136 / 0.5)' })
      } : {}}
    >
      <div
        ref={tiltRef}
        className="h-full"
        style={{ transform: 'rotateX(0deg) rotateY(0deg)', transition: 'transform 0.18s ease-out', willChange: 'transform' }}
      >
        {children}
      </div>
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ opacity: 0, transition: 'opacity 0.35s ease' }}
      />
    </motion.div>
  );
}
