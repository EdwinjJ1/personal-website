'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';

// Lightweight deterministic pseudo-random number generator so SSR + CSR match
const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const buildStaticActivityData = () => {
  const weeks = 12;
  const totalDays = weeks * 7;
  const startDate = new Date(Date.UTC(2024, 0, 1));
  const rand = createSeededRandom(42);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + index);

    const activity = Math.floor(rand() * 5);
    const multiplier = Math.floor(rand() * 5);

    return {
      date: date.toISOString().split('T')[0],
      activity,
      count: activity * (multiplier + 1)
    };
  });
};

const STATIC_ACTIVITY_DATA = buildStaticActivityData();

const getActivityColor = (level: number) => {
  const colors = [
    'bg-gray-700', // 0 - no activity
    'bg-teal-900/40', // 1 - low
    'bg-teal-700/60', // 2 - medium
    'bg-teal-500/80', // 3 - high
    'bg-teal-400' // 4 - very high
  ];
  return colors[level];
};

export default function ActivityCard() {
  const activityData = STATIC_ACTIVITY_DATA;
  const totalActivity = activityData.reduce((sum, day) => sum + day.count, 0);

  return (
    <BaseCard size="md" delay={0.4} className="md:col-span-2 lg:col-span-5">
      <div className="h-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-teal-400">📊</span>
            Activity
          </h3>
          <span className="text-xs text-gray-400">
            {totalActivity} contributions this year
          </span>
        </div>

        <div className="grid grid-cols-12 gap-[3px] mb-3">
          {activityData.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.005 }}
              className={`aspect-square rounded-sm ${getActivityColor(day.activity)}
                hover:ring-1 hover:ring-teal-400 cursor-pointer relative group`}
              title={`${day.count} contributions on ${day.date}`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {day.count} contributions
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-sm ${getActivityColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </BaseCard>
  );
}
