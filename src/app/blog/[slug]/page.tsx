import React from 'react';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/data/blogPosts';
import BlogPostClient from './BlogPostClient';

// Generate static params for all blog posts at build time
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: `${post.title} · Evan Lin`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      authors: ['Evan Lin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} · Evan Lin`,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}

