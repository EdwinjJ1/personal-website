'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX: number;
  randomY: number;
  randomRotate: number;
}

export default function GlobalTextCursor() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [mounted, setMounted] = useState(false);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const spacing = 80;
  const maxPoints = 8;

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const createRandom = () => ({
      randomX: Math.random() * 10 - 5,
      randomY: Math.random() * 10 - 5,
      randomRotate: Math.random() * 10 - 5,
    });

    setTrail(prev => {
      const newTrail = [...prev];
      const last = lastPointRef.current;

      if (!last) {
        const point = { id: idCounter.current++, x: mouseX, y: mouseY, angle: 0, ...createRandom() };
        newTrail.push(point);
        lastPointRef.current = { x: mouseX, y: mouseY };
      } else {
        const dx = mouseX - last.x;
        const dy = mouseY - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= spacing) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const steps = Math.floor(distance / spacing);

          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / distance;
            const newX = last.x + dx * t;
            const newY = last.y + dy * t;
            newTrail.push({ id: idCounter.current++, x: newX, y: newY, angle, ...createRandom() });
          }
          lastPointRef.current = { x: mouseX, y: mouseY };
        }
      }

      return newTrail.length > maxPoints ? newTrail.slice(newTrail.length - maxPoints) : newTrail;
    });

    lastMoveTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mounted, handleMouseMove]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, 20);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      <AnimatePresence>
        {trail.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.5, rotate: item.angle }}
            animate={{
              opacity: 0.6,
              scale: 1,
              x: [0, item.randomX, 0],
              y: [0, item.randomY, 0],
              rotate: [item.angle, item.angle + item.randomRotate, item.angle],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.3, ease: 'easeOut' },
              scale: { duration: 0.3, ease: 'easeOut' },
              x: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
              y: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
              rotate: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
            }}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              fontSize: '1.2rem',
              color: '#7a9088',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            ✦
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
