/**
 * evanlin-api — Cloudflare Worker
 *
 * GET  /now-playing  → NetEase Cloud Music weekly top track (cookie stays server-side)
 * POST /chat         → streaming chat: Cloudflare Workers AI first (no key), any OpenAI-compatible provider as fallback
 * GET  /leetcode     → public LeetCode solve stats + recent accepted submissions
 */

import { toOpenAIStream } from './stream.js';

const SYSTEM_PROMPT = `You ARE Evan (贾岱林, Evan Jia), chatting as yourself on your personal website — the monitor on a desk that visitors can flip through ten comic-book universes.
Speak in FIRST PERSON, relaxed and natural, like texting a friend. Reply in the visitor's language (English or 中文). Keep it short: usually 1-3 sentences, under 80 words. Friendly but not over-eager; no formal assistant tone, no emoji spam.

About you:
- 20 years old, Computer Science at UNSW Sydney. AI product manager who also writes and ships the code.
- Now: AI PM intern at MOSI (上海模思智能) on MosMos, an AI voice assistant. You owned "ask about selected text + multi-turn + tool calling" for its voice agent and shipped the code yourself; you also built the Doubao fallback for meeting transcription and contributed to the MOSS-VL / Realtime API docs.
- Echo Agent (回声, echoagent.dev): a voice AI agent for Mac that you started and lead with a team of four. Press Fn+Space in any app, say it, and Echo answers or hands the work to Claude Code and Codex on the machine. It has a phone remote and a full backend, and was featured in the 61.7k-star Chinese indie developer list on GitHub five days after the first commit.
- Roundtable: an open-source visual workbench for multi-agent work (MIT). Athena: a Discord agent plus live knowledge graph that won the Susquehanna Prize at the UNSW × Mistral AI × Atlassian Hackathon. Lark Loom: Top 3 at the ByteDance Feishu AI Campus Challenge. Chiron Prompt: an open-source prompt enhancer for the terminal.
- PreUni (preuni.xyz): your university course notes, shared. Hypha: you founded it at 17 and led a team of seven; its core product passed ¥100K in single-day revenue.
- Also a photographer (street, portrait, architecture, wildlife) and you write about AI and agents on your blog. This site was modelled in Blender and rendered in ten styles.
- Contact: jiaedwin0605@gmail.com · GitHub: github.com/EdwinjJ1 · Open to opportunities.

Never invent facts beyond the above. You do not share a résumé file here; point people to email instead. If asked something unrelated to you or your work, answer briefly and naturally bring it back to your stuff.`;

const MAX_MESSAGES = 12;
const MAX_CONTENT_LENGTH = 2000;

/** Any localhost port counts as local development. */
function isLocalhost(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim());
  const permitted = allowed.includes(origin) || isLocalhost(origin);
  const allowOrigin = permitted ? origin : allowed[0] || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(data, status, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

async function handleNowPlaying(request, env, cors) {
  if (!env.NETEASE_UID || !env.NETEASE_COOKIE) {
    return json({ configured: false }, 200, cors);
  }

  // Edge-cache for 2 minutes so NetEase isn't hammered
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).origin + '/now-playing');
  const cached = await cache.match(cacheKey);
  if (cached) {
    const res = new Response(cached.body, cached);
    Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  try {
    const upstream = await fetch(
      `https://music.163.com/api/v1/play/record?uid=${encodeURIComponent(env.NETEASE_UID)}&type=1`,
      {
        headers: {
          'Referer': 'https://music.163.com/',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          'Cookie': `os=pc; ${env.NETEASE_COOKIE}`,
        },
      }
    );
    const data = await upstream.json();
    const entry = data && Array.isArray(data.weekData) ? data.weekData[0] : null;
    if (!entry || !entry.song) {
      return json({ configured: true, track: null, code: data && data.code }, 200, cors);
    }

    const song = entry.song;
    const artists = (song.ar || song.artists || []).map((a) => a.name).join(' / ');
    const album = song.al || song.album || {};
    const body = {
      configured: true,
      track: {
        title: song.name,
        artist: artists,
        album: album.name || '',
        cover: album.picUrl ? `${album.picUrl.replace(/^http:/, 'https:')}?param=120y120` : null,
        playCount: entry.playCount,
        period: 'week',
      },
    };

    const res = json(body, 200, { ...cors, 'Cache-Control': 'public, max-age=120' });
    await cache.put(cacheKey, res.clone());
    return res;
  } catch (err) {
    console.error('now-playing failed:', err);
    return json({ configured: true, track: null, error: 'upstream_failed' }, 502, cors);
  }
}

async function handleLeetCode(request, env, cors) {
  const username = env.LEETCODE_USERNAME;
  if (!username) {
    return json({ configured: false }, 200, cors);
  }

  // LeetCode data changes at most a few times a day — edge-cache for 1 hour
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).origin + '/leetcode');
  const cached = await cache.match(cacheKey);
  if (cached) {
    const res = new Response(cached.body, cached);
    Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const query = `
    query($username: String!, $limit: Int!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
      }
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  try {
    const upstream = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
      body: JSON.stringify({ query, variables: { username, limit: 15 } }),
    });
    const data = await upstream.json();

    const stats = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
    if (!Array.isArray(stats)) {
      return json({ configured: true, solved: null, error: 'user_not_found' }, 200, cors);
    }

    const byDifficulty = Object.fromEntries(stats.map((s) => [s.difficulty, s.count]));
    const recent = (data.data.recentAcSubmissionList || []).map((s) => ({
      title: s.title,
      slug: s.titleSlug,
      url: `https://leetcode.com/problems/${s.titleSlug}/`,
      timestamp: Number(s.timestamp) * 1000,
    }));

    const body = {
      configured: true,
      username,
      profileUrl: `https://leetcode.com/u/${username}/`,
      solved: {
        all: byDifficulty.All ?? 0,
        easy: byDifficulty.Easy ?? 0,
        medium: byDifficulty.Medium ?? 0,
        hard: byDifficulty.Hard ?? 0,
      },
      recent,
    };

    const res = json(body, 200, { ...cors, 'Cache-Control': 'public, max-age=3600' });
    await cache.put(cacheKey, res.clone());
    return res;
  } catch (err) {
    console.error('leetcode failed:', err);
    return json({ configured: true, solved: null, error: 'upstream_failed' }, 502, cors);
  }
}

/** 主通道：Cloudflare Workers AI（原生绑定，不需要任何密钥）。失败返回 null，交给备用通道。 */
async function viaWorkersAI(env, messages) {
  if (!env.AI) return null;
  try {
    const stream = await env.AI.run(env.WORKERS_AI_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages,
      stream: true,
      max_tokens: 512,
      temperature: 0.6,
    });
    return toOpenAIStream(stream);
  } catch (error) {
    console.error('workers ai error:', String(error).slice(0, 300));
    return null;
  }
}

/** 备用通道：任意 OpenAI 兼容的服务商（配了 AI_API_KEY 才启用）。失败返回 null。 */
async function viaOpenAICompatible(env, messages) {
  if (!env.AI_API_KEY || !env.AI_API_BASE) return null;
  const upstream = await fetch(`${env.AI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.AI_API_KEY}`,
    },
    body: JSON.stringify({ model: env.AI_MODEL, stream: true, max_tokens: 512, temperature: 0.6, messages }),
  });
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('chat upstream error:', upstream.status, detail.slice(0, 300));
    return null;
  }
  return upstream.body;
}

async function handleChat(request, env, cors) {
  if (!env.AI && !env.AI_API_KEY) {
    return json({ error: 'not_configured' }, 503, cors);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, cors);
  }

  const incoming = Array.isArray(payload && payload.messages) ? payload.messages : [];
  const history = incoming
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_LENGTH) }));

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return json({ error: 'empty_message' }, 400, cors);
  }

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history];
  const body = (await viaWorkersAI(env, messages)) || (await viaOpenAICompatible(env, messages));
  if (!body) {
    return json({ error: 'upstream_failed' }, 502, cors);
  }

  // OpenAI 风格的 SSE 流，原样交给前端
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...cors,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request.headers.get('Origin') || '', env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/now-playing' && request.method === 'GET') {
      return handleNowPlaying(request, env, cors);
    }
    if (url.pathname === '/leetcode' && request.method === 'GET') {
      return handleLeetCode(request, env, cors);
    }
    if (url.pathname === '/chat' && request.method === 'POST') {
      return handleChat(request, env, cors);
    }

    return json({ error: 'not_found' }, 404, cors);
  },
};
