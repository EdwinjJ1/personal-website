/**
 * 私人日记：加密存在 KV 里，只有带对密码的请求才读得到、写得了。
 *
 * GET    /journal                  → { entries: [{ date, md }] }，新的在前（网页解锁时用它验证密码）
 * GET    /journal/<日期>            → { date, md }
 * PUT    /journal/<日期>  { md }    → 整篇替换（没有就新建）
 * POST   /journal/<日期>/append { text, section? } → 在某一节末尾加几行，没有这一节就新开；没有这篇就新建
 * DELETE /journal/<日期>
 *
 * 鉴权：Authorization: Bearer <密码>。密码和加密密钥都是 Worker 的 secret（JOURNAL_PASSWORD / JOURNAL_SECRET），不进仓库。
 * 存进去的是 AES-GCM 密文，密钥来自 JOURNAL_SECRET（随机长串），所以只猜 4 位密码是解不开 KV 里的东西的；
 * 猜密码只能在线上一次次试，同一个 IP 连错 8 次锁 15 分钟。
 */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PREFIX = 'entry:';
const MAX_MD = 100_000;
const MAX_FAILS = 8;
const LOCK_SECONDS = 900;

// ───────────────────────── 纯函数（有测试） ─────────────────────────

/** 在 `## section` 这一节的末尾加几行；没有这一节就在文末新开一节；没有 section 就直接接在文末。返回新字符串。 */
export function appendToSection(md, section, text) {
  const lines = String(md ?? '').replace(/\s+$/, '').split('\n');
  const add = String(text).trim().split(/\r?\n/);
  const name = String(section ?? '').trim();
  if (!name) return [...lines, '', ...add].join('\n').replace(/^\n+/, '') + '\n';
  const isHeading = (line) => /^#{1,6}\s/.test(line);
  const start = lines.findIndex((line) => /^##\s/.test(line) && line.replace(/^##\s+/, '').trim() === name);
  if (start < 0) return [...lines, '', `## ${name}`, '', ...add].join('\n').replace(/^\n+/, '') + '\n';
  const next = lines.findIndex((line, i) => i > start && isHeading(line));
  const end = next < 0 ? lines.length : next;
  let last = end;
  while (last > start + 1 && lines[last - 1].trim() === '') last -= 1;       // 插在这一节最后一行字的后面
  const body = lines.slice(start + 1, last).some((line) => line.trim());
  const insert = body ? add : ['', ...add];
  const tail = next < 0 ? [] : ['', ...lines.slice(next)];
  return [...lines.slice(0, last), ...insert, ...tail].join('\n') + '\n';
}

const b64 = (bytes) => btoa(String.fromCharCode(...bytes));
const unb64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function aesKey(secret) {
  const raw = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/** 明文 → "iv.密文"（都是 base64）。每次随机 iv。 */
export async function encrypt(plain, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(secret), new TextEncoder().encode(plain));
  return `${b64(iv)}.${b64(new Uint8Array(cipher))}`;
}

export async function decrypt(packed, secret) {
  const [iv, cipher] = String(packed).split('.');
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, await aesKey(secret), unb64(cipher));
  return new TextDecoder().decode(plain);
}

/** 不泄露长度和前缀的密码比较：先各自哈希成定长，再逐字节比。 */
export async function passwordOk(given, expected) {
  if (!expected) return false;
  const hash = async (s) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s))));
  const [a, b] = await Promise.all([hash(given), hash(expected)]);
  return a.reduce((diff, byte, i) => diff | (byte ^ b[i]), 0) === 0;
}

const bearer = (request) => (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');

// ───────────────────────── 请求处理 ─────────────────────────

const reply = (data, status, cors) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors } });

async function readEntry(env, date) {
  const packed = await env.JOURNAL.get(PREFIX + date);
  return packed == null ? null : decrypt(packed, env.JOURNAL_SECRET);
}

// 有哪几天单独记在一个键里：KV 的 list() 要过一分钟左右才看得到刚写的，单个键的读写是即时的。
// 老数据没有这个键时，用 list() 补一份。
const INDEX = 'index';
async function readIndex(env) {
  const saved = await env.JOURNAL.get(INDEX);
  if (saved != null) return JSON.parse(saved);
  const { keys } = await env.JOURNAL.list({ prefix: PREFIX });
  return keys.map((k) => k.name.slice(PREFIX.length));
}
async function updateIndex(env, date, present) {
  const dates = new Set(await readIndex(env));
  if (present) dates.add(date); else dates.delete(date);
  await env.JOURNAL.put(INDEX, JSON.stringify([...dates].sort().reverse()));
}

async function writeEntry(env, date, md) {
  await env.JOURNAL.put(PREFIX + date, await encrypt(md, env.JOURNAL_SECRET));
  await updateIndex(env, date, true);
}

async function body(request) {
  try { return await request.json(); } catch { return null; }
}

/** 先过鉴权，再按路径分发。返回 Response。 */
export async function handleJournal(request, env, cors, url) {
  if (!env.JOURNAL || !env.JOURNAL_PASSWORD || !env.JOURNAL_SECRET) return reply({ error: 'not_configured' }, 503, cors);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const failKey = `fail:${ip}`;
  const fails = Number(await env.JOURNAL.get(failKey)) || 0;
  if (fails >= MAX_FAILS) return reply({ error: 'too_many_attempts' }, 429, cors);
  if (!(await passwordOk(bearer(request), env.JOURNAL_PASSWORD))) {
    await env.JOURNAL.put(failKey, String(fails + 1), { expirationTtl: LOCK_SECONDS });
    return reply({ error: 'locked' }, 401, cors);
  }
  if (fails) await env.JOURNAL.delete(failKey);

  const [, , date, action, ...extra] = url.pathname.split('/');   // ['', 'journal', date?, action?]
  if (extra.length || (date && !DATE.test(date))) return reply({ error: 'bad_date' }, 400, cors);
  const { method } = request;

  if (!date) {
    if (method !== 'GET') return reply({ error: 'method_not_allowed' }, 405, cors);
    const dates = [...(await readIndex(env))].sort().reverse();
    const entries = await Promise.all(dates.map(async (d) => ({ date: d, md: await readEntry(env, d) })));
    return reply({ entries: entries.filter((e) => e.md != null) }, 200, cors);
  }

  if (action === 'append') {
    if (method !== 'POST') return reply({ error: 'method_not_allowed' }, 405, cors);
    const input = await body(request);
    if (typeof input?.text !== 'string' || !input.text.trim()) return reply({ error: 'empty_text' }, 400, cors);
    const current = (await readEntry(env, date)) ?? `# ${date}\n`;
    const md = appendToSection(current, input.section, input.text);
    if (md.length > MAX_MD) return reply({ error: 'too_long' }, 413, cors);
    await writeEntry(env, date, md);
    return reply({ date, md }, 200, cors);
  }
  if (action) return reply({ error: 'not_found' }, 404, cors);

  if (method === 'GET') {
    const md = await readEntry(env, date);
    return md == null ? reply({ error: 'not_found' }, 404, cors) : reply({ date, md }, 200, cors);
  }
  if (method === 'PUT') {
    const input = await body(request);
    if (typeof input?.md !== 'string') return reply({ error: 'invalid_body' }, 400, cors);
    if (input.md.length > MAX_MD) return reply({ error: 'too_long' }, 413, cors);
    await writeEntry(env, date, input.md);
    return reply({ date, md: input.md }, 200, cors);
  }
  if (method === 'DELETE') {
    await env.JOURNAL.delete(PREFIX + date);
    await updateIndex(env, date, false);
    return reply({ date, deleted: true }, 200, cors);
  }
  return reply({ error: 'method_not_allowed' }, 405, cors);
}
