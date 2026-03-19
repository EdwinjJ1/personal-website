'use client';

import Link from 'next/link';
import BaseCard from './BaseCard';
import newsData from '@/data/news-data.json';

interface NewsCardProps {
  delay?: number;
}

interface NewsItem {
  id: string;
  title: string;
  tag: 'BREAKING' | 'PRODUCT' | 'RESEARCH' | 'POLICY';
  date: string;
  time: string;
  category: 'ai' | 'research' | 'industry' | 'global';
}

const tagColors = {
  BREAKING: { bg: '#dc2626', text: '#fff' },
  PRODUCT: { bg: '#2563eb', text: '#fff' },
  RESEARCH: { bg: '#16a34a', text: '#fff' },
  POLICY: { bg: '#d97706', text: '#fff' },
};

const allNews = newsData.news as NewsItem[];
const latestDate = newsData.availableDates[0]?.value ?? '';
const latestLabel = newsData.availableDates[0]?.label ?? 'Latest';
const latestItems = allNews
  .filter((item) => item.date === latestDate)
  .sort((left, right) => right.time.localeCompare(left.time) || left.title.localeCompare(right.title));
const quickHighlights = latestItems.slice(0, 4);
const stats = [
  { value: String(newsData.availableDates.length), label: 'Dates', color: '#00d4ff' },
  { value: String(allNews.length), label: 'Items', color: '#a78bfa' },
  { value: String(latestItems.length), label: 'Latest', color: '#22c55e' },
];

export default function NewsCard({ delay = 0.9 }: NewsCardProps) {
  return (
    <BaseCard size="md" hover={false} delay={delay} className="md:col-span-2 lg:col-span-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
              <span className="text-2xl" style={{ color: '#7a9088' }}>🤖</span>
              News Hub
            </h3>
            <p className="text-sm mt-1" style={{ color: '#b8b4aa' }}>
              AI industry news, research papers, and global updates. Latest sync: {latestLabel}.
            </p>
          </div>
          <Link
            href="/news"
            className="rounded-full border px-3 py-1 text-xs transition-colors hover:border-[#7a9088]"
            style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
          >
            View all
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex-1 text-center rounded-lg py-2"
              style={{ backgroundColor: '#211e1c' }}
            >
              <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs" style={{ color: '#8a8680' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="flex-1 space-y-2">
          {quickHighlights.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-lg border p-2"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#211e1c' }}
            >
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: tagColors[item.tag].bg, color: tagColors[item.tag].text }}
              >
                {item.tag}
              </span>
              <span className="text-sm truncate" style={{ color: '#e0d8cc' }}>{item.title}</span>
            </div>
          ))}
          {quickHighlights.length === 0 && (
            <div
              className="rounded-lg border p-3 text-sm"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#211e1c', color: '#b8b4aa' }}
            >
              No synced headlines yet.
            </div>
          )}
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-1 self-start text-xs font-medium transition-colors hover:text-[#6a8a8e]"
          style={{ color: '#7a9088' }}
        >
          Read news hub
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </BaseCard>
  );
}
