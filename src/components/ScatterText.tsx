'use client';

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  isValidElement,
  cloneElement,
} from 'react';

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

interface ScatterTextProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Cursor repel radius in px (small legacy values are bumped to a usable minimum) */
  scatterRadius?: number;
  rotationRange?: number;
  /** Ignored — the effect is now real-time with no stagger; kept so call sites don't break */
  staggerDelay?: number;
  /** Ignored — kept so call sites don't break */
  springConfig?: SpringConfig;
  color?: string;
  as?: ElementType;
}

// Same feel as ParticleName (the "Evan Lin" canvas signature):
// instant repulsion from the cursor, friction + spring-back on release.
const MIN_REPEL_RADIUS = 44;
const RETURN_EASE = 0.09;
const FRICTION = 0.85;
const FORCE = 2.8;

const CHAR_STYLE: CSSProperties = {
  display: 'inline-block',
  willChange: 'transform',
};

const SPACE_STYLE: CSSProperties = {
  display: 'inline-block',
  width: '0.3em',
};

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children) {
    return extractText(node.props.children);
  }
  return '';
}

export default function ScatterText({
  children,
  className,
  style,
  scatterRadius = 60,
  rotationRange = 15,
  color,
  as: Component = 'span',
}: ScatterTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  const text = useMemo(() => extractText(children), [children]);
  const chars = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-scatter-char]'));
    if (spans.length === 0) return;

    const radius = Math.max(MIN_REPEL_RADIUS, scatterRadius);
    // hx/hy: resting center of each char; x/y + vx/vy: current offset + velocity
    const points = spans.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0 }));

    let raf = 0;
    let running = false;
    let inside = false;
    let mx = -10000;
    let my = -10000;

    const cacheHomes = () => {
      spans.forEach((span, i) => {
        const rect = span.getBoundingClientRect();
        // subtract the current offset so homes stay correct mid-animation
        points[i].hx = rect.left + rect.width / 2 - points[i].x;
        points[i].hy = rect.top + rect.height / 2 - points[i].y;
      });
    };

    const tick = () => {
      let energy = 0;

      points.forEach((p, i) => {
        const dx = p.hx + p.x - mx;
        const dy = p.hy + p.y - my;
        const dist = Math.hypot(dx, dy);

        if (inside && dist < radius && dist > 0.01) {
          const force = ((radius - dist) / radius) * FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx += -p.x * RETURN_EASE;
        p.vy += -p.y * RETURN_EASE;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        energy += Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.vx) + Math.abs(p.vy);

        const rot = Math.max(-rotationRange, Math.min(rotationRange, p.x * 0.55));
        spans[i].style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      });

      if (!inside && energy < 0.4) {
        running = false;
        spans.forEach((span) => { span.style.transform = ''; });
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = (e: MouseEvent) => {
      inside = true;
      cacheHomes();
      mx = e.clientX;
      my = e.clientY;
      start();
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      start();
    };
    const onLeave = () => {
      inside = false;
      mx = -10000;
      my = -10000;
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [text, scatterRadius, rotationRange]);

  const mergedStyle: CSSProperties = {
    ...style,
    ...(color ? { color } : {}),
  };

  const renderedChars = chars.map((char, i) => {
    if (char === ' ') {
      return <span key={`space-${i}`} style={SPACE_STYLE} />;
    }
    return (
      <span key={`${char}-${i}`} data-scatter-char style={CHAR_STYLE}>
        {char}
      </span>
    );
  });

  const isStringChild = typeof children === 'string';
  const singleChild = !isStringChild && isValidElement<Record<string, unknown>>(children) ? children : null;

  if (isStringChild) {
    return (
      <Component ref={containerRef} className={className} style={mergedStyle}>
        {renderedChars}
      </Component>
    );
  }

  // For React element children (like GradientText), render the chars inside
  // the child element, passing through its props
  if (singleChild) {
    return (
      <Component ref={containerRef} className={className} style={mergedStyle}>
        {cloneElement(singleChild, singleChild.props, renderedChars)}
      </Component>
    );
  }

  // Fallback: just render children
  return <>{children}</>;
}
