import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    // Cloudflare R2 CDN domain for photography images
    // Set NEXT_PUBLIC_CDN_URL in .env.local (e.g., https://images.evanlin.site)
    domains: process.env.NEXT_PUBLIC_CDN_URL
      ? [new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname]
      : [],
    remotePatterns: process.env.NEXT_PUBLIC_CDN_URL
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
            pathname: '/photography/**',
          },
        ]
      : [],
  },
};

export default nextConfig;
