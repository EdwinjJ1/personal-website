'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ClientOnlyParticles from '@/components/ClientOnlyParticles';
import newsData from '@/data/news-data.json';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tag: 'BREAKING' | 'PRODUCT' | 'RESEARCH' | 'POLICY';
  source: string;
  sourceUrl: string;
  date: string;
  time: string;
  category: 'ai' | 'research' | 'industry' | 'global';
}

const categories = [
  { value: 'all', label: 'All', color: '#7a9088' },
  { value: 'ai', label: 'AI News', color: '#00d4ff' },
  { value: 'research', label: 'Research', color: '#a78bfa' },
  { value: 'industry', label: 'Industry', color: '#22c55e' },
  { value: 'global', label: 'Global', color: '#f59e0b' },
];

const tagColors = {
  BREAKING: { bg: '#dc2626', text: '#fff' },
  PRODUCT: { bg: '#2563eb', text: '#fff' },
  RESEARCH: { bg: '#16a34a', text: '#fff' },
  POLICY: { bg: '#d97706', text: '#fff' },
};

export default function NewsPage() {
  const [selectedDate, setSelectedDate] = useState(newsData.availableDates[0]?.value || '2026-02-26');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const news = newsData.news as NewsItem[];
  const availableDates = newsData.availableDates;

  const filteredNews = news.filter(item => {
    const dateMatch = item.date === selectedDate;
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    return dateMatch && categoryMatch;
  });

  const stats = {
    total: news.filter(item => item.date === selectedDate).length,
    ai: news.filter(item => item.date === selectedDate && item.category === 'ai').length,
    research: news.filter(item => item.date === selectedDate && item.category === 'research').length,
    industry: news.filter(item => item.date === selectedDate && item.category === 'industry').length,
    global: news.filter(item => item.date === selectedDate && item.category === 'global').length,
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ color: '#e0d8cc' }}>
        <ClientOnlyParticles />

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 pt-24 pb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#e0d8cc' }}>
                  News Hub
                </h1>
                <p className="text-sm" style={{ color: '#8a8680' }}>
                  AI industry news, research papers, and global updates
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:border-[#7a9088]"
                style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#7a9088' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
            </div>

            {/* ClawdBot Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-xl border p-4 mb-6 flex items-center gap-4"
              style={{ borderColor: 'rgba(122, 144, 136, 0.3)', backgroundColor: '#211e1c' }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#282622' }}
              >
                <svg className="w-5 h-5" style={{ color: '#7a9088' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold" style={{ color: '#e0d8cc' }}>Powered by ClawdBot</span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}
                  >
                    Active
                  </span>
                </div>
                <p className="text-xs" style={{ color: '#8a8680' }}>
                  24/7 automated news assistant. Pulls updates every 2 hours from Anthropic, DeepMind, arXiv, The Verge, and more.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: '#8a8680' }}>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: '#7a9088' }}>4</div>
                  <div>Categories</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: '#7a9088' }}>2h</div>
                  <div>Interval</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: '#7a9088' }}>24/7</div>
                  <div>Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* Date Selector */}
            {availableDates.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {availableDates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className="px-4 py-2 rounded-lg border transition-all"
                    style={{
                      borderColor: selectedDate === date.value ? '#7a9088' : 'rgba(114, 110, 102, 0.3)',
                      backgroundColor: selectedDate === date.value ? '#282622' : 'transparent',
                      color: selectedDate === date.value ? '#e0d8cc' : '#8a8680'
                    }}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            )}

            {/* Category Filter & Stats */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="px-3 py-1.5 rounded-lg border transition-all text-sm"
                  style={{
                    borderColor: selectedCategory === cat.value ? cat.color : 'rgba(114, 110, 102, 0.3)',
                    backgroundColor: selectedCategory === cat.value ? '#282622' : 'transparent',
                    color: selectedCategory === cat.value ? cat.color : '#8a8680'
                  }}
                >
                  {cat.label}
                  <span className="ml-1.5 opacity-60">
                    ({cat.value === 'all' ? stats.total : stats[cat.value as keyof typeof stats]})
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="rounded-xl border p-5 transition-all hover:border-[#7a9088] block"
                style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#282622' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{ backgroundColor: tagColors[item.tag].bg, color: tagColors[item.tag].text }}
                    >
                      {item.tag}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(114, 110, 102, 0.2)', color: '#b8b4aa' }}
                    >
                      {categories.find(c => c.value === item.category)?.label}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: '#8a8680' }}>{item.time}</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#e0d8cc' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#b8b4aa' }}>{item.summary}</p>
                <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(114, 110, 102, 0.2)' }}>
                  <span className="text-xs" style={{ color: '#8a8680' }}>{item.source}</span>
                  <svg className="w-4 h-4" style={{ color: '#7a9088' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p style={{ color: '#8a8680' }}>No news available for this date and category.</p>
            </motion.div>
          )}

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center text-sm"
            style={{ color: '#8a8680' }}
          >
            <p>Generated by ClawdBot | Last updated: {newsData.lastUpdated}</p>
          </motion.footer>
        </div>
      </div>
    </PageTransition>
  );
}
