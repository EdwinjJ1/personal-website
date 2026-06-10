'use client';

import { useEffect, useRef, useState } from 'react';

interface ParticleNameProps {
  text: string;
  fontSize?: number;
  className?: string;
  /** Dominant particle colour */
  color?: string;
  /** Accent particle colour (sprinkled ~25%) */
  accent?: string;
}

interface Particle {
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  color: string;
  delay: number;
}

const SAMPLE_STEP = 2;
const REPEL_RADIUS = 34;
const RETURN_EASE = 0.085;
const FRICTION = 0.86;

function samplePoints(text: string, fontSize: number, dpr: number) {
  const probe = document.createElement('canvas');
  const ctx = probe.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { points: [] as Array<{ x: number; y: number }>, width: 0, height: 0 };

  const font = `700 ${fontSize}px Inter, sans-serif`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width) + 8;
  const height = Math.ceil(fontSize * 1.35);

  probe.width = width;
  probe.height = height;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, 4, height / 2);

  const data = ctx.getImageData(0, 0, width, height).data;
  const points: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < height; y += SAMPLE_STEP) {
    for (let x = 0; x < width; x += SAMPLE_STEP) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        points.push({ x, y });
      }
    }
  }
  void dpr;
  return { points, width, height };
}

/**
 * Renders text as a constellation of particles that assemble from a scatter,
 * gently repel around the cursor on hover, and flow back when it leaves.
 * Falls back to plain text when prefers-reduced-motion is set.
 */
export default function ParticleName({
  text,
  fontSize = 30,
  className = '',
  color = '#e0d8cc',
  accent = '#7a9088',
}: ParticleNameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let start = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const init = () => {
      const { points, width, height } = samplePoints(text, fontSize, dpr);
      if (points.length === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = points.map((p) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 70;
        return {
          tx: p.x,
          ty: p.y,
          x: p.x + Math.cos(angle) * radius,
          y: p.y + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          size: 0.7 + Math.random() * 0.9,
          alpha: 0,
          baseAlpha: 0.65 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() < 0.25 ? accent : color,
          delay: (p.x / width) * 420 + Math.random() * 240,
        };
      });
    };

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (elapsed < p.delay) continue;

        // Cursor repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 1.6;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Spring home
        p.vx += (p.tx - p.x) * RETURN_EASE;
        p.vy += (p.ty - p.y) * RETURN_EASE;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        // Fade-in + twinkle
        if (p.alpha < p.baseAlpha) p.alpha = Math.min(p.baseAlpha, p.alpha + 0.05);
        const twinkle = 0.82 + 0.18 * Math.sin(now * 0.0014 + p.phase);

        ctx.globalAlpha = p.alpha * twinkle;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Only animate while visible
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
      { threshold: 0.1 }
    );

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      init();
      io.observe(canvas);
    });

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);

    return () => {
      cancelled = true;
      stopLoop();
      io.disconnect();
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [text, fontSize, color, accent, reducedMotion]);

  if (reducedMotion) {
    return (
      <span className={className} style={{ fontSize, fontWeight: 700, color }}>
        {text}
      </span>
    );
  }

  return (
    <div ref={wrapRef} className={className} role="heading" aria-level={1} aria-label={text}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ display: 'block' }} />
    </div>
  );
}
