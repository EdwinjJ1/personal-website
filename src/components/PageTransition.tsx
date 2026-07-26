'use client';

import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * CSS-driven rather than framer-motion: a rAF-throttled tab (loading in the
 * background) would otherwise leave the page stuck at opacity 0. CSS
 * animations still resolve to their final state without an animation frame.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
  <div className="page-enter">{children}</div>
);

export default PageTransition;
