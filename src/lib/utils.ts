/**
 * Get the correct asset path with basePath for GitHub Pages
 * In production: /personal-website/path
 * In development: /path
 */
export function getAssetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/personal-website' : '';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
}

