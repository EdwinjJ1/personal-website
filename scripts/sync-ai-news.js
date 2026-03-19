#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE_ROOT = '/Users/edwinj/clawd/canvas';
const sourceRoot = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SOURCE_ROOT;
const dataFile = path.join(__dirname, '..', 'src', 'data', 'news-data.json');

const SOURCE_LABELS = [
  ['abc.net.au', 'ABC News Australia'],
  ['anthropic.com', 'Anthropic'],
  ['apnews.com', 'AP News'],
  ['arxiv.org', 'arXiv'],
  ['bbc.com', 'BBC'],
  ['blog.google', 'Google'],
  ['cnbc.com', 'CNBC'],
  ['courtlistener.com', 'CourtListener'],
  ['google.com', 'Google'],
  ['huggingface.co', 'Hugging Face'],
  ['ibm.com', 'IBM'],
  ['jiqizhixin.com', '机器之心'],
  ['meta.com', 'Meta'],
  ['mistral.ai', 'Mistral AI'],
  ['moltbook.com', 'Moltbook'],
  ['nvidia.com', 'NVIDIA'],
  ['nytimes.com', 'The New York Times'],
  ['openai.com', 'OpenAI'],
  ['palantir.com', 'Palantir'],
  ['reuters.com', 'Reuters'],
  ['smh.com.au', 'The Sydney Morning Herald'],
  ['theverge.com', 'The Verge'],
  ['tomshardware.com', "Tom's Hardware"],
  ['variety.com', 'Variety'],
  ['wsj.com', 'The Wall Street Journal'],
];

const SOURCE_CONFIGS = [
  {
    directory: 'ai-news',
    category: 'ai',
    parser: parseAiNewsFile,
  },
  {
    directory: 'arxiv-papers',
    category: 'research',
    parser: parseResearchFile,
  },
  {
    directory: 'industry-news',
    category: 'industry',
    parser: parseIndustryFile,
  },
  {
    directory: 'global-news',
    category: 'global',
    parser: parseGlobalFile,
  },
];

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function normalizeTitle(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizeSourceText(value) {
  return value.replace(/^source:\s*/i, '').trim();
}

function findFirstHref(block) {
  const match = block.match(/<a[^>]*href="([^"]+)"[^>]*>/i);
  return match ? match[1].trim() : '';
}

function inferSourceFromUrl(sourceUrl) {
  if (!sourceUrl) {
    return '';
  }

  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, '');
    for (const [host, label] of SOURCE_LABELS) {
      if (hostname === host || hostname.endsWith(`.${host}`)) {
        return label;
      }
    }

    return hostname
      .split('.')
      .slice(0, -1)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('.');
  } catch {
    return '';
  }
}

function formatDateLabel(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function extractTimeFromFilename(fileName) {
  const basename = path.basename(fileName, path.extname(fileName));
  const parts = basename.split(/[^0-9]+/).filter(Boolean);

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index];
    const candidate = part.length >= 6 ? part.slice(0, 4) : part;

    if (candidate.length !== 4) {
      continue;
    }

    if (index === 0 && /^20\d{2}$/.test(candidate)) {
      continue;
    }

    const hours = Number(candidate.slice(0, 2));
    const minutes = Number(candidate.slice(2, 4));

    if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
      continue;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  return null;
}

function convert12HourTime(time, meridiem) {
  const [rawHours, rawMinutes] = time.split(':').map(Number);
  let hours = rawHours % 12;
  if (meridiem.toUpperCase() === 'PM') {
    hours += 12;
  }
  return `${String(hours).padStart(2, '0')}:${String(rawMinutes).padStart(2, '0')}`;
}

function extractTimeFromContent(content) {
  const matches = [
    content.match(/Generated at\s+(\d{1,2}:\d{2})\s*(AM|PM)/i),
    content.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s+Update/i),
    content.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*report/i),
    content.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*\|/i),
    content.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*\)/i),
    content.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*\(/i),
  ];

  for (const match of matches) {
    if (match) {
      return convert12HourTime(match[1], match[2]);
    }
  }

  const twentyFourHourMatch = content.match(/(?:<title>|<h2[^>]*>)[^<]*\b(\d{2}:\d{2})\b/i);
  return twentyFourHourMatch ? twentyFourHourMatch[1] : null;
}

function getFileTime(filePath) {
  return extractTimeFromContent(fs.readFileSync(filePath, 'utf8')) || extractTimeFromFilename(path.basename(filePath)) || '00:00';
}

function createItem({ category, date, time, title, summary, tag, source, sourceUrl = '' }) {
  return {
    id: `${category}-${date.replace(/-/g, '')}-${time.replace(':', '')}-${slugify(title)}`,
    title,
    summary,
    tag,
    source: source || inferSourceFromUrl(sourceUrl) || 'Source',
    sourceUrl,
    date,
    time,
    category,
  };
}

function extractBlocks(content, className) {
  const pattern = new RegExp(
    `<div class="${className}">([\\s\\S]*?)</div>\\s*(?=<div class="${className}">|</div>\\s*</article>|</div>\\s*</body>)`,
    'gi'
  );
  return [...content.matchAll(pattern)].map((match) => match[1]);
}

function parseAiNewsFile(filePath, date) {
  const content = fs.readFileSync(filePath, 'utf8');
  const time = getFileTime(filePath);
  const items = [];
  const matches = content.matchAll(/<li[^>]*class="([^"]*\bnews-item\b[^"]*)"[^>]*>([\s\S]*?)<\/li>/gi);

  for (const match of matches) {
    const className = match[1] || '';
    const block = match[2] || '';
    const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const linkMatch = block.match(/<a[^>]*href="([^"]+)"[^>]*>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : '';
    const summary = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((entry) => stripTags(entry[1]))
      .filter(Boolean)[0];

    if (!title || !summary || !linkMatch) {
      continue;
    }

    items.push(
      createItem({
        category: 'ai',
        date,
        time,
        title,
        summary,
        tag: extractAiTag(className, block),
        source: inferSourceFromUrl(linkMatch[1].trim()),
        sourceUrl: linkMatch[1].trim(),
      })
    );
  }

  return items;
}

function parseResearchFile(filePath, date) {
  const content = fs.readFileSync(filePath, 'utf8');
  const time = getFileTime(filePath);
  const items = [];

  for (const block of extractBlocks(content, 'paper')) {
    const titleMatch = block.match(/<h3>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h3>/i);
    const summaryMatch = block.match(/<p[^>]*class="summary"[^>]*>([\s\S]*?)<\/p>/i);
    const fallbackArxivLink = block.match(/<a[^>]*class="arxiv-link"[^>]*href="([^"]+)"[^>]*>/i);

    if (!titleMatch || !summaryMatch) {
      continue;
    }

    items.push(
      createItem({
        category: 'research',
        date,
        time,
        title: stripTags(titleMatch[2]),
        summary: stripTags(summaryMatch[1]),
        tag: 'RESEARCH',
        source: 'arXiv',
        sourceUrl: fallbackArxivLink ? fallbackArxivLink[1].trim() : titleMatch[1].trim(),
      })
    );
  }

  return items;
}

function parseIndustryFile(filePath, date) {
  const content = fs.readFileSync(filePath, 'utf8');
  const time = getFileTime(filePath);
  const items = [];

  for (const block of extractBlocks(content, 'item')) {
    const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const summaryMatch = block.match(/<p[^>]*class="summary"[^>]*>([\s\S]*?)<\/p>/i);
    const tagMatch = block.match(/<span[^>]*class="[^"]*\btag\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : '';
    const summary = summaryMatch ? stripTags(summaryMatch[1]) : '';

    if (!title || !summary || /^previous update:/i.test(title)) {
      continue;
    }

    const sourceUrl = findFirstHref(block);
    items.push(
      createItem({
        category: 'industry',
        date,
        time,
        title,
        summary,
        tag: mapIndustryTag(tagMatch ? stripTags(tagMatch[1]) : ''),
        source: extractMetaSource(block, sourceUrl),
        sourceUrl,
      })
    );
  }

  return items;
}

function parseGlobalFile(filePath, date) {
  const content = fs.readFileSync(filePath, 'utf8');
  const time = getFileTime(filePath);
  const items = [];

  for (const block of extractBlocks(content, 'brief')) {
    const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const summaryMatch = block.match(/<p[^>]*class="summary"[^>]*>([\s\S]*?)<\/p>/i);
    const regionMatch = block.match(/<span[^>]*class="([^"]*\bregion\b[^"]*)"[^>]*>([\s\S]*?)<\/span>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : '';
    const summary = summaryMatch ? stripTags(summaryMatch[1]) : '';

    if (!title || !summary) {
      continue;
    }

    const sourceUrl = findFirstHref(block);
    items.push(
      createItem({
        category: 'global',
        date,
        time,
        title,
        summary,
        tag: mapGlobalTag(regionMatch ? regionMatch[1] : '', title, summary),
        source: extractMetaSource(block, sourceUrl),
        sourceUrl,
      })
    );
  }

  return items;
}

function extractAiTag(className, block) {
  const tagMatch = block.match(/<span[^>]*class="[^"]*\btag\b[^"]*"[^>]*>\s*\[?([A-Z]+)\]?\s*<\/span>/i);
  const text = tagMatch ? tagMatch[1].toUpperCase() : '';
  if (['BREAKING', 'PRODUCT', 'RESEARCH', 'POLICY'].includes(text)) {
    return text;
  }

  const tokens = className.toLowerCase().split(/\s+/);
  if (tokens.includes('breaking')) {
    return 'BREAKING';
  }
  if (tokens.includes('research')) {
    return 'RESEARCH';
  }
  if (tokens.includes('policy')) {
    return 'POLICY';
  }
  return 'PRODUCT';
}

function mapIndustryTag(tagText) {
  const normalized = tagText.toUpperCase();
  if (normalized.includes('POLICY') || normalized.includes('STRATEGY') || normalized.includes('PROTECTION')) {
    return 'POLICY';
  }
  if (normalized.includes('RESEARCH') || normalized.includes('PAPER')) {
    return 'RESEARCH';
  }
  if (normalized.includes('BREAKING')) {
    return 'BREAKING';
  }
  return 'PRODUCT';
}

function mapGlobalTag(regionClass, title, summary) {
  const className = regionClass.toLowerCase();
  if (className.includes('policy')) {
    return 'POLICY';
  }
  if (className.includes('breaking')) {
    return 'BREAKING';
  }

  const text = `${title} ${summary}`.toLowerCase();
  if (/(appoint|envoy|tariff|sanction|policy|reserve bank|interest rate|regulation|summons|diplom)/.test(text)) {
    return 'POLICY';
  }

  return 'BREAKING';
}

function extractMetaSource(block, sourceUrl) {
  const metaMatch = block.match(/<div[^>]*class="meta"[^>]*>([\s\S]*?)<\/div>/i);
  if (metaMatch) {
    const metaText = stripTags(metaMatch[1]);
    const sourceMatch = metaText.match(/Source:\s*([^|]+)/i);
    if (sourceMatch) {
      return normalizeSourceText(sourceMatch[1]);
    }
  }

  const sourceLinkText = block.match(/<a[^>]*class="source-link"[^>]*>([\s\S]*?)<\/a>/i);
  if (sourceLinkText) {
    return normalizeSourceText(stripTags(sourceLinkText[1]));
  }

  return inferSourceFromUrl(sourceUrl);
}

function sortNews(left, right) {
  return (
    right.date.localeCompare(left.date) ||
    right.time.localeCompare(left.time) ||
    left.category.localeCompare(right.category) ||
    left.title.localeCompare(right.title)
  );
}

function parseSourceDirectory(config) {
  const directoryPath = path.join(sourceRoot, config.directory);
  if (!fs.existsSync(directoryPath)) {
    return { items: [], replacedKeys: new Set() };
  }

  const datedDirs = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  const items = [];
  const replacedKeys = new Set();

  for (const date of datedDirs) {
    replacedKeys.add(`${config.category}:${date}`);

    const files = fs
      .readdirSync(path.join(directoryPath, date))
      .filter((file) => file.endsWith('.html'))
      .sort((left, right) => {
        const leftTime = extractTimeFromFilename(left) || left;
        const rightTime = extractTimeFromFilename(right) || right;
        return leftTime.localeCompare(rightTime) || left.localeCompare(right);
      });

    const byTitle = new Map();

    for (const file of files) {
      for (const item of config.parser(path.join(directoryPath, date, file), date)) {
        byTitle.set(normalizeTitle(item.title), item);
      }
    }

    items.push(...byTitle.values());
  }

  return { items, replacedKeys };
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    console.error(`Source root not found: ${sourceRoot}`);
    process.exit(1);
  }

  if (!fs.existsSync(dataFile)) {
    console.error(`Target data file not found: ${dataFile}`);
    process.exit(1);
  }

  const existingData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const parsedBySource = SOURCE_CONFIGS.map(parseSourceDirectory);
  const parsedItems = parsedBySource.flatMap((entry) => entry.items);
  const replacedKeys = new Set(parsedBySource.flatMap((entry) => [...entry.replacedKeys]));

  const preservedNews = (existingData.news || []).filter((item) => !replacedKeys.has(`${item.category}:${item.date}`));
  const news = [...parsedItems, ...preservedNews].sort(sortNews);
  const availableDates = [...new Set(news.map((item) => item.date))]
    .sort((left, right) => right.localeCompare(left))
    .map((date) => ({
      value: date,
      label: formatDateLabel(date),
    }));

  const output = {
    lastUpdated: new Date().toISOString(),
    availableDates,
    news,
  };

  fs.writeFileSync(dataFile, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Synced ${parsedItems.length} items across ${SOURCE_CONFIGS.length} source directories.`);
  console.log(`Preserved ${preservedNews.length} manually maintained items.`);
  console.log(`Updated ${dataFile}`);
}

main();
