/**
 * Image utility functions for Cloudflare R2 CDN
 *
 * This module provides URL construction functions for photography images
 * served from Cloudflare R2 with custom domain (e.g., images.evanlin.site).
 *
 * Setup:
 * 1. Create Cloudflare R2 bucket and upload photos to /photography/ folder
 * 2. Configure custom domain (optional) or use R2 public URL
 * 3. Set NEXT_PUBLIC_CDN_URL in .env.local
 */

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

/**
 * Extract filename from image path
 * @example extractFilename('/images/photography/P1032761.JPG') => 'P1032761.JPG'
 */
function extractFilename(imagePath: string): string {
  const parts = imagePath.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Get CDN URL for thumbnail images (grid view)
 * Currently returns full-size image - consider implementing R2 image transformations
 * for optimized thumbnails in the future.
 *
 * @param imagePath - Original image path from Photo data (e.g., '/images/photography/P1032761.JPG')
 * @returns Full CDN URL for the image
 *
 * @example
 * getThumbnailUrl('/images/photography/P1032761.JPG')
 * // => 'https://images.evanlin.site/photography/P1032761.JPG'
 */
export function getThumbnailUrl(imagePath: string): string {
  if (!CDN_BASE_URL) {
    // Fallback to local path if CDN not configured
    return imagePath;
  }
  const filename = extractFilename(imagePath);
  return `${CDN_BASE_URL}/photography/${filename}`;
}

/**
 * Get CDN URL for lightbox images (full-screen view)
 * Uses full-size images for maximum quality
 *
 * @param imagePath - Original image path from Photo data
 * @returns Full CDN URL for the image
 */
export function getLightboxUrl(imagePath: string): string {
  if (!CDN_BASE_URL) {
    return imagePath;
  }
  const filename = extractFilename(imagePath);
  return `${CDN_BASE_URL}/photography/${filename}`;
}

/**
 * Get CDN URL for original quality images
 * For future use: download link, sharing, or image editing features
 *
 * @param imagePath - Original image path from Photo data
 * @returns Full CDN URL for the image
 */
export function getOriginalUrl(imagePath: string): string {
  if (!CDN_BASE_URL) {
    return imagePath;
  }
  const filename = extractFilename(imagePath);
  return `${CDN_BASE_URL}/photography/${filename}`;
}

/**
 * Check if CDN is properly configured
 * Useful for conditional rendering or fallback logic
 */
export function isCdnConfigured(): boolean {
  return CDN_BASE_URL.length > 0;
}
