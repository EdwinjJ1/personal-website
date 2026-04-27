#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const profileSrc = path.join(ROOT, 'public', 'profile.jpg');
const out = path.join(ROOT, 'public', 'og-image.png');

const W = 1200;
const H = 630;
const AVATAR = 320;
const AVATAR_X = 90;
const AVATAR_Y = (H - AVATAR) / 2;

async function buildAvatar() {
  const circle = Buffer.from(
    `<svg width="${AVATAR}" height="${AVATAR}"><circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2}" fill="white"/></svg>`
  );
  const ring = Buffer.from(
    `<svg width="${AVATAR + 12}" height="${AVATAR + 12}"><circle cx="${(AVATAR + 12) / 2}" cy="${(AVATAR + 12) / 2}" r="${AVATAR / 2 + 4}" fill="none" stroke="#7a9088" stroke-width="4"/></svg>`
  );

  const masked = await sharp(profileSrc)
    .resize(AVATAR, AVATAR, { fit: 'cover' })
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  return { masked, ring };
}

const bg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1816"/>
        <stop offset="100%" stop-color="#28221e"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.2" cy="0.5" r="0.6">
        <stop offset="0%" stop-color="#7a9088" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#7a9088" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </svg>`
);

const text = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .name { font: 700 92px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif; fill: #e0d8cc; }
      .tag  { font: 500 38px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif; fill: #7a9088; letter-spacing: 1px; }
      .url  { font: 400 28px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif; fill: #726e66; }
    </style>
    <text x="490" y="290" class="name">Evan Lin</text>
    <text x="494" y="350" class="tag">CS @ UNSW · AI · Builder</text>
    <text x="494" y="420" class="url">evanlin.site</text>
  </svg>`
);

(async () => {
  const { masked, ring } = await buildAvatar();
  await sharp(bg)
    .composite([
      { input: ring, left: AVATAR_X - 6, top: AVATAR_Y - 6 },
      { input: masked, left: AVATAR_X, top: AVATAR_Y },
      { input: text, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log('Wrote', out);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
