'use client';

import { motion } from 'framer-motion';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
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
  delay = 0,
  glass = false,
}: BaseCardProps & { glass?: boolean }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '900px',
        ...(glass ? {} : {
          backgroundColor: '#282622',
          borderColor: 'rgba(114, 110, 102, 0.3)'
        }),
      }}
      className={`
        relative
        ${sizeClasses[size]}
        ${glass ? 'glass-card' : 'backdrop-blur-sm rounded-2xl p-5 border'}
        ${!glass ? 'rounded-2xl p-5' : 'rounded-2xl p-5'}
        ${hover ? 'transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? {
        scale: 1.02,
        y: -4,
        ...(glass ? {} : { borderColor: 'rgba(122, 144, 136, 0.5)' })
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
