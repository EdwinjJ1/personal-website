// 把上一代网站（../001）里的内容导入新站：项目、博客、友链、新闻 → site/assets/data/*.json，
// 并挑一组摄影作品写成清单，交给 import_photos.py 去缩图。
//
//   node pipeline/import_legacy.mjs [旧站目录，默认 ../001]
//
// 旧站的数据是 TypeScript 文件，这里靠 Node 自带的类型擦除直接 import（需要 Node 23.6+）。
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEGACY = resolve(ROOT, process.argv[2] || '../001');
const DATA = join(LEGACY, 'src/data');
const OUT = join(ROOT, 'site/assets/data');
const TMP = join(ROOT, 'build/legacy-tmp');

export const NEWS_PER_CATEGORY = 24;
export const PHOTO_LIMIT = 24;

const load = (file) => import(pathToFileURL(file).href);
const firstArray = (mod, key) => Object.values(mod).find((v) => Array.isArray(v) && v.length && typeof v[0] === 'object' && key in v[0]) || [];
const clip = (text, n) => {
  // arXiv 的 RSS 摘要带一段固定前缀，去掉
  const t = String(text || '').replace(/\s+/g, ' ').trim().replace(/^arXiv:\S+\s+Announce Type:\s*\S+\s+Abstract:\s*/i, '');
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};
const save = (name, value) => writeFileSync(join(OUT, name), JSON.stringify(value));

const slug = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';

/** 旧站项目 → 新站字段，精选的排前面。image 是缩好之后的文件名（没有配图就是空串）。 */
export function mapProjects(list) {
  return [...list]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .map((p) => ({
      title: p.title, tagline: p.tagline || '', description: p.description, long: p.longDescription || '',
      highlights: p.highlights || [], metrics: (p.metrics || []).map((m) => ({ label: m.label, value: m.value })),
      tech: p.technologies || [], category: p.category, status: p.status, live: p.liveUrl || p.link || '', github: p.githubUrl || '',
      image: p.heroImage ? `${slug(p.title)}.webp` : '',
    }));
}

/** 新闻：每个分类取最近 perCategory 条再按日期倒序合并；字段名在旧数据里不统一，这里做一次归一。 */
export function mapNews(list, perCategory = NEWS_PER_CATEGORY) {
  const all = list
    .map((n) => ({
      title: clip(n.title, 140), url: n.url || n.link || n.sourceUrl || '', source: n.source || n.site || '',
      date: String(n.date || n.publishedAt || n.published || '').slice(0, 10), category: String(n.category || 'ai').toLowerCase(),
      summary: clip(n.summary || n.excerpt || n.description || '', 200),
    }))
    .filter((n) => n.title && /^https?:\/\//.test(n.url))
    .sort((a, b) => b.date.localeCompare(a.date));
  const seen = new Map();
  return all.filter((n) => {
    const count = seen.get(n.category) || 0;
    seen.set(n.category, count + 1);
    return count < perCategory;
  });
}

/** 摄影：精选优先，其余按分类轮流取，凑满 limit 张。 */
export function pickPhotos(list, limit = PHOTO_LIMIT) {
  const featured = list.filter((p) => p.featured);
  const byCat = new Map();
  list.filter((p) => !p.featured).forEach((p) => byCat.set(p.category, [...(byCat.get(p.category) || []), p]));
  const queues = [...byCat.values()];
  const rest = [];
  for (let i = 0; rest.length < list.length && queues.some((q) => q.length > i); i += 1) queues.forEach((q) => q[i] && rest.push(q[i]));
  return [...featured, ...rest].slice(0, limit);
}

async function loadPhotos() {
  // photography.ts 里有两处 Node 原生加载不了的写法：不带扩展名的 import、不带 type 的 JSON import。拷一份改掉再读。
  mkdirSync(TMP, { recursive: true });
  const patched = readFileSync(join(DATA, 'photography.ts'), 'utf8')
    .replace("from './photography-imported'", "from './photography-imported.ts'")
    .replace("from './photography-exif.json'", "from './photography-exif.json' with { type: 'json' }");
  writeFileSync(join(TMP, 'photography.ts'), patched);
  ['photography-imported.ts', 'photography-exif.json'].forEach((f) => writeFileSync(join(TMP, f), readFileSync(join(DATA, f))));
  return firstArray(await load(join(TMP, 'photography.ts')), 'image');
}

async function main() {
  if (!existsSync(DATA)) throw new Error(`找不到旧站数据目录：${DATA}`);
  mkdirSync(OUT, { recursive: true });

  const rawProjects = firstArray(await load(join(DATA, 'projects.ts')), 'technologies');
  const projects = mapProjects(rawProjects);
  save('projects.json', projects);
  const projectImages = rawProjects.filter((p) => p.heroImage).map((p) => ({ source: join(LEGACY, 'public', p.heroImage), out: `${slug(p.title)}.webp` }));

  const blog = firstArray(await load(join(DATA, 'blogPosts.ts')), 'slug')
    .map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content, date: p.date, readTime: p.readTime, tags: p.tags || [], language: p.language }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  save('blog.json', blog);

  const friends = firstArray(await load(join(DATA, 'friends.ts')), 'link').map((f) => ({ name: f.name, desc: f.desc, link: f.link }));
  save('friends.json', friends);

  const raw = JSON.parse(readFileSync(join(DATA, 'news-data.json'), 'utf8'));
  const news = mapNews(raw.news || []);
  save('news.json', { updated: raw.lastUpdated || '', items: news });

  const photos = pickPhotos(await loadPhotos()).map((p, i) => ({
    id: i + 1, title: p.title, location: p.location, category: p.category, date: p.date, camera: p.camera, settings: p.settings,
    description: p.description, source: join(LEGACY, 'public', p.image),
  }));
  mkdirSync(join(ROOT, 'build'), { recursive: true });
  writeFileSync(join(ROOT, 'build/photos-manifest.json'), JSON.stringify(photos, null, 1));
  writeFileSync(join(ROOT, 'build/project-images.json'), JSON.stringify(projectImages, null, 1));

  console.log(`projects ${projects.length} · blog ${blog.length} · friends ${friends.length} · news ${news.length}/${(raw.news || []).length} · photos ${photos.length}`);
    console.log('categories:', [...new Set(news.map((n) => n.category))].join(','), '| photo cats:', [...new Set(photos.map((p) => p.category))].join(','));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
