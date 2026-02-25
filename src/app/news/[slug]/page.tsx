import React from 'react';
import { getAllNews } from '@/data/newsPosts';
import NewsPostClient from './NewsPostClient';

// Generate static params for all news posts at build time
export function generateStaticParams() {
  const posts = getAllNews();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsPostClient />;
}
