'use client';

import Link from 'next/link';
import { posts } from '@/data/posts';
import BaseCard from './BaseCard';

interface BlogCardProps {
  delay?: number;
}

export default function BlogCard({ delay = 0.8 }: BlogCardProps) {
  const recentPosts = posts.slice(0, 2);

  return (
    <BaseCard size="md" hover={false} delay={delay} className="md:col-span-2 lg:col-span-7">
      <div className="flex h-full flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl text-teal-300">📝</span>
              Latest Writing
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Brief notes from my blog on engineering, AI, and creative practice.
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300 hover:border-teal-500/50 hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>

        <ul className="flex-1 space-y-2.5">
          {recentPosts.map((post) => (
            <li
              key={post.title}
              className="rounded-lg border border-gray-700/60 bg-gray-900/60 p-2 transition-all hover:border-teal-400/40 hover:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white line-clamp-2">{post.title}</h4>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400 line-clamp-2">{post.excerpt}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>{post.tags[0] ?? 'Update'}</span>
                <span>{post.readTime}</span>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1 self-start text-xs font-medium text-teal-200 hover:text-teal-100"
        >
          Read the blog
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </BaseCard>
  );
}
