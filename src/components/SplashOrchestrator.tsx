'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { useSplashState } from '@/hooks/useSplashState';
import SplashScreen from './SplashScreen';

interface SplashOrchestratorProps {
  children: ReactNode;
}

export default function SplashOrchestrator({ children }: SplashOrchestratorProps) {
  const { showSplash, dismissSplash, checked } = useSplashState();
  const contentRef = useRef<HTMLDivElement>(null);

  // Before hydration check completes, hide everything to prevent flash
  const initiallyHidden = !checked || showSplash;

  const handleSplashComplete = () => {
    dismissSplash();

    // Animate content in
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  };

  // If no splash needed, make sure content is visible
  useEffect(() => {
    if (checked && !showSplash && contentRef.current) {
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
    }
  }, [checked, showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div
        ref={contentRef}
        style={{
          opacity: initiallyHidden ? 0 : 1,
          willChange: initiallyHidden ? 'opacity, transform' : 'auto',
        }}
      >
        {children}
      </div>
    </>
  );
}
