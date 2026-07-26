'use client';

import Galaxy from '@/components/Galaxy';
import { useTheme } from '@/hooks/useTheme';

/**
 * Chooses the ambient background layer for the active theme.
 *
 * The starfield only reads as atmosphere against a dark ground — on the
 * pale light palette the same points look like sensor noise, so light
 * mode gets a soft teal wash instead (CSS only, which also spares
 * light-mode visitors the WebGL context).
 */
export default function SiteBackdrop() {
  const { resolved } = useTheme();

  // Dark is the default, so the starfield is the safe pre-mount guess:
  // it is what most visitors get, and only an explicit light choice
  // swaps it out. Rendering nothing here would blank the backdrop for a
  // frame on every load.
  if (resolved === 'light') {
    return <div key="bloom" className="site-bloom" aria-hidden="true" />;
  }

  return (
    // Keyed so toggling themes unmounts this subtree outright instead of
    // letting React reuse the slot — the WebGL canvas needs its cleanup
    // to run, or its stars linger over the light backdrop.
    <Galaxy
      key="galaxy"
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
