'use client';

import Galaxy from '@/components/Galaxy';
import { useTheme } from '@/hooks/useTheme';

/**
 * Chooses the ambient background layer for the active theme.
 *
 * The starfield only reads as atmosphere against a dark ground — on the
 * bone-white light palette the same points look like sensor noise, so
 * light mode gets a pair of very soft sage blooms instead (CSS only,
 * which also spares light-mode visitors the WebGL context).
 */
export default function SiteBackdrop() {
  const { resolved } = useTheme();

  // Before mount the theme is unknown. Render nothing rather than
  // guessing — a wrong guess means spinning up and tearing down a
  // WebGL context on the first frame.
  if (resolved === null) return null;

  if (resolved === 'light') return <div className="site-bloom" aria-hidden="true" />;

  return (
    <Galaxy
      density={0.42}
      speed={0.28}
      glowIntensity={0.14}
      saturation={0.3}
      hueShift={160}
      twinkleIntensity={0.12}
      rotationSpeed={0.008}
      mouseInteraction={false}
      mouseRepulsion={false}
      repulsionStrength={1.5}
      transparent={true}
      opacity={0.38}
    />
  );
}
