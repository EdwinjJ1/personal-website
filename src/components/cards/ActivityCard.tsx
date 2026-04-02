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

// Fetch latest public events and merge with static data
async function fetchLatestEvents(
  username: string,
  baseDays: Array<{ date: string; count: number }>
): Promise<{ days: Array<{ date: string; count: number }>; extraCount: number }> {
  const dayMap = new Map(baseDays.map(d => [d.date, d.count]));
  let extraCount = 0;

  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) break;
    const events = await res.json();
    if (events.length === 0) break;

    for (const event of events) {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      const current = dayMap.get(date) ?? 0;
      const eventCount = (dayMap.get(`__events_${date}`) ?? 0) + 1;
      dayMap.set(`__events_${date}`, eventCount);

      // Only update if events API shows more activity than static data
      if (eventCount > current) {
        dayMap.set(date, eventCount);
        extraCount += eventCount - current;
      }
    }
  }

  // Clean up internal tracking keys
  const merged = Array.from(dayMap.entries())
    .filter(([key]) => !key.startsWith('__'))
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { days: merged, extraCount };
}

export default function ActivityCard() {
  const [mounted, setMounted] = useState(false);

  const typedStaticDays = staticData.days as Array<{ date: string; count: number }>;
  const [days, setDays] = useState<ActivityDay[]>(() => buildGrid(typedStaticDays, 84));
  const [total, setTotal] = useState(staticData.totalContributions);

  useEffect(() => { setMounted(true); }, []);

  // Try to update with latest public events after mount
  useEffect(() => {
    if (!mounted) return;

    fetchLatestEvents('EdwinjJ1', typedStaticDays)
      .then(({ days: merged, extraCount }) => {
        setDays(buildGrid(merged, 84));
        if (extraCount > 0) {
          setTotal(prev => prev + extraCount);
        }
      })
      .catch(() => { /* keep static data */ });
  }, [mounted]);

  const Header = () => (
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
        <ScatterText scatterRadius={25} rotationRange={10} staggerDelay={0.015}>GitHub Activity</ScatterText>
        <span className="text-xs text-green-400 ml-1" title="Real data from GitHub">&#x25CF;</span>
      </h3>
      <span className="text-xs" style={{ color: '#b8b4aa' }}>
        {total} contributions
        <span className="ml-1 text-[10px]" style={{ color: '#8a8680' }}>(this year)</span>
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
        <div className="h-full">
          <Header />
          <div className="grid grid-cols-12 gap-[3px] mb-3">
            {Array.from({ length: 84 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-sm bg-[#312e2a]" />
            ))}
          </div>
          <Legend />
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard size="md" delay={0.4} className="md:col-span-2 lg:col-span-5">
      <div className="h-full">
        <Header />
        <div className="grid grid-cols-12 gap-[3px] mb-3">
          {days.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.005 }}
              className={`aspect-square rounded-sm ${ACTIVITY_COLORS[day.level]}
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
      </div>
    </BaseCard>
  );
}
