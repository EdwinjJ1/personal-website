'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import DecryptedText from './DecryptedText';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const NAME = 'EVAN LIN';
const SUBTITLE = 'Developer  /  Creator  /  Explorer';

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const skipHintRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const afterTlRef = useRef<gsap.core.Timeline | null>(null);
  const breathingRef = useRef<gsap.core.Tween | null>(null);
  const completedRef = useRef(false);
  const [showName, setShowName] = useState(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (completedRef.current) return;

    tlRef.current?.kill();
    afterTlRef.current?.kill();
    breathingRef.current?.kill();

    const exit = gsap.timeline({ onComplete: handleComplete });
    exit.to('.splash-name, .splash-line, .splash-subtitle-wrapper, .splash-skip-hint', {
      opacity: 0,
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.in',
    }, 0);
    exit.to(glowRef.current, {
      opacity: 0,
      scale: 1.5,
      duration: 0.4,
      ease: 'power2.in',
    }, 0);
    exit.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0.2);
  }, [handleComplete]);

  const handleDecryptComplete = useCallback(() => {
    const nameEl = nameWrapperRef.current;
    if (!nameEl) return;

    // After decrypt finishes: add glow, draw line, typewriter subtitle, show skip hint
    const tl = gsap.timeline();
    afterTlRef.current = tl;

    // Glow on name text
    tl.to(nameEl, {
      textShadow: '0 0 30px rgba(122, 144, 136, 0.6), 0 0 60px rgba(122, 144, 136, 0.3)',
      duration: 0.8,
      ease: 'power2.out',
    }, 0);

    // Line draws out
    tl.to(lineRef.current, {
      width: '140px',
      duration: 0.6,
      ease: 'power2.inOut',
    }, 0.3);

    // Subtitle typewriter
    const subtitleEl = subtitleRef.current;
    const cursorEl = cursorRef.current;

    if (subtitleEl && cursorEl) {
      tl.set(cursorEl, { opacity: 1 }, 0.7);
      tl.call(() => { cursorEl.classList.add('blink'); }, [], 0.7);

      tl.to({}, {
        duration: 1.4,
        ease: 'none',
        onUpdate: function () {
          const progress = this.progress();
          const charCount = Math.floor(progress * SUBTITLE.length);
          subtitleEl.textContent = SUBTITLE.slice(0, charCount);
        },
      }, 0.9);
    }

    // Show skip hint
    tl.to(skipHintRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, 2.0);

    // Start infinite glow breathing
    tl.call(() => {
      breathingRef.current = gsap.to(nameEl, {
        textShadow: '0 0 40px rgba(122, 144, 136, 0.8), 0 0 80px rgba(122, 144, 136, 0.4)',
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }, [], 2.2);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.focus();

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Phase 1: Radial glow fades in
    tl.to(glowRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
    }, 0);

    // Phase 2: Show DecryptedText after glow settles
    tl.call(() => {
      setShowName(true);
    }, [], 1.0);

    return () => {
      tl.kill();
    };
  }, []);

  const handleKeyDown = useCallback(() => {
    handleSkip();
  }, [handleSkip]);

  return (
    <div
      ref={overlayRef}
      className="splash-overlay"
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Skip intro"
    >
      <div ref={glowRef} className="splash-radial-glow" />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div ref={nameWrapperRef} className="splash-name">
          {showName && (
            <DecryptedText
              text={NAME}
              speed={150}
              maxIterations={30}
              sequential={true}
              revealDirection="start"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*"
              animateOn="view"
              className="splash-letter-revealed"
              encryptedClassName="splash-letter-encrypted"
              onAnimationComplete={handleDecryptComplete}
            />
          )}
        </div>

        <div
          ref={lineRef}
          className="splash-line"
          style={{ width: 0 }}
        />

        <div className="splash-subtitle-wrapper">
          <span ref={subtitleRef} className="splash-subtitle" />
          <span ref={cursorRef} className="splash-cursor">|</span>
        </div>

        <div ref={skipHintRef} className="splash-skip-hint">
          click anywhere to enter
        </div>
      </div>
    </div>
  );
}
