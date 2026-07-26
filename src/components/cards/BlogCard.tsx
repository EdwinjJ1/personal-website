'use client';

import Link from 'next/link';
import { getPrimaryPosts } from '@/data/blogPosts';
import BaseCard from './BaseCard';

interface BlogCardProps {
  delay?: number;
}

export default function BlogCard({ delay = 0.8 }: BlogCardProps) {
  // Get original posts and take the 2 most recent
  const recentPosts = getPrimaryPosts().slice(0, 2);

  return (
    <BaseCard size="md" hover={false} delay={delay} className="md:col-span-2 lg:col-span-7">
      <div className="flex h-full flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--p-ink))' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--p-sage))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Latest Writing
            </h3>
            <p className="text-sm mt-1" style={{ color: 'rgb(var(--p-ink-mid))' }}>
              Brief notes from my blog on engineering, AI, and creative practice.
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-full border px-3 py-1 text-xs transition-colors hover:border-sage"
            style={{ borderColor: 'rgb(var(--p-line) / 0.3)', color: 'rgb(var(--p-ink-mid))' }}
          >
            View all
          </Link>
        </div>

        <ul className="flex-1 min-h-0 space-y-2.5 overflow-hidden">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <li
                className="rounded-lg border p-2 transition-all hover:border-sage cursor-pointer"
                style={{ borderColor: 'rgb(var(--p-line) / 0.3)', backgroundColor: 'rgb(var(--p-surface-2))' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold line-clamp-1" style={{ color: 'rgb(var(--p-ink))' }}>
                    {post.title}
                  </h4>
                  <span className="text-xs whitespace-nowrap" style={{ color: 'rgb(var(--p-ink-dim))' }}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="mt-1.5 text-xs line-clamp-1" style={{ color: 'rgb(var(--p-ink-mid))' }}>{post.excerpt}</p>
                <div className="mt-1.5 flex items-center justify-between text-[11px]" style={{ color: 'rgb(var(--p-ink-dim))' }}>
                  <span>{post.tags[0] ?? 'Update'}</span>
                  <span>{post.readTime}</span>
                </div>
              </li>
            </Link>
          ))}
        </ul>

      </div>
    </BaseCard>
  );
}
