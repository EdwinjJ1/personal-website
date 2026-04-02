'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ScatterText from '@/components/ScatterText';
import ClientOnlyParticles from '@/components/ClientOnlyParticles';
import newsData from '@/data/news-data.json';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tag: 'BREAKING' | 'PRODUCT' | 'RESEARCH' | 'POLICY';
  source: string;
  sourceUrl?: string;
  date: string;
  time: string;
  category: 'ai' | 'research' | 'industry' | 'global';
}

interface CalendarCell {
  date: string | null;
  dayNumber: number | null;
  isAvailable: boolean;
}

const categories = [
  { value: 'all', label: 'All', color: '#7a9088' },
  { value: 'ai', label: 'AI News', color: '#00d4ff' },
  { value: 'research', label: 'Research', color: '#a78bfa' },
  { value: 'industry', label: 'Industry', color: '#22c55e' },
  { value: 'global', label: 'Global', color: '#f59e0b' },
];

const calendarCategories = categories.filter((category) => category.value !== 'all');

const tagColors = {
  BREAKING: { bg: '#dc2626', text: '#fff' },
  PRODUCT: { bg: '#2563eb', text: '#fff' },
  RESEARCH: { bg: '#16a34a', text: '#fff' },
  POLICY: { bg: '#d97706', text: '#fff' },
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMonthKey(date: string) {
  return date.slice(0, 7);
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function buildCalendarCells(monthKey: string, availableDateSet: Set<string>): CalendarCell[] {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingEmpty = (firstDay.getUTCDay() + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let i = 0; i < leadingEmpty; i += 1) {
    cells.push({ date: null, dayNumber: null, isAvailable: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthKey}-${String(day).padStart(2, '0')}`;
    cells.push({
      date,
      dayNumber: day,
      isAvailable: availableDateSet.has(date),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, dayNumber: null, isAvailable: false });
  }

  return cells;
}

export default function NewsPage() {
  const initialDate = newsData.availableDates[0]?.value || '2026-02-26';
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const news = newsData.news as NewsItem[];
  const availableDates = newsData.availableDates;
  const availableDateSet = new Set(availableDates.map((item) => item.value));
  const monthKeys = Array.from(new Set(availableDates.map((item) => getMonthKey(item.value))));
  const [visibleMonth, setVisibleMonth] = useState(getMonthKey(initialDate));

  const newsCountByDate = news.reduce<Record<string, number>>((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});
  const categoryCountByDate = news.reduce<Record<string, Record<string, number>>>((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { ai: 0, research: 0, industry: 0, global: 0 };
    }
    acc[item.date][item.category] += 1;
    return acc;
  }, {});

  const calendarCells = buildCalendarCells(visibleMonth, availableDateSet);
  const visibleMonthDates = availableDates.filter((item) => getMonthKey(item.value) === visibleMonth);
  const visibleMonthIndex = monthKeys.indexOf(visibleMonth);
  const selectedDateLabel = availableDates.find((item) => item.value === selectedDate)?.label || selectedDate;

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

  const selectMonth = (monthKey: string) => {
    const firstDateInMonth = availableDates.find((item) => getMonthKey(item.value) === monthKey)?.value;

    if (!firstDateInMonth) {
      return;
    }

    setVisibleMonth(monthKey);
    setSelectedDate(firstDateInMonth);
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
                  <ScatterText as="span" scatterRadius={45} rotationRange={12}>News Hub</ScatterText>
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
              <div
                className="rounded-2xl border p-3.5 mb-6"
                style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(33, 30, 28, 0.92)' }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {monthKeys.map((monthKey) => (
                    <button
                      key={monthKey}
                      onClick={() => selectMonth(monthKey)}
                      className="px-3 py-1.5 rounded-full border text-sm transition-all"
                      style={{
                        borderColor: visibleMonth === monthKey ? '#7a9088' : 'rgba(114, 110, 102, 0.3)',
                        backgroundColor: visibleMonth === monthKey ? '#282622' : 'transparent',
                        color: visibleMonth === monthKey ? '#e0d8cc' : '#8a8680',
                      }}
                    >
                      {formatMonthLabel(monthKey)}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: '#7a9088' }}>
                          Calendar View
                        </p>
                        <h2 className="text-lg font-semibold mt-1" style={{ color: '#e0d8cc' }}>
                          {formatMonthLabel(visibleMonth)}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const previousMonth = monthKeys[visibleMonthIndex + 1];
                            if (previousMonth) {
                              selectMonth(previousMonth);
                            }
                          }}
                          disabled={visibleMonthIndex === monthKeys.length - 1}
                          className="w-8 h-8 rounded-full border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
                          aria-label="Show older month"
                        >
                          <span aria-hidden="true">←</span>
                        </button>
                        <button
                          onClick={() => {
                            const nextMonth = monthKeys[visibleMonthIndex - 1];
                            if (nextMonth) {
                              selectMonth(nextMonth);
                            }
                          }}
                          disabled={visibleMonthIndex <= 0}
                          className="w-8 h-8 rounded-full border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
                          aria-label="Show newer month"
                        >
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="pb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em]"
                          style={{ color: '#8a8680' }}
                        >
                          {day}
                        </div>
                      ))}

                      {calendarCells.map((cell, index) => {
                        const isSelected = cell.date === selectedDate;
                        const itemCount = cell.date ? newsCountByDate[cell.date] || 0 : 0;
                        const categoryCounts = cell.date
                          ? categoryCountByDate[cell.date] || { ai: 0, research: 0, industry: 0, global: 0 }
                          : { ai: 0, research: 0, industry: 0, global: 0 };

                        return (
                          <button
                            key={cell.date || `empty-${index}`}
                            type="button"
                            onClick={() => {
                              if (!cell.date || !cell.isAvailable) {
                                return;
                              }
                              setSelectedDate(cell.date);
                              setVisibleMonth(getMonthKey(cell.date));
                            }}
                            disabled={!cell.isAvailable}
                            className="min-h-[56px] rounded-xl border px-2 py-1.5 text-left transition-all disabled:cursor-default"
                            style={{
                              borderColor: isSelected ? '#7a9088' : 'rgba(114, 110, 102, 0.18)',
                              backgroundColor: isSelected
                                ? '#282622'
                                : cell.isAvailable
                                  ? 'rgba(40, 38, 34, 0.75)'
                                  : 'rgba(24, 22, 20, 0.28)',
                              color: cell.isAvailable ? '#e0d8cc' : '#5f5b56',
                              opacity: cell.date ? 1 : 0.35,
                            }}
                          >
                            {cell.dayNumber && (
                              <div className="flex h-full flex-col justify-between">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-semibold">{cell.dayNumber}</span>
                                  {cell.isAvailable && (
                                    <span
                                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: isSelected ? 'rgba(122, 144, 136, 0.22)' : 'rgba(122, 144, 136, 0.12)',
                                        color: isSelected ? '#d8f3ea' : '#7a9088',
                                      }}
                                    >
                                      {itemCount}
                                    </span>
                                  )}
                                </div>

                                {cell.isAvailable && (
                                  <div className="mt-2 flex items-center gap-1">
                                    {calendarCategories.map((category) => (
                                      <span
                                        key={category.value}
                                        className="h-1.5 flex-1 rounded-full"
                                        style={{
                                          backgroundColor: categoryCounts[category.value] > 0 ? category.color : 'rgba(114, 110, 102, 0.22)',
                                          opacity: categoryCounts[category.value] > 0 ? 1 : 0.5,
                                        }}
                                        title={`${category.label}: ${categoryCounts[category.value] || 0}`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className="lg:w-[224px] rounded-2xl border p-3"
                    style={{ borderColor: 'rgba(114, 110, 102, 0.25)', backgroundColor: '#282622' }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: '#7a9088' }}>
                      Selected Day
                    </p>
                    <h3 className="text-base font-semibold mt-1.5" style={{ color: '#e0d8cc' }}>
                      {selectedDateLabel}
                    </h3>
                    <p className="text-xs mt-1.5" style={{ color: '#b8b4aa' }}>
                      {stats.total} stories available for this day.
                    </p>

                    <div className="mt-3 space-y-1.5">
                      {calendarCategories.map((cat) => (
                        <div
                          key={cat.value}
                          className="rounded-xl border px-3 py-2 flex items-center justify-between gap-3"
                          style={{ borderColor: 'rgba(114, 110, 102, 0.2)', backgroundColor: '#211e1c' }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            <div className="text-xs truncate" style={{ color: '#8a8680' }}>{cat.label}</div>
                          </div>
                          <div className="text-sm font-semibold shrink-0" style={{ color: cat.color }}>
                            {stats[cat.value as keyof typeof stats]}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(114, 110, 102, 0.2)' }}>
                      <p className="text-[11px]" style={{ color: '#8a8680' }}>
                        {visibleMonthDates.length} tracked days. Recent synced dates are mostly AI because the source folder is `ai-news`.
                      </p>
                    </div>
                  </div>
                </div>
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
            {filteredNews.map((item, i) => {
              const cardContent = (
                <>
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
                  <h3 className="font-semibold mb-2" style={{ color: '#e0d8cc' }}>
                    <ScatterText as="span" scatterRadius={25} rotationRange={8} staggerDelay={0.01}>{item.title}</ScatterText>
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#b8b4aa' }}>{item.summary}</p>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(114, 110, 102, 0.2)' }}>
                    <span className="text-xs" style={{ color: '#8a8680' }}>{item.source}</span>
                    {item.sourceUrl ? (
                      <svg className="w-4 h-4" style={{ color: '#7a9088' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    ) : (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(114, 110, 102, 0.2)', color: '#8a8680' }}
                      >
                        No link
                      </span>
                    )}
                  </div>
                </>
              );

              if (item.sourceUrl) {
                return (
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
                    {cardContent}
                  </motion.a>
                );
              }

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="rounded-xl border p-5"
                  style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#282622' }}
                >
                  {cardContent}
                </motion.div>
              );
            })}
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
