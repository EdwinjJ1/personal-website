'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const NAME = 'EVAN LIN';
const SUBTITLE = 'Developer / Creator / Explorer';
const AUTO_DISMISS_MS = 1950;
const SKIP_FADE_MS = 350;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }, [onComplete]);

  // Timers rather than animation callbacks: setTimeout still fires in a
  // background tab, so the overlay always unmounts.
  useEffect(() => {
    const auto = window.setTimeout(finish, AUTO_DISMISS_MS);
    return () => window.clearTimeout(auto);
  }, [finish]);

  const handleSkip = useCallback(() => {
    if (doneRef.current || leaving) return;
    setLeaving(true);
    window.setTimeout(finish, SKIP_FADE_MS);
  }, [finish, leaving]);

  return (
    <div
      className={`splash-overlay${leaving ? ' is-leaving' : ''}`}
      onClick={handleSkip}
      onKeyDown={handleSkip}
      tabIndex={0}
      role="button"
      aria-label="Skip intro"
    >
      <div className="splash-radial-glow" />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="splash-name">
          {Array.from(NAME).map((char, i) => (
            <span
              key={`${char}-${i}`}
              className="splash-letter"
              style={{ animationDelay: `${0.15 + i * 0.055}s` }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </div>

        <div className="splash-line" />
        <div className="splash-subtitle">{SUBTITLE}</div>
        <div className="splash-skip-hint">click anywhere to enter</div>
      </div>
    </div>
  );
}
