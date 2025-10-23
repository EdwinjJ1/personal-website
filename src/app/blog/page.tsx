'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import { getEnglishPosts } from '@/data/blogPosts';

// Get only English posts for display
const posts = getEnglishPosts();

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

export default function BlogPage() {
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
                  Blog
                </GradientText>
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: '#b8b4aa' }}>
                Thoughts on technology, entrepreneurship, and personal growth.
                Sharing insights from my journey as a student, developer, and former startup founder.
              </p>
            </motion.div>

            {/* Featured Posts */}
            <motion.div variants={item} className="mb-16">
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#e0d8cc' }}>Featured Posts</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {posts.filter(post => post.featured).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <motion.article
                      variants={item}
                      className="rounded-xl overflow-hidden border transition-all duration-300 group cursor-pointer hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(to bottom right, rgba(40, 38, 34, 0.6), rgba(33, 30, 28, 0.5), rgba(40, 38, 34, 0.6))', borderColor: 'rgba(114, 110, 102, 0.3)' }}
                    >
                      <div className="p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-sm rounded-full border"
                              style={{ backgroundColor: 'rgba(122, 144, 136, 0.15)', color: '#7a9088', borderColor: 'rgba(122, 144, 136, 0.3)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-2xl font-bold mb-4 transition-colors group-hover:text-[#7a9088]" style={{ color: '#e0d8cc' }}>
                          {post.title}
                        </h3>

                        <p className="mb-6 line-clamp-3" style={{ color: '#b8b4aa' }}>
                          {post.excerpt}
                        </p>

                        <div className="flex justify-between items-center text-sm" style={{ color: '#8a8680' }}>
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* All Posts */}
            <motion.div variants={item}>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#e0d8cc' }}>All Posts</h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <motion.article
                      variants={item}
                      className="rounded-xl p-6 border transition-all duration-300 group cursor-pointer hover:border-[#7a9088]"
                      style={{ background: 'linear-gradient(to bottom right, rgba(40, 38, 34, 0.6), rgba(33, 30, 28, 0.5), rgba(40, 38, 34, 0.6))', borderColor: 'rgba(114, 110, 102, 0.3)' }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full border"
                                style={{ backgroundColor: 'rgba(122, 144, 136, 0.1)', color: '#7a9088', borderColor: 'rgba(122, 144, 136, 0.2)' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-[#7a9088]" style={{ color: '#e0d8cc' }}>
                            {post.title}
                          </h3>

                          <p className="text-sm mb-3" style={{ color: '#b8b4aa' }}>
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="md:text-right md:min-w-0 md:ml-6">
                          <time
                            dateTime={post.date}
                            className="block text-sm mb-1"
                            style={{ color: '#8a8680' }}
                          >
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                          <span className="text-xs" style={{ color: '#8a8680' }}>{post.readTime}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div variants={item} className="mt-20">
              <div className="rounded-2xl p-8 border" style={{ background: 'linear-gradient(to right, rgba(122, 144, 136, 0.1), rgba(106, 138, 142, 0.1))', borderColor: 'rgba(122, 144, 136, 0.3)' }}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#e0d8cc' }}>Stay Updated</h3>
                  <p className="mb-6 max-w-md mx-auto" style={{ color: '#b8b4aa' }}>
                    Get notified when I publish new articles about technology, entrepreneurship, and personal insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ backgroundColor: 'rgba(40, 38, 34, 0.6)', borderColor: 'rgba(114, 110, 102, 0.3)', color: '#e0d8cc' }}
                    />
                    <button className="px-6 py-3 font-semibold rounded-lg transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}>
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}