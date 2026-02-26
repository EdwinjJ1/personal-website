'use client';

import Link from 'next/link';
import BaseCard from './BaseCard';

interface NewsCardProps {
  delay?: number;
}

const quickHighlights = [
  { title: 'Anthropic $30B融资', tag: 'BREAKING' as const },
  { title: 'AMD-Meta $100B交易', tag: 'BREAKING' as const },
  { title: 'Perplexity Computer发布', tag: 'PRODUCT' as const },
  { title: 'Gemini手机多步骤任务', tag: 'PRODUCT' as const },
];

const tagColors = {
  BREAKING: { bg: '#dc2626', text: '#fff' },
  PRODUCT: { bg: '#2563eb', text: '#fff' },
  RESEARCH: { bg: '#16a34a', text: '#fff' },
  POLICY: { bg: '#d97706', text: '#fff' },
};

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
              AI industry news, research papers, and global updates.
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
          {[
            { value: '13', label: 'Reports', color: '#00d4ff' },
            { value: '50+', label: 'Items', color: '#a78bfa' },
            { value: '15', label: 'Papers', color: '#22c55e' },
          ].map((stat) => (
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
              key={item.title}
              className="flex items-center gap-2 rounded-lg border p-2"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#211e1c' }}
            >
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: tagColors[item.tag].bg, color: tagColors[item.tag].text }}
              >
                {item.tag}
              </span>
              <span className="text-sm" style={{ color: '#e0d8cc' }}>{item.title}</span>
            </div>
          ))}
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
