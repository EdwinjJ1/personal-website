'use client';

import BaseCard from './BaseCard';
import ScatterText from '@/components/ScatterText';
import { useState } from 'react';

const skills = [
  { name: 'TypeScript', color: '#3b82f6' },
  { name: 'React', color: '#22d3ee' },
  { name: 'Next.js', color: '#e0d8cc' },
  { name: 'Node.js', color: '#4ade80' },
  { name: 'Python', color: '#facc15' },
  { name: 'Tailwind', color: '#2dd4bf' },
  { name: 'AWS', color: '#fb923c' },
  { name: 'Docker', color: '#60a5fa' },
  { name: 'C', color: '#c084fc' },
];

export default function SkillsCard() {
  const [open, setOpen] = useState(false);
  const visible = open ? skills : skills.slice(0, 5);

  return (
    <BaseCard size="md" delay={0.3} className="lg:col-span-6">
      <div className="h-full flex flex-col">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <h3 className="font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a8870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <ScatterText scatterRadius={25} rotationRange={10} staggerDelay={0.015}>Tech Stack</ScatterText>
          </h3>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8680" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className="flex flex-wrap gap-2">
          {visible.map((skill) => (
            <span
              key={skill.name}
              className="px-2.5 py-1 rounded-md text-xs font-medium border"
              style={{
                borderColor: `${skill.color}40`,
                backgroundColor: `${skill.color}18`,
                color: skill.color,
              }}
            >
              {skill.name}
            </span>
          ))}
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="px-2.5 py-1 rounded-md text-xs border"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#8a8680' }}
            >
              +{skills.length - 5} more
            </button>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
