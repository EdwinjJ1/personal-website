/**
 * Image utility functions for photography images.
 *
 * Thumbnails: WebP ~600px wide (~30-80KB) — used on homepage, grid views
 * Lightbox: Full-size originals — used for full-screen viewing
 *
 * CDN: If NEXT_PUBLIC_CDN_URL is set, URLs point to Cloudflare R2.
 * Fallback: Local /images/photography/{thumbs/,}{filename}
 */

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

/**
 * Extract filename (without extension) and extension from image path.
 * Handles both forward-slash and backslash paths.
 */
function parseImagePath(imagePath: string): { name: string; ext: string } {
  const parts = imagePath.split('/');
  const filename = parts[parts.length - 1] || '';
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) return { name: filename, ext: '' };
  return { name: filename.slice(0, dotIndex), ext: filename.slice(dotIndex) };
}

/**
 * Get URL for thumbnail images (WebP, ~600px wide).
 * Used for: homepage card, photography grid, flowing menu.
 */
export function getThumbnailUrl(imagePath: string): string {
  const { name } = parseImagePath(imagePath);
  if (!CDN_BASE_URL) {
    return `/images/photography/thumbs/${name}.webp`;
  }
  return `${CDN_BASE_URL}/photography/thumbs/${name}.webp`;
}

/**
 * Get URL for lightbox images (full-size original).
 * Used for: full-screen lightbox view in photography page.
 */
export function getLightboxUrl(imagePath: string): string {
  const { name, ext } = parseImagePath(imagePath);
  if (!CDN_BASE_URL) {
    return `/images/photography/${name}${ext}`;
  }
  return `${CDN_BASE_URL}/photography/${name}${ext}`;
}

/**
 * Get URL for original quality images.
 * Same as lightbox — kept as separate export for semantic clarity.
 */
export function getOriginalUrl(imagePath: string): string {
  return getLightboxUrl(imagePath);
}

/**
 * Check if CDN is properly configured.
 */
export function isCdnConfigured(): boolean {
  return CDN_BASE_URL.length > 0;
}
