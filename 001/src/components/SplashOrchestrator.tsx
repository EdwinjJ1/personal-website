'use client';

import { type ReactNode } from 'react';
import { useSplashState } from '@/hooks/useSplashState';
import SplashScreen from './SplashScreen';

interface SplashOrchestratorProps {
  children: ReactNode;
}

/**
 * The splash is an overlay on top of already-rendered content, never a gate
 * in front of it. Earlier versions kept children at opacity 0 until a GSAP
 * callback fired, so a throttled rAF (background tab, reduced-motion) left
 * the whole site invisible.
 */
export default function SplashOrchestrator({ children }: SplashOrchestratorProps) {
  const { showSplash, dismissSplash } = useSplashState();

  return (
    <>
      {children}
      {showSplash && <SplashScreen onComplete={dismissSplash} />}
    </>
  );
}
