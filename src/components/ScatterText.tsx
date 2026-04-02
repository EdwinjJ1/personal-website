'use client';

import { useState, useMemo, useCallback, type CSSProperties, type ElementType, type ReactNode, isValidElement, cloneElement } from 'react';
import { motion } from 'framer-motion';

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

interface ScatterTextProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  scatterRadius?: number;
  rotationRange?: number;
  staggerDelay?: number;
  springConfig?: SpringConfig;
  color?: string;
  as?: ElementType;
}

interface CharTransform {
  x: number;
  y: number;
  rotate: number;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 300,
  damping: 20,
};

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
  staggerDelay = 0.02,
  springConfig = DEFAULT_SPRING,
  color,
  as: Component = 'span',
}: ScatterTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  const text = useMemo(() => extractText(children), [children]);
  const chars = useMemo(() => Array.from(text), [text]);

  const scatterTransforms = useMemo<CharTransform[]>(() => {
    return chars.map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = scatterRadius * (0.5 + Math.random() * 0.5);
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 2 * rotationRange,
      };
    });
  }, [chars, scatterRadius, rotationRange]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const mergedStyle: CSSProperties = {
    ...style,
    ...(color ? { color } : {}),
    cursor: 'default',
  };

  const isStringChild = typeof children === 'string';
  const singleChild = !isStringChild && isValidElement<Record<string, unknown>>(children) ? children : null;

  if (isStringChild) {
    return (
      <Component
        className={className}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {chars.map((char, i) => {
          if (char === ' ') {
            return <span key={`space-${i}`} style={SPACE_STYLE} />;
          }

          const target = isHovered ? scatterTransforms[i] : { x: 0, y: 0, rotate: 0 };
          const delay = isHovered ? i * staggerDelay : i * staggerDelay * 0.5;

          return (
            <motion.span
              key={`${char}-${i}`}
              style={CHAR_STYLE}
              animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotate,
              }}
              transition={{
                type: 'spring',
                ...springConfig,
                delay,
              }}
            >
              {char}
            </motion.span>
          );
        })}
      </Component>
    );
  }

  // For React element children (like GradientText), wrap the char animations
  // inside the child element, passing through its props
  if (singleChild) {
    const scatteredChars = chars.map((char, i) => {
      if (char === ' ') {
        return <span key={`space-${i}`} style={SPACE_STYLE} />;
      }

      const target = isHovered ? scatterTransforms[i] : { x: 0, y: 0, rotate: 0 };
      const delay = isHovered ? i * staggerDelay : i * staggerDelay * 0.5;

      return (
        <motion.span
          key={`${char}-${i}`}
          style={CHAR_STYLE}
          animate={{
            x: target.x,
            y: target.y,
            rotate: target.rotate,
          }}
          transition={{
            type: 'spring',
            ...springConfig,
            delay,
          }}
        >
          {char}
        </motion.span>
      );
    });

    return (
      <Component
        className={className}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {cloneElement(singleChild, singleChild.props, scatteredChars)}
      </Component>
    );
  }

  // Fallback: just render children
  return <>{children}</>;
}
