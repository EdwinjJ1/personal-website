'use client';

import { useState, useEffect } from 'react';
import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
import ScatterText from '@/components/ScatterText';
import staticData from '@/data/github-activity.json';

interface ActivityDay {
  date: string;
  count: number;
  level: number;
}

// 26 weeks × 7 days — GitHub-style column-per-week heatmap
const DAYS_SHOWN = 182;

// Eased count-up for the contributions total
function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const from = value;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

const ACTIVITY_COLORS = [
  'bg-[#312e2a]',
  'bg-teal-900/40',
  'bg-teal-700/60',
  'bg-teal-500/80',
  'bg-teal-400',
];

function toLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function buildGrid(
  allDays: Array<{ date: string; count: number }>,
  count: number
): ActivityDay[] {
  const dayMap = new Map(allDays.map(d => [d.date, d.count]));
  const today = new Date();
  const grid: ActivityDay[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const c = dayMap.get(dateStr) ?? 0;
    grid.push({ date: dateStr, count: c, level: toLevel(c) });
  }

  return grid;
}

export default function ActivityCard() {
  const [mounted, setMounted] = useState(false);

  const typedStaticDays = staticData.days as Array<{ date: string; count: number }>;
  const [days] = useState<ActivityDay[]>(() => buildGrid(typedStaticDays, DAYS_SHOWN));
  const total = staticData.totalContributions;

  useEffect(() => { setMounted(true); }, []);

  const displayTotal = useCountUp(total);

  const Header = () => (
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
        <ScatterText scatterRadius={25} rotationRange={10} staggerDelay={0.015}>GitHub Activity</ScatterText>
        <span className="text-xs text-green-400 ml-1" title="Real data from GitHub">&#x25CF;</span>
      </h3>
      <span className="text-xs tabular-nums" style={{ color: '#b8b4aa' }}>
        {displayTotal} contributions
        <span className="ml-1 text-[10px]" style={{ color: '#8a8680' }}>(last year)</span>
      </span>
    </div>
  );

  const Legend = () => (
    <div className="flex justify-between items-center text-xs" style={{ color: '#8a8680' }}>
      <span>Less</span>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className={`w-2 h-2 rounded-sm ${ACTIVITY_COLORS[level]}`} />
        ))}
      </div>
      <span>More</span>
    </div>
  );

  if (!mounted) {
    return (
      <BaseCard size="md" delay={0.4} className="md:col-span-2 lg:col-span-5">
        <div className="flex h-full flex-col">
          <Header />
          <div className="grid flex-1 min-h-0 grid-flow-col grid-rows-7 gap-[3px] mb-3 auto-cols-fr">
            {Array.from({ length: DAYS_SHOWN }).map((_, i) => (
              <div key={i} className="min-h-[8px] rounded-sm bg-[#312e2a]" />
            ))}
          </div>
          <Legend />
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard size="md" delay={0.4} className="md:col-span-2 lg:col-span-5">
      <a
        href="https://github.com/EdwinjJ1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Evan's GitHub profile"
        className="flex h-full flex-col"
      >
        <Header />
        <div className="grid flex-1 min-h-0 grid-flow-col grid-rows-7 gap-[3px] mb-3 auto-cols-fr">
          {days.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.003 }}
              className={`min-h-[8px] rounded-sm ${ACTIVITY_COLORS[day.level]}
                hover:ring-1 hover:ring-teal-400 cursor-pointer relative group`}
              title={`${day.count} contributions on ${day.date}`}
            >
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                style={{ backgroundColor: 'rgba(26, 24, 22, 0.95)', color: '#e0d8cc' }}
              >
                {day.count} contributions
              </div>
            </motion.div>
          ))}
        </div>
        <Legend />
      </a>
    </BaseCard>
  );
}
