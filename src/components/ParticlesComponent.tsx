'use client';

import React, { useEffect, useState } from 'react';

const ParticlesComponent = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    size: string;
  }>>([]);

  useEffect(() => {
    // Generate fixed particle positions to avoid hydration mismatch
    const generateParticles = (count: number, size: string, sizeMultiplier: number, idOffset: number) => {
      return Array.from({ length: count }, (_, i) => {
        // Use more natural random distribution
        const angle = (i * 137.5) % 360; // Golden angle for better distribution
        const distance = 30 + (i % 40); // Vary distance from center
        const left = 50 + Math.cos(angle * Math.PI / 180) * distance;
        const top = 50 + Math.sin(angle * Math.PI / 180) * distance;
        
        return {
          id: i + idOffset, // Add offset to ensure unique IDs
          left: Math.max(0, Math.min(100, left)), // Clamp to 0-100%
          top: Math.max(0, Math.min(100, top)),   // Clamp to 0-100%
          delay: (i * 0.08) % 4,
          duration: 2 + (i % 3) + sizeMultiplier,
          size: size,
        };
      });
    };

    const smallParticles = generateParticles(60, 'w-1 h-1', 0, 0);      // id: 0-59
    const mediumParticles = generateParticles(30, 'w-1.5 h-1.5', 1, 60); // id: 60-89
    const largeParticles = generateParticles(15, 'w-2 h-2', 2, 90);     // id: 90-104

    setParticles([...smallParticles, ...mediumParticles, ...largeParticles]);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(to bottom right, #1a1816, #211e1c, #1a1816)' }}></div>
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${particle.size} rounded-full opacity-20 animate-pulse`}
          style={{
            backgroundColor: '#c8c0b4',
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesComponent;
