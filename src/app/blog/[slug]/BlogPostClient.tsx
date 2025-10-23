'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { getPostBySlug, getTranslation, type BlogPost } from '@/data/blogPosts';

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

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  // Get the initial post (English by default)
  const initialPost = getPostBySlug(slug);
  
  // State to manage current language
  const [currentPost, setCurrentPost] = useState<BlogPost | undefined>(initialPost);
  
  if (!currentPost) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 flex items-center justify-center" style={{ color: '#e0d8cc' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-[#7a9088] hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Get translation if available
  const translation = getTranslation(currentPost);
  const hasTranslation = !!translation;

  // Toggle language
  const toggleLanguage = () => {
    if (translation) {
      setCurrentPost(translation);
    }
  };

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
            {/* Back Button */}
            <motion.div variants={item} className="mb-8">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#7a9088]"
                style={{ color: '#b8b4aa' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </motion.div>

            {/* Article Header */}
            <motion.article variants={item}>
              {/* Language Toggle Button */}
              {hasTranslation && (
                <div className="flex justify-end mb-6">
                  <button
                    onClick={toggleLanguage}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: 'rgba(122, 144, 136, 0.1)', 
                      borderColor: 'rgba(122, 144, 136, 0.3)',
                      color: '#7a9088'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    {currentPost.language === 'en' ? '中文' : 'English'}
                  </button>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full border"
                    style={{ 
                      backgroundColor: 'rgba(122, 144, 136, 0.15)', 
                      color: '#7a9088', 
                      borderColor: 'rgba(122, 144, 136, 0.3)' 
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#e0d8cc' }}>
                {currentPost.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-8 text-sm" style={{ color: '#8a8680' }}>
                <time dateTime={currentPost.date}>
                  {new Date(currentPost.date).toLocaleDateString(
                    currentPost.language === 'en' ? 'en-US' : 'zh-CN',
                    { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }
                  )}
                </time>
                <span>•</span>
                <span>{currentPost.readTime}</span>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-12" style={{ backgroundColor: 'rgba(114, 110, 102, 0.3)' }} />

              {/* Content */}
              <div 
                className="prose prose-invert prose-lg max-w-none"
                style={{ color: '#e0d8cc' }}
              >
                {currentPost.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-relaxed" style={{ color: '#b8b4aa' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full h-px my-12" style={{ backgroundColor: 'rgba(114, 110, 102, 0.3)' }} />

              {/* Author Info */}
              <div className="rounded-xl p-6 border" style={{ 
                background: 'linear-gradient(to bottom right, rgba(40, 38, 34, 0.6), rgba(33, 30, 28, 0.5), rgba(40, 38, 34, 0.6))', 
                borderColor: 'rgba(114, 110, 102, 0.3)' 
              }}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ 
                    background: 'linear-gradient(to right, #7a9088, #6a8a8e)' 
                  }}>
                    👨‍💻
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#e0d8cc' }}>
                      Evanlin
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#b8b4aa' }}>
                      {currentPost.language === 'en'
                        ? 'Interested in AI and its future.'
                        : '对AI感兴趣。'
                      }
                    </p>
                    <div className="flex gap-3">
                      <a 
                        href="mailto:jiaedwin0605@gmail.com" 
                        className="text-sm transition-colors hover:text-[#7a9088]"
                        style={{ color: '#8a8680' }}
                      >
                        {currentPost.language === 'en' ? 'Contact' : '联系我'}
                      </a>
                      <span style={{ color: '#8a8680' }}>•</span>
                      <Link 
                        href="/about" 
                        className="text-sm transition-colors hover:text-[#7a9088]"
                        style={{ color: '#8a8680' }}
                      >
                        {currentPost.language === 'en' ? 'About Me' : '关于我'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Navigation */}
            <motion.div variants={item} className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}
              >
                {currentPost.language === 'en' ? 'View All Posts' : '查看所有文章'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

