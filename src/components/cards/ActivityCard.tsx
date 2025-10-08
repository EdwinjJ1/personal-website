'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import BaseCard from './BaseCard';
import { motion } from 'framer-motion';

interface ActivityDay {
  date: string;
  activity: number;
  count: number;
}

// Fallback data generator for SSR and error cases
const buildFallbackActivityData = (): ActivityDay[] => {
  const weeks = 12;
  const totalDays = weeks * 7;
  const today = new Date();

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (totalDays - 1 - index));

    const seed = date.getTime();
    const random = Math.abs(Math.sin(seed)) * 5;
    const activity = Math.floor(random);
    const count = activity * (Math.floor(Math.abs(Math.sin(seed * 2)) * 5) + 1);

    return {
      date: date.toISOString().split('T')[0],
      activity,
      count
    };
  });
};

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

function getActivityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export default function ActivityCard() {
  const [activityData, setActivityData] = useState<ActivityDay[]>(buildFallbackActivityData());
  const [isLoading, setIsLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchGitHubActivity = async () => {
      try {
        const username = 'EdwinJia1';
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=100`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            }
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const events = await response.json();

        // Debug: Log fetched events
        console.log('📊 GitHub Events fetched:', events.length);
        if (events.length > 0) {
          console.log('📅 Latest event:', events[0].created_at);
          console.log('📅 Oldest event:', events[events.length - 1].created_at);
        }

        // Process events into daily activity
        const activityMap = new Map<string, number>();

        // Initialize last 12 weeks with 0 activity
        const weeks = 12;
        const totalDays = weeks * 7;
        const today = new Date();

        for (let i = totalDays - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          activityMap.set(dateStr, 0);
        }

        // Count events per day
        let eventsInRange = 0;
        events.forEach((event: any) => {
          const date = new Date(event.created_at).toISOString().split('T')[0];
          if (activityMap.has(date)) {
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
            eventsInRange++;
          }
        });

        console.log(`✅ Events in last 12 weeks: ${eventsInRange}/${events.length}`);

        // Convert to array format
        const processedData: ActivityDay[] = Array.from(activityMap.entries())
          .map(([date, count]) => ({
            date,
            count,
            activity: getActivityLevel(count)
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setActivityData(processedData);
        setIsRealData(true);
        setDebugInfo(`${eventsInRange} events in range`);
      } catch (error) {
        console.error('❌ Failed to fetch GitHub activity:', error);
        setDebugInfo('Using fallback data');
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubActivity();
  }, [isMounted]);

  const totalActivity = activityData.reduce((sum, day) => sum + day.count, 0);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <BaseCard size="md" delay={0.4} className="md:col-span-2 lg:col-span-5">
        <div className="h-full">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="text-teal-400">📊</span>
              GitHub Activity
            </h3>
            <span className="text-xs text-gray-400">
              Loading...
            </span>
          </div>
          <div className="grid grid-cols-12 gap-[3px] mb-3">
            {Array.from({ length: 84 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-sm bg-gray-700"
              />
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

  return (
    <BaseCard size="md" delay={0.4} className="md:col-span-2 lg:col-span-5">
      <div className="h-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-teal-400">📊</span>
            GitHub Activity
            {isRealData && (
              <span className="text-xs text-green-400 ml-1" title="Live data from GitHub API">●</span>
            )}
            {!isRealData && !isLoading && (
              <span className="text-xs text-yellow-400 ml-1" title="Using fallback data">○</span>
            )}
          </h3>
          <span className="text-xs text-gray-400">
            {totalActivity} contributions
            {debugInfo && (
              <span className="ml-2 text-gray-500" title={debugInfo}>ℹ️</span>
            )}
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
