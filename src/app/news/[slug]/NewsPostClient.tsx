'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import { getNewsBySlug, getAllNews } from '@/data/newsPosts';

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

export default function NewsPostClient() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getNewsBySlug(slug);
  const allNews = getAllNews();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20" style={{ color: '#e0d8cc' }}>
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Article Not Found</h1>
              <p className="mb-8" style={{ color: '#b8b4aa' }}>
                The news article you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link 
                href="/news"
                className="px-6 py-3 rounded-lg font-semibold"
                style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}
              >
                ← Back to News
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const config = categoryConfig[post.category];
  const relatedNews = allNews
    .filter(n => n.category === post.category && n.id !== post.id)
    .slice(0, 3);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20" style={{ color: '#e0d8cc' }}>
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {/* Breadcrumb */}
            <motion.div variants={item} className="mb-8">
              <Link href="/news" className="text-sm hover:underline" style={{ color: '#7a9088' }}>
                ← Back to News
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div variants={item} className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-3xl">{config.icon}</span>
                <span 
                  className="px-3 py-1 text-sm font-semibold rounded-full"
                  style={{ background: `${config.color}20`, color: config.color }}
                >
                  {config.label}
                </span>
                {post.breaking && (
                  <span className="px-3 py-1 text-sm font-bold rounded-full animate-pulse" 
                    style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)', color: '#fff' }}>
                    BREAKING
                  </span>
                )}
                {post.featured && (
                  <span className="px-3 py-1 text-sm rounded-full border" 
                    style={{ borderColor: `${config.color}40`, color: config.color }}>
                    ★ Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <GradientText
                  colors={['#e0d8cc', '#d0c8bc', '#e0d8cc', '#d0c8bc', '#e0d8cc']}
                  animationSpeed={8}
                  showBorder={false}
                >
                  {post.title}
                </GradientText>
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#8a8680' }}>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>•</span>
                <a 
                  href={post.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#7a9088] transition-colors"
                >
                  Source: {post.source} ↗
                </a>
              </div>
            </motion.div>

            {/* Excerpt */}
            <motion.div variants={item} className="mb-12">
              <p className="text-xl leading-relaxed" style={{ color: '#b8b4aa' }}>
                {post.excerpt}
              </p>
            </motion.div>

            {/* Tags */}
            <motion.div variants={item} className="mb-12">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm rounded-full border"
                    style={{ backgroundColor: `${config.color}10`, color: config.color, borderColor: `${config.color}30` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.article 
              variants={item} 
              className="mb-16"
            >
              <div 
                className="prose prose-lg max-w-none"
                style={{ color: '#e0d8cc' }}
              >
                <div 
                  className="[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-[#e0d8cc]
                         [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-[#e0d8cc]
                         [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-[#b8b4aa]
                         [&>ul]:mb-6 [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:text-[#b8b4aa]
                         [&>ol]:mb-6 [&>ol]:pl-6 [&>ol>li]:mb-2 [&>ol>li]:text-[#b8b4aa]
                         [&>pre]:bg-[#1a1918] [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:mb-6 [&>pre]:overflow-x-auto
                         [&>code]:bg-[#2a2826] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
                         [&>blockquote]:border-l-4 [&>blockquote]:border-[#7a9088] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-[#b8b4aa]
                         [&>a]:text-[#7a9088] [&>a]:underline [&>a]:hover:text-[#6a8a8e]"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/- (.*)/g, '<li>$1</li>').replace(/(\d+)\. (.*)/g, '<li>$2</li>') }}
                />
              </div>
            </motion.article>

            {/* Source Link */}
            <motion.div variants={item} className="mb-16">
              <a 
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}
              >
                Read Original Article on {post.source} ↗
              </a>
            </motion.div>

            {/* Share */}
            <motion.div variants={item} className="mb-16 p-6 rounded-xl border" style={{ background: 'rgba(40, 38, 34, 0.4)', borderColor: 'rgba(114, 110, 102, 0.3)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#e0d8cc' }}>Share this article</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => currentUrl && navigator.clipboard.writeText(currentUrl)}
                  className="px-4 py-2 rounded-lg border text-sm transition-all hover:border-[#7a9088]"
                  style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
                >
                  📋 Copy Link
                </button>
                <a
                  href={currentUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border text-sm transition-all hover:border-[#7a9088]"
                  style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
                >
                  𝕏 Tweet
                </a>
              </div>
            </motion.div>

            {/* Related Articles */}
            {relatedNews.length > 0 && (
              <motion.div variants={item}>
                <h2 className="text-2xl font-bold mb-8" style={{ color: '#e0d8cc' }}>Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedNews.map((related) => (
                    <Link key={related.id} href={`/news/${related.slug}`}>
                      <article 
                        className="rounded-xl p-6 border transition-all duration-300 cursor-pointer hover:border-[#7a9088] h-full"
                        style={{ background: 'linear-gradient(to bottom right, rgba(40, 38, 34, 0.6), rgba(33, 30, 28, 0.5), rgba(40, 38, 34, 0.6))', borderColor: 'rgba(114, 110, 102, 0.3)' }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span>{categoryConfig[related.category].icon}</span>
                          <span className="text-xs" style={{ color: '#8a8680' }}>{related.source}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#e0d8cc' }}>
                          {related.title}
                        </h3>
                        <p className="text-sm line-clamp-2" style={{ color: '#b8b4aa' }}>
                          {related.excerpt}
                        </p>
                      </article>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Back to Top */}
            <motion.div variants={item} className="mt-16 text-center">
              <button
                onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm hover:underline"
                style={{ color: '#7a9088' }}
              >
                ↑ Back to top
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
