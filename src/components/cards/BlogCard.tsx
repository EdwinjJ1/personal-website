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
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
              <span className="text-2xl" style={{ color: '#7a9088' }}>📝</span>
              Latest Writing
            </h3>
            <p className="text-sm mt-1" style={{ color: '#b8b4aa' }}>
              Brief notes from my blog on engineering, AI, and creative practice.
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-full border px-3 py-1 text-xs transition-colors"
            style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
          >
            View all
          </Link>
        </div>

        <ul className="flex-1 space-y-2.5">
          {recentPosts.map((post) => (
            <li
              key={post.title}
              className="rounded-lg border p-2 transition-all"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#211e1c' }}
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold line-clamp-2" style={{ color: '#e0d8cc' }}>{post.title}</h4>
                <span className="text-xs whitespace-nowrap" style={{ color: '#8a8680' }}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="mt-2 text-xs line-clamp-2" style={{ color: '#b8b4aa' }}>{post.excerpt}</p>
              <div className="mt-2 flex items-center justify-between text-[11px]" style={{ color: '#8a8680' }}>
                <span>{post.tags[0] ?? 'Update'}</span>
                <span>{post.readTime}</span>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1 self-start text-xs font-medium transition-colors"
          style={{ color: '#7a9088' }}
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
