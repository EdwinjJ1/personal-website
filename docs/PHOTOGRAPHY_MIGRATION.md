# Photography Migration: GitHub → Cloudflare R2

This guide walks through migrating photography images from GitHub to Cloudflare R2 CDN.

## Overview

**Before:** Images stored in `public/images/photography/` (213MB, served via GitHub Pages)
**After:** Images stored in Cloudflare R2 with global CDN acceleration

## Prerequisites

- Cloudflare account (free tier)
- rclone installed: `brew install rclone`
- Photography images currently in `public/images/photography/`

---

## Step 1: Create Cloudflare R2 Bucket

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 > Create Bucket**
3. Enter bucket name: `evanlin-photos` (or your preferred name)
4. Select location: **Asia-Pacific (APAC)** for Sydney users
5. Click **Create bucket**

---

## Step 2: Get R2 API Credentials

1. In Cloudflare Dashboard, go to **R2 > Overview**
2. Click **Manage R2 API Tokens**
3. Click **Create API Token**
4. Select permissions:
   - **Object Read & Write**
5. Copy the values (you'll need these for rclone):
   - **Account ID** (from URL or dashboard)
   - **Access Key ID**
   - **Secret Access Key**

---

## Step 3: Configure rclone

```bash
# Start rclone configuration
rclone config

# Follow prompts:
# - Name: r2
# - Type: S3
# - Provider: Other
# - Endpoint: https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com
# - Access Key ID: <R2_ACCESS_KEY_ID>
# - Secret Access Key: <R2_SECRET_ACCESS_KEY>
# - Region: auto
# - ACL: (leave blank)
# - Advanced config: (say no)
```

---

## Step 4: Upload Images to R2

```bash
# From project root
./scripts/sync-photos-to-r2.sh
```

Or manually:
```bash
rclone copy ./public/images/photography/ r2:evanlin-photos/photography/ --progress
```

---

## Step 5: Configure Custom Domain (Optional but Recommended)

1. In R2 bucket, click **Settings**
2. Scroll to **Public Access** and click **Enable**
3. Click **Add Custom Domain**
4. Enter: `images.evanlin.site` (or your subdomain)
5. Click **Add Domain** - Cloudflare will automatically configure DNS and SSL

Your images will be available at:
```
https://images.evanlin.site/photography/P1032761.JPG
```

---

## Step 6: Configure Environment Variables

Create `.env.local` in your project root:

```bash
# .env.local
NEXT_PUBLIC_CDN_URL=https://images.evanlin.site
```

Or use R2's public URL (if not using custom domain):
```bash
NEXT_PUBLIC_CDN_URL=https://pub-<account-id>.r2.dev
```

---

## Step 7: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000/photography` and verify:
- All thumbnail images load
- Lightbox opens with full-size images
- No broken images in browser DevTools Network tab

---

## Step 8: Build and Deploy

```bash
# Build
npm run build

# Commit and push
git add .
git commit -m "feat(photography): migrate to Cloudflare R2 CDN"
git push
```

---

## Verification Checklist

After deployment, verify:

- [ ] All images load on production site
- [ ] Image loading is faster than before (check DevTools Network tab)
- [ ] Mobile, tablet, desktop responsive layouts work
- [ ] All features work: filtering, lightbox, zoom, navigation, sharing
- [ ] CDN usage is showing in Cloudflare dashboard

---

## Workflow: Adding New Photos

### Option A: From Camera/NAS

```bash
# 1. Copy new photos to NAS (backup)
cp /new/photos/*.JPG /path/to/nas/photography/

# 2. Sync to R2
./scripts/sync-photos-to-r2.sh

# 3. Update photo metadata
# Edit src/data/Photography.ts - add new photo entries

# 4. Build and deploy
npm run build && git push
```

### Option B: Direct Upload via Cloudflare Dashboard

1. Go to R2 bucket in Cloudflare Dashboard
2. Navigate to `photography/` folder
3. Click **Upload** and select images
4. Update `src/data/Photography.ts`
5. Build and deploy

---

## Troubleshooting

### Images not loading
- Check `.env.local` has correct `NEXT_PUBLIC_CDN_URL`
- Verify R2 bucket is public (not private)
- Check `next.config.ts` has correct domain configuration

### rclone errors
- Verify API credentials are correct
- Check Account ID matches your Cloudflare account
- Ensure bucket name is correct

### CORS errors (if implementing fetch)
- Add CORS policy in R2 bucket settings

---

## Cost Analysis

| Plan | Free Tier | Your Usage | Cost |
|------|-----------|------------|------|
| **Storage** | 10 GB | ~213 MB | **$0** |
| **Class A Operations** | 1M/month | ~100 uploads | **$0** |
| **Class B Operations** | 10M/month | ~19,000 downloads | **$0** |
| **Egress (outbound)** | **Unlimited** | ~50GB/month | **$0** |

**Total monthly cost: $0** (well within free tier)

---

## Rollback Plan

If issues occur, you can quickly revert:

```bash
# Update .env.local
NEXT_PUBLIC_CDN_URL=

# Or revert code changes
git revert HEAD
npm run build && git push
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/lib/imageUtils.ts` | New: CDN URL utilities |
| `src/app/photography/page.tsx` | Updated to use CDN URLs |
| `next.config.ts` | Added R2 domain config |
| `.env.example` | Added CDN_URL variable |
| `scripts/sync-photos-to-r2.sh` | New: Sync script |
| `src/data/Photography.ts` | No changes needed |
