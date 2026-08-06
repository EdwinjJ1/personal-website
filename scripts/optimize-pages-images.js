const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const photoDir = path.join(process.cwd(), 'out', 'images', 'photography');
const JPEG_EXTENSIONS = new Set(['.jpg', '.jpeg']);

async function optimize(file) {
  const source = path.join(photoDir, file);
  const temporary = `${source}.optimized`;
  const before = (await fs.stat(source)).size;

  await sharp(source)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(temporary);

  const after = (await fs.stat(temporary)).size;
  await fs.rename(temporary, source);
  return { before, after };
}

async function main() {
  try {
    const files = (await fs.readdir(photoDir)).filter((file) =>
      JPEG_EXTENSIONS.has(path.extname(file).toLowerCase()),
    );

    const results = await Promise.all(files.map(optimize));
    const before = results.reduce((total, result) => total + result.before, 0);
    const after = results.reduce((total, result) => total + result.after, 0);
    console.log(
      `Optimized ${files.length} photography originals for Pages: ${
        (before / 1024 / 1024).toFixed(1)
      } MB → ${(after / 1024 / 1024).toFixed(1)} MB`,
    );
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
