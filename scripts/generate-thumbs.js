#!/usr/bin/env node

/**
 * Generate WebP thumbnails for all photography images.
 *
 * Reads from:  public/images/photography/*.{JPG,jpg}
 * Writes to:   public/images/photography/thumbs/{name}.webp
 *
 * Thumbnail spec:
 *   - Max width: 600px (covers 2x retina for 300px display)
 *   - Format: WebP
 *   - Quality: 80
 *   - Expected output: ~30-80KB vs 12-39MB originals
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PHOTO_DIR = path.join(__dirname, '..', 'public', 'images', 'photography');
const THUMBS_DIR = path.join(PHOTO_DIR, 'thumbs');
const THUMB_WIDTH = 600;
const WEBP_QUALITY = 80;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

function ensureThumbsDir() {
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
  }
}

function getSourceFiles() {
  return fs.readdirSync(PHOTO_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext);
    })
    .map(file => ({
      input: path.join(PHOTO_DIR, file),
      output: path.join(THUMBS_DIR, `${path.parse(file).name}.webp`),
      name: file,
    }));
}

function needsGeneration(entry) {
  if (!fs.existsSync(entry.output)) return true;
  const srcStat = fs.statSync(entry.input);
  const thumbStat = fs.statSync(entry.output);
  return srcStat.mtimeMs > thumbStat.mtimeMs;
}

async function generateThumb(entry) {
  const start = Date.now();
  await sharp(entry.input)
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(entry.output);

  const srcSize = fs.statSync(entry.input).size;
  const thumbSize = fs.statSync(entry.output).size;
  const ratio = ((thumbSize / srcSize) * 100).toFixed(1);
  const elapsed = Date.now() - start;

  console.log(`  ${entry.name} → ${formatBytes(srcSize)} → ${formatBytes(thumbSize)} (${ratio}%) [${elapsed}ms]`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  ensureThumbsDir();
  const files = getSourceFiles();

  if (files.length === 0) {
    console.log('No source images found.');
    return;
  }

  console.log(`Found ${files.length} source images.`);

  const toGenerate = files.filter(needsGeneration);
  const skipped = files.length - toGenerate.length;

  if (skipped > 0) {
    console.log(`Skipping ${skipped} up-to-date thumbnails.`);
  }

  if (toGenerate.length === 0) {
    console.log('All thumbnails are up to date.');
    return;
  }

  console.log(`Generating ${toGenerate.length} thumbnails...\n`);

  let totalSrc = 0;
  let totalThumb = 0;

  for (const entry of toGenerate) {
    await generateThumb(entry);
    totalSrc += fs.statSync(entry.input).size;
    totalThumb += fs.statSync(entry.output).size;
  }

  console.log(`\nDone! ${toGenerate.length} thumbnails generated.`);
  console.log(`Total: ${formatBytes(totalSrc)} → ${formatBytes(totalThumb)} (${((totalThumb / totalSrc) * 100).toFixed(1)}%)`);
}

main().catch(err => {
  console.error('Error generating thumbnails:', err);
  process.exit(1);
});
