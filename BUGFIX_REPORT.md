# Bug Fix Report - 2025-10-08

## 🐛 Issues Fixed

### Issue 1: React Minified Error #418 (Hydration Mismatch)
**Error Message:**
```
Uncaught Error: Minified React error #418
```

**Root Cause:**
The `ActivityCard` component was causing a hydration mismatch between server-side rendering (SSR) and client-side rendering (CSR). Here's what was happening:

1. **Server-side (during build)**: Component generates fallback data with pseudo-random values
2. **Client-side (in browser)**: Component immediately fetches real GitHub data and updates
3. **React detects mismatch**: The initial HTML from server doesn't match what React expects on client
4. **Result**: Hydration error #418

**Why This Happens:**
```javascript
// Server renders this:
<div>123 contributions</div>

// Client immediately changes to:
<div>10 contributions</div>

// React: "Wait, these don't match! Error!"
```

**Solution Implemented:**
Added a `isMounted` state to prevent rendering dynamic content until after hydration:

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Only fetch GitHub data after component is mounted
useEffect(() => {
  if (!isMounted) return;
  fetchGitHubActivity();
}, [isMounted]);

// Show loading state during SSR/hydration
if (!isMounted) {
  return <LoadingState />;
}
```

**How It Works:**
1. **Server renders**: Shows loading state with gray boxes
2. **Client mounts**: `isMounted` becomes `true`
3. **Fetch data**: GitHub API is called
4. **Update UI**: Real data replaces loading state
5. **No mismatch**: Server and client initial render match perfectly

**Files Modified:**
- `src/components/cards/ActivityCard.tsx`

---

### Issue 2: 404 Error for profile.jpg
**Error Message:**
```
Failed to load resource: the server responded with a status of 404 ()
profile.jpg:1 Failed to load resource: the server responded with a status of 404 ()
```

**Root Cause:**
Image paths were missing the `basePath` prefix required for GitHub Pages deployment.

**The Problem:**
```
Your site is deployed at: https://edwinjia1.github.io/personal-website/
                                                        ^^^^^^^^^^^^^^^^
                                                        This is the basePath

Image path in code: /profile.jpg
Browser tries to load: https://edwinjia1.github.io/profile.jpg ❌
Correct path should be: https://edwinjia1.github.io/personal-website/profile.jpg ✅
```

**Why This Happens:**
- `next.config.js` sets `basePath: '/personal-website'` for production
- Next.js automatically handles this for `<Link>` components
- But `<Image>` components with hardcoded paths don't get automatic prefix
- Result: Images try to load from root instead of `/personal-website/`

**Solution Implemented:**
Created a utility function to handle asset paths correctly:

```typescript
// src/lib/utils.ts
export function getAssetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' 
    ? '/personal-website' 
    : '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
}
```

**Usage:**
```typescript
// Before (❌ Broken on GitHub Pages):
<Image src="/profile.jpg" alt="Photo" />

// After (✅ Works everywhere):
import { getAssetPath } from '@/lib/utils';
<Image src={getAssetPath('profile.jpg')} alt="Photo" />
```

**How It Works:**
- **Development** (`npm run dev`): Returns `/profile.jpg`
- **Production** (GitHub Pages): Returns `/personal-website/profile.jpg`
- **Automatic**: No manual path changes needed

**Files Modified:**
- `src/lib/utils.ts` (new file)
- `src/components/cards/PhotographerCard.tsx`
- `src/app/photography/page.tsx`

---

## 📊 Technical Details

### Hydration Error Explained

**What is Hydration?**
```
1. Server builds static HTML
   └─> Sends to browser

2. Browser displays HTML (fast!)
   └─> User sees content immediately

3. React "hydrates" the HTML
   └─> Attaches event listeners
   └─> Makes it interactive

4. React compares:
   └─> Server HTML vs Client expectations
   └─> If different → Hydration error!
```

**Common Causes:**
- Date/time differences (server vs client timezone)
- Random data generation
- Browser-only APIs (localStorage, window)
- **Our case**: Async data fetching that changes content

**The Fix Pattern:**
```typescript
// ❌ Bad: Causes hydration mismatch
function Component() {
  const [data, setData] = useState(generateRandom());
  // Server generates one random value
  // Client generates different random value
  // → Mismatch!
}

// ✅ Good: Prevents hydration mismatch
function Component() {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(null);
  
  useEffect(() => setIsMounted(true), []);
  
  if (!isMounted) return <LoadingState />;
  // Server and client both show LoadingState
  // → No mismatch!
  
  return <RealContent data={data} />;
}
```

### GitHub Pages Path Resolution

**How GitHub Pages Works:**
```
Repository: EdwinJia1/personal-website
Deployed at: https://edwinjia1.github.io/personal-website/
                                          ^^^^^^^^^^^^^^^^
                                          Repository name becomes path
```

**Path Resolution:**
```
Absolute path: /profile.jpg
→ Browser resolves to: https://edwinjia1.github.io/profile.jpg
→ Result: 404 (file is in /personal-website/ subdirectory)

Correct path: /personal-website/profile.jpg
→ Browser resolves to: https://edwinjia1.github.io/personal-website/profile.jpg
→ Result: 200 (file found!)
```

**Next.js Configuration:**
```javascript
// next.config.js
{
  basePath: '/personal-website',  // Adds prefix to all routes
  assetPrefix: '/personal-website/',  // Adds prefix to _next/ assets
}
```

**What Gets Prefixed Automatically:**
- ✅ `<Link href="/about">` → `/personal-website/about`
- ✅ `router.push('/blog')` → `/personal-website/blog`
- ✅ `/_next/static/...` → `/personal-website/_next/static/...`

**What Doesn't Get Prefixed:**
- ❌ `<img src="/photo.jpg">` → Still `/photo.jpg`
- ❌ `<Image src="/photo.jpg">` → Still `/photo.jpg`
- ❌ `fetch('/api/data')` → Still `/api/data`

**Solution:** Use `getAssetPath()` helper for all public assets.

---

## ✅ Verification Steps

### 1. Check Hydration Error is Fixed
```
1. Open: https://edwinjia1.github.io/personal-website/
2. Press F12 → Console tab
3. Refresh page
4. Should NOT see: "Minified React error #418"
5. Should see: "📊 GitHub Events fetched: X"
```

### 2. Check Images Load Correctly
```
1. Open: https://edwinjia1.github.io/personal-website/
2. Press F12 → Network tab
3. Filter: "Img"
4. Refresh page
5. Check profile.jpg:
   - Status: 200 ✅
   - URL: .../personal-website/profile.jpg ✅
```

### 3. Check Photography Page
```
1. Visit: https://edwinjia1.github.io/personal-website/photography/
2. All 6 photos should load
3. No 404 errors in console
4. Click on photos → Modal opens correctly
```

### 4. Check Activity Card
```
1. Homepage → Find "GitHub Activity" card
2. Should see green dot 🟢 (real data)
3. Hover over squares → Shows contribution count
4. Console shows: "✅ Events in last 12 weeks: X/Y"
```

---

## 🚀 Deployment

**Changes Made:**
```bash
✓ Fixed hydration error in ActivityCard
✓ Created getAssetPath utility
✓ Updated all image paths
✓ Build successful
✓ Ready to deploy
```

**To Deploy:**
```bash
git add .
git commit -m "🐛 Fix hydration error and image 404 issues"
git push origin main
```

**Expected Results:**
- ✅ No React errors in console
- ✅ All images load correctly
- ✅ GitHub Activity Card works
- ✅ Photography page displays properly

---

## 📚 Lessons Learned

### 1. Always Handle Hydration
When fetching data client-side in a static site:
- Use `isMounted` pattern
- Show loading state during SSR
- Only fetch after mount

### 2. Test with basePath
When deploying to GitHub Pages:
- Always test with production build locally
- Use helper functions for asset paths
- Don't hardcode absolute paths

### 3. Check Browser Console
Both errors were visible in console:
- React error → Hydration issue
- 404 error → Path issue
- Always check console during development

---

## 🔧 Future Improvements

### For Activity Card:
- [ ] Add retry logic for failed API calls
- [ ] Cache GitHub data in localStorage
- [ ] Add skeleton loading animation
- [ ] Show more detailed error messages

### For Images:
- [ ] Add real photography images
- [ ] Implement image optimization
- [ ] Add lazy loading for photography grid
- [ ] Consider using Cloudinary for hosting

### For Error Handling:
- [ ] Add global error boundary
- [ ] Implement error tracking (Sentry)
- [ ] Add user-friendly error messages
- [ ] Create fallback UI for all components

---

**Fixed by**: Claude (Augment Agent)
**Date**: 2025-10-08
**Status**: ✅ Ready for deployment

