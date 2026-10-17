// 命令行改日记：本地、AI、脚本都走这一个入口，说的是和网页同一个 Worker 接口。
//   JOURNAL_PASSWORD=<密码> node pipeline/journal.mjs list
//   ... get 2026-10-12
//   ... put 2026-10-12 notes.md            （整篇替换；文件名写 - 就读标准输入）
//   ... append 2026-10-12 "今天很专注" --section "我的感悟"
//   ... delete 2026-10-12
//   ... push private/journal               （把一个目录里的 <日期>.md 全部传上去）
// 地址默认是线上的 Worker，本地调试时设 JOURNAL_API=http://localhost:8787。

import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const DEFAULT_API = 'https://evanlin-api.jiaedwin0605.workers.dev';
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const USAGE = `用法：JOURNAL_PASSWORD=<密码> node pipeline/journal.mjs <命令>
  list                         列出所有日记
  get <日期>                   打印一篇
  put <日期> <文件|->          整篇替换
  append <日期> <文字> [--section <小节名>]   往某一节末尾加字
  delete <日期>
  push <目录>                  上传目录里所有 <日期>.md`;

export function parseArgs(argv) {
  const rest = [];
  let section;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--section') { section = argv[i + 1]; i += 1; } else rest.push(argv[i]);
  }
  return { command: rest[0], args: rest.slice(1), section };
}

/** 一次请求：成功返回 JSON；失败抛带 status 的错。 */
export async function request({ api, password, fetchImpl = fetch }, method, path, json) {
  const res = await fetchImpl(`${api}/journal${path}`, {
    method,
    headers: { Authorization: `Bearer ${password}`, ...(json === undefined ? {} : { 'Content-Type': 'application/json' }) },
    body: json === undefined ? undefined : JSON.stringify(json),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `http_${res.status}`), { status: res.status });
  return data;
}

const needDate = (date) => { if (!DATE.test(date ?? '')) throw new Error('日期要写成 YYYY-MM-DD'); return date; };
const readSource = (file) => (file === '-' ? readFileSync(0, 'utf8') : readFileSync(file, 'utf8'));

/** 执行一条命令，返回要打印的文字。 */
export async function run(ctx, { command, args, section }, read = readSource, list = readdirSync) {
  const call = (...a) => request(ctx, ...a);
  switch (command) {
    case 'list': return (await call('GET', '')).entries.map((e) => `${e.date}  ${(e.md.match(/^#\s+(.+)$/m) || [, ''])[1]}`).join('\n') || '（还没有日记）';
    case 'get': return (await call('GET', `/${needDate(args[0])}`)).md;
    case 'put': { await call('PUT', `/${needDate(args[0])}`, { md: read(args[1] ?? '-') }); return `已保存 ${args[0]}`; }
    case 'append': {
      if (!args[1]) throw new Error('要加的文字不能空');
      await call('POST', `/${needDate(args[0])}/append`, { text: args[1], section });
      return `已追加到 ${args[0]}${section ? `「${section}」` : ''}`;
    }
    case 'delete': { await call('DELETE', `/${needDate(args[0])}`); return `已删除 ${args[0]}`; }
    case 'push': {
      const files = list(args[0]).filter((f) => DATE.test(f.replace(/\.md$/, '')) && f.endsWith('.md')).sort();
      for (const f of files) await call('PUT', `/${f.slice(0, -3)}`, { md: read(`${args[0]}/${f}`) });
      return `已上传 ${files.length} 篇：${files.map((f) => f.slice(0, -3)).join(', ') || '无'}`;
    }
    default: throw new Error(USAGE);
  }
}

const proxied = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href && proxied && !process.env.NODE_USE_ENV_PROXY) {
  // 开着代理时 Node 的 fetch 默认不走它，会直接 "fetch failed"：带上 NODE_USE_ENV_PROXY=1 重跑自己一遍
  const { spawnSync } = await import('node:child_process');
  const child = spawnSync(process.execPath, process.argv.slice(1), { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(child.status ?? 1);
} else if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const password = process.env.JOURNAL_PASSWORD;
  if (!password) { console.error('先设置 JOURNAL_PASSWORD 环境变量。\n\n' + USAGE); process.exit(1); }
  run({ api: process.env.JOURNAL_API || DEFAULT_API, password }, parseArgs(process.argv.slice(2)))
    .then((text) => console.log(text))
    .catch((e) => { console.error(e.status === 401 ? '密码不对。' : e.status === 429 ? '试得太多，被暂时锁住了，过一会儿再来。' : e.message); process.exit(1); });
}
