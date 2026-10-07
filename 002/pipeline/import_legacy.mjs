// 把上一代网站（../001）里的内容导入新站：项目、博客、友链、新闻 → site/assets/data/*.json，
// 并把全部摄影作品写成清单（见 photos.mjs），交给 import_photos.py 去缩图。
//
//   node pipeline/import_legacy.mjs [旧站目录，默认 ../001]
//
// 旧站的数据是 TypeScript 文件，这里靠 Node 自带的类型擦除直接 import（需要 Node 23.6+）。
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeManifest } from './photos.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEGACY = resolve(ROOT, process.argv[2] || '../001');
const DATA = join(LEGACY, 'src/data');
const OUT = join(ROOT, 'site/assets/data');
const TMP = join(ROOT, 'build/legacy-tmp');

export const NEWS_PER_CATEGORY = 24;
export const NEWS_PER_DAY = 30;      // 日历档案里每天每个分类最多留几条（arXiv 一天能有几百篇）

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

/**
 * 新闻日历档案：按日期分组，每天每个分类最多 perDay 条（按时间倒序）。
 * 返回 { index: [{ d, n, c: { 分类: 条数 } }]（日期倒序）, days: { 日期: 条目[] } }。不改传入的数组。
 */
export function buildArchive(list, perDay = NEWS_PER_DAY) {
  const groups = new Map();
  [...list]
    .filter((n) => n.title && /^\d{4}-\d{2}-\d{2}$/.test(String(n.date || '')) && /^https?:\/\//.test(n.sourceUrl || n.url || ''))
    .sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')))
    .forEach((n) => {
      const category = String(n.category || 'ai').toLowerCase();
      const day = groups.get(n.date) || [];
      if (day.filter((x) => x.category === category).length >= perDay) return;
      groups.set(n.date, [...day, { title: clip(n.title, 140), url: n.sourceUrl || n.url, source: n.source || '', category, time: n.time || '', summary: clip(n.summary, 200) }]);
    });
  const dates = [...groups.keys()].sort().reverse();
  const count = (items) => items.reduce((acc, x) => ({ ...acc, [x.category]: (acc[x.category] || 0) + 1 }), {});
  return {
    index: dates.map((d) => ({ d, n: groups.get(d).length, c: count(groups.get(d)) })),
    days: Object.fromEntries(dates.map((d) => [d, groups.get(d)])),
  };
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

  // 日历档案：news/index.json + 每天一个文件，面板按日期懒加载
  const archive = buildArchive(raw.news || []);
  rmSync(join(OUT, 'news'), { recursive: true, force: true });
  mkdirSync(join(OUT, 'news'), { recursive: true });
  save('news/index.json', { updated: raw.lastUpdated || '', days: archive.index });
  Object.entries(archive.days).forEach(([date, items]) => save(`news/${date}.json`, items));

  const photos = await writeManifest(LEGACY, ROOT);
  writeFileSync(join(ROOT, 'build/project-images.json'), JSON.stringify(projectImages, null, 1));

  console.log(`news archive: ${archive.index.length} days, ${archive.index.reduce((sum, d) => sum + d.n, 0)} items`);
  console.log(`projects ${projects.length} · blog ${blog.length} · friends ${friends.length} · news ${news.length}/${(raw.news || []).length} · photos ${photos.length}`);
    console.log('categories:', [...new Set(news.map((n) => n.category))].join(','), '| photo cats:', [...new Set(photos.map((p) => p.category))].join(','));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
