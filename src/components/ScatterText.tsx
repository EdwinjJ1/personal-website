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
// The effect arms as the cursor APPROACHES (window-level tracking), not on hover,
// so letters start moving before the pointer ever touches the text.
const MIN_REPEL_RADIUS = 40;
const RETURN_EASE = 0.1;
const FRICTION = 0.85;
const FORCE = 3.4;

const CHAR_STYLE: CSSProperties = {
  display: 'inline-block',
  willChange: 'transform',
};

// Words are atomic inline-blocks so paragraphs still wrap at word
// boundaries (adjacent inline-block chars would otherwise allow
// mid-word line breaks).
const WORD_STYLE: CSSProperties = {
  display: 'inline-block',
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
    let near = false;
    let wasNear = false;
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

        if (near && dist < radius && dist > 0.01) {
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

      if (!near && energy < 0.4) {
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

    // Window-level tracking: the effect kicks in while the cursor is still
    // approaching, instead of waiting for a hover on the text itself.
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const rect = el.getBoundingClientRect();
      near =
        mx > rect.left - radius &&
        mx < rect.right + radius &&
        my > rect.top - radius &&
        my < rect.bottom + radius;

      if (near) {
        // re-measure on each approach — cards may have moved (entry animation,
        // hover scale, scroll) since the last pass
        if (!wasNear) cacheHomes();
        start();
      }
      wasNear = near;
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [text, scatterRadius, rotationRange]);

  const mergedStyle: CSSProperties = {
    ...style,
    ...(color ? { color } : {}),
  };

  // Split into words + whitespace; render whitespace as plain text nodes so
  // line wrapping stays natural for multi-line copy.
  const renderedContent = useMemo(() => {
    const tokens = text.split(/(\s+)/);
    let charIndex = 0;
    return tokens.map((token, t) => {
      if (token === '') return null;
      if (/^\s+$/.test(token)) {
        return token.replace(/\s/g, ' ').length > 1 ? ' ' : ' ';
      }
      return (
        <span key={`w-${t}`} style={WORD_STYLE}>
          {Array.from(token).map((char) => (
            <span key={`c-${charIndex++}`} data-scatter-char style={CHAR_STYLE}>
              {char}
            </span>
          ))}
        </span>
      );
    });
  }, [text]);

  const isStringChild = typeof children === 'string';
  const singleChild = !isStringChild && isValidElement<Record<string, unknown>>(children) ? children : null;

  if (isStringChild) {
    return (
      <Component ref={containerRef} className={className} style={mergedStyle}>
        {renderedContent}
      </Component>
    );
  }

  // For React element children (like GradientText), render the chars inside
  // the child element, passing through its props
  if (singleChild) {
    return (
      <Component ref={containerRef} className={className} style={mergedStyle}>
        {cloneElement(singleChild, singleChild.props, renderedContent)}
      </Component>
    );
  }

  // Fallback: just render children
  return <>{children}</>;
}
