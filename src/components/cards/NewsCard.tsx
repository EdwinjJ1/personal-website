'use client';

import Link from 'next/link';
import BaseCard from './BaseCard';
import ScatterText from '@/components/ScatterText';
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
const quickHighlights = latestItems.slice(0, 3);

export default function NewsCard({ delay = 0.9 }: NewsCardProps) {
  return (
    <BaseCard size="md" hover={false} delay={delay} className="md:col-span-2 lg:col-span-6">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a9088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/>
              </svg>
              <ScatterText scatterRadius={25} rotationRange={10} staggerDelay={0.015}>News Hub</ScatterText>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm" style={{ color: '#b8b4aa' }}>
                AI news, research &amp; global updates. Synced {latestLabel}.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Link
              href="/news"
              className="rounded-full border px-3 py-1 text-xs transition-colors hover:border-[#7a9088]"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
            >
              View all
            </Link>
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
              style={{ borderColor: 'rgba(122, 144, 136, 0.35)', backgroundColor: 'rgba(122, 144, 136, 0.1)', color: '#7a9088' }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Run by Openclaw
            </span>
          </div>
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
              <span className="text-sm truncate" style={{ color: '#e0d8cc' }}>
                <ScatterText scatterRadius={15} rotationRange={6} staggerDelay={0.01}>{item.title}</ScatterText>
              </span>
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
