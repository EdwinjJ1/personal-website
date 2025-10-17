'use client';

import React from 'react';
import './GradientText.css';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 8,
  showBorder = false
}: GradientTextProps) {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <span className={`animated-gradient-text ${className}`}>
      {showBorder && <span className="gradient-overlay" style={gradientStyle}></span>}
      <span className="text-content" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
}

