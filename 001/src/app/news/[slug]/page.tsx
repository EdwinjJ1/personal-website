import React from 'react';
import type { Metadata } from 'next';
import { getAllNews, newsPosts } from '@/data/newsPosts';
import NewsPostClient from './NewsPostClient';

// Generate static params for all news posts at build time
export function generateStaticParams() {
  const posts = getAllNews();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = newsPosts.find((p) => p.slug === slug);
  if (!post) {
    return { title: 'News Not Found' };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: 'article',
      title: `${post.title} · Evan Lin`,
      description: post.excerpt,
      url: `/news/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} · Evan Lin`,
      description: post.excerpt,
    },
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  return <NewsPostClient />;
}
