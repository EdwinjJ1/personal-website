'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRouter() {
  const router = useRouter();

  useEffect(() => {
    // Handle GitHub Pages SPA routing
    const handleRouting = () => {
      const { search, pathname } = window.location;
      
      // Check if we have a redirect from 404.html
      if (search.startsWith('?/')) {
        const route = search.slice(2).replace(/~and~/g, '&');
        if (route && route !== '/') {
          router.replace(route);
        }
      }
    };

    handleRouting();
  }, [router]);

  return null;
}