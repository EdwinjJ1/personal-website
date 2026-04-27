import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';
import { newsPosts } from '@/data/newsPosts';

export const dynamic = 'force-static';

const SITE_URL = 'https://evanlin.site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: Array<{ path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }> = [
    { path: '/',           changeFrequency: 'weekly',  priority: 1.0 },
    { path: '/about',      changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog',       changeFrequency: 'weekly',  priority: 0.9 },
    { path: '/news',       changeFrequency: 'daily',   priority: 0.9 },
    { path: '/projects',   changeFrequency: 'monthly', priority: 0.8 },
    { path: '/photography',changeFrequency: 'monthly', priority: 0.6 },
    { path: '/friends',    changeFrequency: 'monthly', priority: 0.5 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsPosts.map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...newsRoutes];
}
