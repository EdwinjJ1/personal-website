'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import { getAllNews, getBreakingNews, getNewsByCategory } from '@/data/newsPosts';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const categoryConfig = {
  ai: { label: 'AI News', color: '#7a9088', icon: '🤖' },
  research: { label: 'Research', color: '#6a8a8e', icon: '📚' },
  industry: { label: 'Industry', color: '#8a7a6a', icon: '🏢' },
  global: { label: 'Global', color: '#7a6a8a', icon: '🌍' }
};

export default function NewsPage() {
  const allNews = getAllNews();
  const breakingNews = getBreakingNews();
  const aiNews = getNewsByCategory('ai');
  const researchNews = getNewsByCategory('research');
  const industryNews = getNewsByCategory('industry');
  const globalNews = getNewsByCategory('global');

  return (
    <PageTransition>
      <div className="min-h-screen pt-20" style={{ color: '#e0d8cc' }}>
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6">
                <GradientText
                  colors={['#7a9088', '#6a8a8e', '#7a9088', '#6a8a8e', '#7a9088']}
                  animationSpeed={6}
                  showBorder={false}
                >
                  News Hub
                </GradientText>
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: '#b8b4aa' }}>
                AI industry developments, research breakthroughs, and tech news.
                Updated throughout the day from top sources.
              </p>
            </motion.div>

            {/* Breaking News */}
            {breakingNews.length > 0 && (
              <motion.div variants={item} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-3xl font-bold" style={{ color: '#e0d8cc' }}>Breaking News</h2>
                  <span className="px-3 py-1 text-sm font-bold rounded-full animate-pulse" 
                    style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)', color: '#fff' }}>
                    LIVE
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {breakingNews.slice(0, 4).map((news) => (
                    <Link key={news.id} href={`/news/${news.slug}`}>
                      <motion.article
                        variants={item}
                        className="rounded-xl overflow-hidden border transition-all duration-300 group cursor-pointer hover:scale-[1.02]"
                        style={{ 
                          background: 'linear-gradient(to bottom right, rgba(60, 35, 35, 0.6), rgba(45, 30, 30, 0.5), rgba(60, 35, 35, 0.6))', 
                          borderColor: 'rgba(220, 38, 38, 0.4)' 
                        }}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{categoryConfig[news.category].icon}</span>
                            <span className="text-sm font-semibold" style={{ color: '#dc2626' }}>
                              BREAKING
                            </span>
                            <span className="text-sm" style={{ color: '#8a8680' }}>
                              {news.source}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-[#7a9088]" style={{ color: '#e0d8cc' }}>
                            {news.title}
                          </h3>

                          <p className="mb-4 line-clamp-2 text-sm" style={{ color: '#b8b4aa' }}>
                            {news.excerpt}
                          </p>

                          <div className="flex justify-between items-center text-xs" style={{ color: '#8a8680' }}>
                            <time>{new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                            <span className="text-[#7a9088]">Read more →</span>
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Category Sections */}
            {(['ai', 'research', 'industry', 'global'] as const).map((category) => {
              const news = getNewsByCategory(category);
              const config = categoryConfig[category];
              
              return (
                <motion.div key={category} variants={item} className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">{config.icon}</span>
                    <h2 className="text-3xl font-bold" style={{ color: '#e0d8cc' }}>{config.label}</h2>
                    <span className="px-3 py-1 text-sm rounded-full border" 
                      style={{ borderColor: `${config.color}40`, color: config.color }}>
                      {news.length} stories
                    </span>
                  </div>

                  <div className="space-y-4">
                    {news.map((article) => (
                      <Link key={article.id} href={`/news/${article.slug}`}>
                        <motion.article
                          variants={item}
                          className="rounded-xl p-6 border transition-all duration-300 group cursor-pointer hover:border-[#7a9088]"
                          style={{ 
                            background: 'linear-gradient(to bottom right, rgba(40, 38, 34, 0.6), rgba(33, 30, 28, 0.5), rgba(40, 38, 34, 0.6))', 
                            borderColor: 'rgba(114, 110, 102, 0.3)' 
                          }}
                        >
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {article.breaking && (
                                  <span className="px-2 py-1 text-xs font-bold rounded" 
                                    style={{ background: '#dc262620', color: '#dc2626' }}>
                                    BREAKING
                                  </span>
                                )}
                                {article.featured && (
                                  <span className="px-2 py-1 text-xs rounded" 
                                    style={{ background: `${config.color}20`, color: config.color }}>
                                    Featured
                                  </span>
                                )}
                                <span className="text-xs" style={{ color: '#8a8680' }}>
                                  {article.source}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold mb-2 transition-colors group-hover:text-[#7a9088]" style={{ color: '#e0d8cc' }}>
                                {article.title}
                              </h3>

                              <p className="text-sm mb-3 line-clamp-2" style={{ color: '#b8b4aa' }}>
                                {article.excerpt}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {article.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs rounded-full border"
                                    style={{ backgroundColor: `${config.color}10`, color: config.color, borderColor: `${config.color}30` }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="md:text-right md:min-w-[120px]">
                              <time
                                className="block text-sm mb-1"
                                style={{ color: '#8a8680' }}
                              >
                                {new Date(article.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </time>
                              <span className="text-xs group-hover:text-[#7a9088] transition-colors" style={{ color: '#8a8680' }}>
                                Read more →
                              </span>
                            </div>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Stats */}
            <motion.div variants={item} className="mt-20">
              <div className="rounded-2xl p-8 border" style={{ background: 'linear-gradient(to right, rgba(122, 144, 136, 0.1), rgba(106, 138, 142, 0.1))', borderColor: 'rgba(122, 144, 136, 0.3)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#7a9088' }}>{allNews.length}</div>
                    <div className="text-sm" style={{ color: '#b8b4aa' }}>Total Stories</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#dc2626' }}>{breakingNews.length}</div>
                    <div className="text-sm" style={{ color: '#b8b4aa' }}>Breaking</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#6a8a8e' }}>{aiNews.length}</div>
                    <div className="text-sm" style={{ color: '#b8b4aa' }}>AI News</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: '#8a7a6a' }}>{researchNews.length}</div>
                    <div className="text-sm" style={{ color: '#b8b4aa' }}>Research</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div variants={item} className="text-center mt-12">
              <p className="text-sm" style={{ color: '#8a8680' }}>
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
