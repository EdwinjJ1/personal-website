// 摄影清单：旧站（../001）里的全部作品 → build/photos-manifest.json，交给 import_photos.py 去缩图。
// 网页上按分类归成合集（site/js/albums.js），所以这里一张都不挑；合集里的先后在这里排好。
//
//   node pipeline/photos.mjs [旧站目录，默认 ../001]
//
// 也被 import_legacy.mjs 调用；单独跑只更新摄影清单，不动项目、博客、新闻。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLACEHOLDERS = ['Unknown — WeChat export', 'EXIF unavailable'];       // 旧站给没有 EXIF 的照片填的占位字
const real = (text) => (PLACEHOLDERS.includes(text) ? '' : String(text || ''));

const BY_SERIES = ['Portrait', 'Her'];        // 这两个合集一场拍摄一场拍摄地看，先按系列排
const NO_SERIES = 90;
const seriesKey = (p) => (BY_SERIES.includes(p.category) ? p.seriesOrder ?? NO_SERIES : NO_SERIES);
/** '2026' / '2026-03' / '2026-03-09' 补成能直接比大小的字符串；没有日期的排最后。 */
const dateKey = (date) => {
  const [year = '0000', month = '00', day = '00'] = String(date || '').split('-');
  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * 合集里的先后：人像和 Her 先按拍摄系列（seriesOrder 小的在前），再按日期倒序；其他分类只按日期倒序。
 * 排不出先后的保持传入时的顺序。每个合集的第一张就是封面。不改传入的数组。
 */
export function orderPhotos(list) {
  return [...list].sort((a, b) => seriesKey(a) - seriesKey(b) || dateKey(b.date).localeCompare(dateKey(a.date)));
}

/**
 * 旧站的照片 → 清单条目。id 沿用旧站的（文件名就是它，增删照片不会让别的文件改名）。
 * 同一个 id 或同一张图只留第一条；缺图、缺标题、id 不是整数的丢掉。不改传入的数组。
 */
export function mapPhotos(list, publicDir) {
  const seen = new Set();
  return list.flatMap((p) => {
    const title = String(p?.title || '').trim();
    if (!p || !Number.isInteger(p.id) || !p.image || !title || seen.has(p.id) || seen.has(p.image)) return [];
    seen.add(p.id);
    seen.add(p.image);
    return [{
      id: p.id, title, location: p.location || '', category: p.category || 'Archive', date: String(p.date || ''),
      camera: real(p.camera), settings: real(p.settings), description: p.description || '', series: p.series || '',
      source: join(publicDir, p.image),
    }];
  });
}

/** photography.ts 里有两处 Node 原生加载不了的写法：不带扩展名的 import、不带 type 的 JSON import。拷一份改掉再读。 */
async function loadPhotos(legacy, tmp) {
  const data = join(legacy, 'src/data');
  mkdirSync(tmp, { recursive: true });
  const patched = readFileSync(join(data, 'photography.ts'), 'utf8')
    .replace("from './photography-imported'", "from './photography-imported.ts'")
    .replace("from './photography-exif.json'", "from './photography-exif.json' with { type: 'json' }");
  writeFileSync(join(tmp, 'photography.ts'), patched);
  ['photography-imported.ts', 'photography-exif.json'].forEach((f) => writeFileSync(join(tmp, f), readFileSync(join(data, f))));
  const mod = await import(pathToFileURL(join(tmp, 'photography.ts')).href);
  return mod.photos;
}

/** 读旧站 → 写 build/photos-manifest.json，返回清单。 */
export async function writeManifest(legacy, root = ROOT) {
  const photos = mapPhotos(orderPhotos(await loadPhotos(legacy, join(root, 'build/legacy-tmp'))), join(legacy, 'public'));
  mkdirSync(join(root, 'build'), { recursive: true });
  writeFileSync(join(root, 'build/photos-manifest.json'), JSON.stringify(photos, null, 1));
  return photos;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const photos = await writeManifest(resolve(ROOT, process.argv[2] || '../001'));
  const counts = photos.reduce((m, p) => ({ ...m, [p.category]: (m[p.category] || 0) + 1 }), {});
  console.log(`photos ${photos.length} ·`, Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(' · '));
}
