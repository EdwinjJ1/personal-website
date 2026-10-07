'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import { getPrimaryPosts } from '@/data/blogPosts';

// Get original posts for display without duplicating translations
const posts = getPrimaryPosts();

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
      <div className="min-h-screen pt-20" style={{ color: 'rgb(var(--p-ink))' }}>
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-16">
              <p className="type-eyebrow mb-3">Notes and essays</p>
              <h1 className="type-h1 mb-6">
                <GradientText
                  colors={['rgb(var(--p-sage))', 'rgb(var(--p-teal))', 'rgb(var(--p-sage))', 'rgb(var(--p-teal))', 'rgb(var(--p-sage))']}
                  animationSpeed={6}
                  showBorder={false}
                >
                  Blog
                </GradientText>
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                Thoughts on technology, entrepreneurship, and personal growth.
                Sharing insights from my journey as a student, developer, and former startup founder.
              </p>
            </motion.div>

            {/* Featured Posts */}
            <motion.div variants={item} className="mb-16">
              <h2 className="type-h2 mb-8">Featured Posts</h2>
              {/* h-full down the chain so the columns match height — the
                  cards used to end wherever their text did, leaving a hole. */}
              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {posts.filter(post => post.featured).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="h-full">
                    <motion.article
                      variants={item}
                      className="flex h-full flex-col rounded-xl overflow-hidden border border-line bg-surface-3/60 transition-all duration-300 group cursor-pointer hover:scale-[1.02] hover:border-line-strong"
                    >
                      <div className="flex h-full flex-col p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag} className="badge">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-ink transition-colors group-hover:text-sage">
                          {post.title}
                        </h3>

                        <p className="mb-6 line-clamp-3 text-ink-mid">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto flex justify-between items-center text-sm text-ink-dim">
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
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'rgb(var(--p-ink))' }}>
                All Posts
              </h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <motion.article
                      variants={item}
                      className="rounded-xl p-6 border transition-all duration-300 group cursor-pointer hover:border-sage"
                      style={{ background: 'linear-gradient(to bottom right, rgb(var(--p-surface-3) / 0.6), rgb(var(--p-surface-2) / 0.5), rgb(var(--p-surface-3) / 0.6))', borderColor: 'rgb(var(--p-line) / 0.3)' }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full border"
                                style={{ backgroundColor: 'rgb(var(--p-sage) / 0.1)', color: 'rgb(var(--p-sage))', borderColor: 'rgb(var(--p-sage) / 0.2)' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-sage" style={{ color: 'rgb(var(--p-ink))' }}>
                            {post.title}
                          </h3>

                          <p className="text-sm mb-3" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="md:text-right md:min-w-0 md:ml-6">
                          <time
                            dateTime={post.date}
                            className="block text-sm mb-1"
                            style={{ color: 'rgb(var(--p-ink-dim))' }}
                          >
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                          <span className="text-xs" style={{ color: 'rgb(var(--p-ink-dim))' }}>{post.readTime}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div variants={item} className="mt-20">
              <div className="rounded-2xl p-8 border" style={{ background: 'linear-gradient(to right, rgb(var(--p-sage) / 0.1), rgb(var(--p-teal) / 0.1))', borderColor: 'rgb(var(--p-sage) / 0.3)' }}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'rgb(var(--p-ink))' }}>
                    Stay Updated
                  </h3>
                  <p className="mb-6 max-w-md mx-auto" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                    Get notified when I publish new articles about technology, entrepreneurship, and personal insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ backgroundColor: 'rgb(var(--p-surface-3) / 0.6)', borderColor: 'rgb(var(--p-line) / 0.3)', color: 'rgb(var(--p-ink))' }}
                    />
                    <button className="px-6 py-3 font-semibold rounded-lg transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to right, rgb(var(--p-sage)), rgb(var(--p-teal)))', color: 'rgb(var(--p-ink))' }}>
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
