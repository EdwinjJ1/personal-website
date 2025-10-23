import React from 'react';
import { getAllPosts } from '@/data/blogPosts';
import BlogPostClient from './BlogPostClient';

// Generate static params for all blog posts at build time
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}

