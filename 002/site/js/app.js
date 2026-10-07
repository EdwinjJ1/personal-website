// 入口：状态、交互、面板（静态 + 从旧站导入的内容）、对话、阅读模式。画面交给 stage.js，坐标换算在 geometry.js。
import { streamChat } from './chat.js';
import { CHAT, DYNAMIC, HOTS, INTRO_ORDER, LABELS, PANELS, STYLES, UI, matchTopic } from './content.js';
import * as G from './geometry.js';
import { createStage, hexToRgb } from './stage.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 隐私模式下存不了就算了 */ } },
};

const dom = {
  canvas: $('#stage'), fx: $('#fx'), loader: $('#loader'), loaderBar: $('#loader-bar'), loaderText: $('#loader-text'),
  tip: $('#tip'), sfx: $('#sfx'), panel: $('#panel'), panelBody: $('#panel-body'), back: $('#back'),
  earth: $('#earth'), dots: $('#dots'), hint: $('#hint'), intro: $('#intro'), introBody: $('#intro-body'),
  btnDesk: $('#btn-desk'), btnIntro: $('#btn-intro'), btnLang: $('#btn-lang'), btnSound: $('#btn-sound'),
};

// 状态只通过 set() 换成新对象，不原地改
let state = Object.freeze({
  lang: store.get('lang', (navigator.language || '').startsWith('zh') ? 'zh' : 'en'),
  style: 0, from: 0, t: 1, tStart: 0,
  view: null, viewFrom: null, viewTo: null, viewStart: 0, viewDur: 0,
  hover: null, panel: null, mode: 'desk', sound: false, ready: false,
});
const set = (patch) => { state = Object.freeze({ ...state, ...patch }); };
const tr = (pair) => pair[state.lang] ?? pair.zh;

let scene = null;
let img = null;
let stage = null;
let hotPixels = null;       // { data, w, h }
let hotByIndex = [];
const vp = () => ({ w: innerWidth, h: innerHeight });
const dpr = () => Math.min(devicePixelRatio || 1, 2);
const homeView = () => G.clampView({ cx: img.w / 2, cy: img.h / 2, zoom: 1 }, vp(), img);

// ───────────────────────── 声音（默认关） ─────────────────────────
let audio = null;
function blip(freq = 520, dur = 0.09, type = 'square') {
  if (!state.sound) return;
  audio = audio || new (window.AudioContext || window.webkitAudioContext)();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audio.currentTime + dur);
  gain.gain.setValueAtTime(0.06, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur);
}

// ───────────────────────── 风格切换 ─────────────────────────
function applyTheme() {
  const s = STYLES[state.style];
  const root = document.documentElement;
  root.dataset.style = s.id;
  root.style.setProperty('--ink', s.ink);
  root.style.setProperty('--paper', s.paper);
  root.style.setProperty('--accent', s.accent);
  dom.earth.replaceChildren(el('b', null, s.earth), el('span', null, tr(s.name)));
  [...dom.dots.children].forEach((d, i) => d.setAttribute('aria-current', i === state.style ? 'true' : 'false'));
}

function burst(text) {
  const mask = scene.hots.mask;
  const p = mask ? G.imageToScreen({ x: mask.center[0], y: mask.center[1] }, state.viewTo || state.view, vp(), img) : { x: innerWidth / 2, y: innerHeight / 2 };
  dom.sfx.textContent = text;
  dom.sfx.style.left = `${G.clamp(p.x, 120, innerWidth - 120)}px`;
  dom.sfx.style.top = `${G.clamp(p.y - 70, 90, innerHeight - 90)}px`;
  dom.sfx.classList.remove('go');
  void dom.sfx.offsetWidth;   // 重新触发动画
  dom.sfx.classList.add('go');
}

async function setStyle(index) {
  const next = G.wrapIndex(index, STYLES.length);
  if (next === state.style || state.t < 1) return;
  await stage.loadStyle(STYLES[next].id);
  set({ from: state.style, style: next, t: reduceMotion ? 1 : 0, tStart: performance.now() });
  applyTheme();
  burst(STYLES[next].sfx);
  blip(300 + next * 60, 0.16, 'sawtooth');
  wantHiRes();
}

/** 屏幕像素密度够高、或者镜头推近时，换上全尺寸贴图。 */
function wantHiRes() {
  const need = G.viewScale(state.viewTo || state.view, vp(), img) * dpr() * img.w > img.w / 2 * 1.15;
  const id = STYLES[state.style].id;
  if (need && !stage.has(id, true)) stage.loadStyle(id, true).then(() => stage.trim([id, STYLES[state.from].id]));
}

// ───────────────────────── 镜头 ─────────────────────────
function flyTo(view, dur = 900) {
  set({ viewFrom: state.view, viewTo: G.clampView(view, vp(), img), viewStart: performance.now(), viewDur: reduceMotion ? 1 : dur });
  wantHiRes();
}

function panelLayout() {
  const wide = innerWidth >= 900;
  return wide ? { usable: { w: 0.56, h: 0.8 }, anchor: { x: 0.3, y: 0.5 } } : { usable: { w: 0.9, h: 0.4 }, anchor: { x: 0.5, y: 0.24 } };
}

// ───────────────────────── 面板 ─────────────────────────
const safeUrl = (u) => (/^(https?:\/\/|mailto:)/.test(String(u)) ? u : '#');

function extLink(cls, text, href) {
  const a = el('a', cls, text);
  a.href = safeUrl(href);
  if (/^https?:/.test(a.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  return a;
}

function linkNode(link) {
  if (link.action) {
    const b = el('button', 'btn', tr(link.label));
    b.type = 'button';
    b.addEventListener('click', () => (link.action === 'intro' ? setMode('intro') : openPanel(link.action, scene?.hots[link.action] ? link.action : null)));
    return b;
  }
  return extLink('btn', tr(link.label), link.href);
}

function listOf(items) {
  const ul = el('ul');
  items.forEach((t) => ul.append(el('li', null, t)));
  return ul;
}

function figure(src, alt) {
  const im = el('img', 'shot');
  im.loading = 'lazy';
  im.src = src;
  im.alt = alt;
  return im;
}

function cardHead(meta) {
  const wrap = el('div', 'card');
  wrap.append(el('p', 'kicker', tr(meta.kicker)), el('h2', null, tr(meta.title)), el('p', 'sub', tr(meta.sub)));
  return wrap;
}

function staticContent(key) {
  const p = PANELS[key];
  const wrap = cardHead(p);
  if (p.image) wrap.append(figure(tr(p.image.src), tr(p.image.alt)));
  tr(p.body).forEach((t) => wrap.append(el('p', null, t)));
  const items = tr(p.bullets);
  if (items.length) wrap.append(listOf(items));
  (p.sections || []).forEach((sec) => wrap.append(el('h3', 'section', tr(sec.heading)), listOf(tr(sec.items))));
  if (p.tags.length) {
    const tags = el('div', 'tags');
    p.tags.forEach((t) => tags.append(el('span', null, t)));
    wrap.append(tags);
  }
  if (p.links.length) {
    const links = el('div', 'links');
    p.links.forEach((l) => links.append(linkNode(l)));
    wrap.append(links);
  }
  return wrap;
}

// ── 从旧站导入的内容：项目 / 博客 / 摄影 / 新闻 / 友链 ──
const dataCache = new Map();
function getData(file) {
  if (!dataCache.has(file)) dataCache.set(file, fetch(`assets/data/${file}.json`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`data_${r.status}`)))));
  return dataCache.get(file);
}

let lightbox = null;   // { close, step }
function openLightbox(items, start) {
  lightbox?.close();
  const box = el('div', 'lightbox');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  const img = el('img');
  const cap = el('figcaption');
  const fig = el('figure');
  fig.append(img, cap);
  const mk = (cls, text, label, fn) => { const b = el('button', `pill ${cls}`, text); b.type = 'button'; b.setAttribute('aria-label', label); b.addEventListener('click', fn); return b; };
  let index = start;
  const show = (i) => {
    index = G.wrapIndex(i, items.length);
    const p = items[index];
    img.src = `assets/photos/${p.id}.webp`;
    img.alt = `${p.title} · ${p.location}`;
    cap.replaceChildren(el('strong', null, p.title), el('span', null, [p.location, p.date, p.camera, p.settings].filter(Boolean).join(' · ')), el('span', 'desc', p.description || ''));
  };
  const close = () => { box.remove(); lightbox = null; };
  box.append(mk('lb-close', '✕', tr(UI.close), close), mk('lb-prev', '←', tr(UI.prev), () => show(index - 1)), fig, mk('lb-next', '→', tr(UI.next), () => show(index + 1)));
  box.addEventListener('click', (ev) => { if (ev.target === box) close(); });
  document.body.append(box);
  lightbox = { close, step: (d) => show(index + d) };
  show(start);
  box.querySelector('.lb-close').focus();
}

function articleNodes(text) {
  // 博客正文是很轻的 Markdown：标题、列表、段落。全部走 textContent。
  return String(text).split(/\n{2,}/).map((block) => {
    const lines = block.trim().split('\n');
    if (/^#{1,4}\s/.test(lines[0])) return el('h3', null, lines[0].replace(/^#{1,4}\s*/, ''));
    if (lines.every((l) => /^\s*([-*]|\d+\.)\s/.test(l))) {
      const ul = el('ul');
      lines.forEach((l) => ul.append(el('li', null, l.replace(/^\s*([-*]|\d+\.)\s*/, ''))));
      return ul;
    }
    return el('p', null, lines.join(' ').replace(/\*\*|`/g, ''));
  });
}

const RENDER = {
  projects(body, items) {
    items.forEach((p) => {
      const item = el('article', 'entry');
      if (p.image) item.append(figure(`assets/projects/${p.image}`, p.title));
      item.append(el('h3', null, p.title), el('p', 'meta', [p.status, p.category].filter(Boolean).join(' · ')));
      if (p.tagline) item.append(el('p', 'sub', p.tagline));
      item.append(el('p', null, p.long || p.description));
      if (p.metrics.length) {
        const stats = el('dl', 'stats');
        p.metrics.forEach((m) => { const cell = el('div'); cell.append(el('dt', null, m.label), el('dd', null, m.value)); stats.append(cell); });
        item.append(stats);
      }
      if (p.highlights.length) item.append(listOf(p.highlights));
      const tags = el('div', 'tags');
      p.tech.forEach((t) => tags.append(el('span', null, t)));
      const links = el('div', 'links');
      if (p.live) links.append(extLink('btn small', 'Live', p.live));
      if (p.github) links.append(extLink('btn small', 'GitHub', p.github));
      item.append(tags, links);
      body.append(item);
    });
  },
  blog(body, posts) {
    const list = () => {
      body.replaceChildren(...posts.map((post) => {
        const b = el('button', 'entry entry-btn');
        b.type = 'button';
        b.append(el('h3', null, post.title), el('p', 'meta', [post.date, post.readTime, (post.language || '').toUpperCase()].filter(Boolean).join(' · ')), el('p', null, post.excerpt));
        b.addEventListener('click', () => read(post));
        return b;
      }));
    };
    const read = (post) => {
      const back = el('button', 'btn small', tr(UI.backToList));
      back.type = 'button';
      back.addEventListener('click', list);
      const art = el('article', 'article');
      art.append(el('h3', 'article-title', post.title), el('p', 'meta', [post.date, post.readTime].filter(Boolean).join(' · ')), ...articleNodes(post.content));
      body.replaceChildren(back, art);
      body.closest('.panel-body, .intro')?.scrollTo?.({ top: 0 });
    };
    list();
  },
  photos(body, items) {
    const grid = el('div', 'photo-grid');
    items.forEach((p, i) => {
      const b = el('button', 'photo');
      b.type = 'button';
      b.setAttribute('aria-label', `${p.title} · ${p.location}`);
      const im = el('img');
      im.loading = 'lazy';
      im.alt = '';
      im.src = `assets/photos/${p.id}-t.webp`;
      im.width = p.w;
      im.height = p.h;
      b.append(im, el('span', null, p.category));
      b.addEventListener('click', () => openLightbox(items, i));
      grid.append(b);
    });
    body.append(grid);
  },
  news(body, data) {
    const chips = el('div', 'chips');
    const list = el('div', 'news-list');
    const draw = (cat) => {
      list.replaceChildren(...data.items.filter((n) => cat === 'all' || n.category === cat).map((n) => {
        const a = extLink('news-item', '', n.url);
        a.append(el('span', 'meta', [n.category.toUpperCase(), n.source, n.date].filter(Boolean).join(' · ')), el('strong', null, n.title));
        if (n.summary) a.append(el('span', 'sum', n.summary));
        return a;
      }));
      [...chips.children].forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === cat)));
    };
    ['all', ...new Set(data.items.map((n) => n.category))].forEach((cat) => {
      const b = el('button', 'chip', cat === 'all' ? tr(UI.all) : cat.toUpperCase());
      b.type = 'button';
      b.dataset.cat = cat;
      b.addEventListener('click', () => draw(cat));
      chips.append(b);
    });
    body.append(el('p', 'meta', `${tr(UI.updated)} ${String(data.updated).slice(0, 10)}`), chips, list);
    draw('all');
  },
  friends(body, items) {
    items.forEach((f) => {
      const a = extLink('news-item', '', f.link);
      a.append(el('strong', null, f.name), el('span', 'sum', f.desc));
      body.append(a);
    });
  },
};

function dynamicContent(key) {
  const meta = DYNAMIC[key];
  const wrap = cardHead(meta);
  const body = el('div', `dyn dyn-${key}`);
  wrap.append(body);
  getData(meta.file).then((data) => RENDER[key](body, data)).catch(() => body.append(el('p', null, tr(UI.loadFailed))));
  return wrap;
}

const panelContent = (key) => (DYNAMIC[key] ? dynamicContent(key) : staticContent(key));

let chatAbort = null;
function chatContent() {
  const wrap = el('div', 'card chat');
  wrap.append(el('p', 'kicker', 'TALK TO ME'));
  const log = el('div', 'chat-log');
  log.setAttribute('aria-live', 'polite');
  let history = [];
  const say = (who, text) => {
    const node = el('p', `msg ${who}`, text);
    log.append(node);
    log.scrollTop = log.scrollHeight;
    return node;
  };
  const ask = async (text, hint) => {
    const topic = hint || matchTopic(text);
    say('you', text);     // textContent，不会把输入当 HTML
    history = [...history, { role: 'user', content: text }];
    const bubble = say('me', tr(UI.thinking));
    bubble.classList.add('pending');
    chatAbort?.abort();
    chatAbort = new AbortController();
    let reply = '';
    try {
      await streamChat(CHAT.api, history, (delta) => {
        reply += delta;
        bubble.textContent = reply;
        bubble.classList.remove('pending');
        log.scrollTop = log.scrollHeight;
      }, chatAbort.signal);
      if (!reply) throw new Error('empty_reply');
    } catch (err) {
      if (err.name === 'AbortError') { bubble.remove(); return; }
      reply = topic ? tr(topic.a) : tr(CHAT.fallback);     // 模型连不上：退回预设回答，并且说明白
      bubble.textContent = `${reply} ${tr(UI.offline)}`;
      bubble.classList.remove('pending');
    }
    history = [...history, { role: 'assistant', content: reply }];
    if (topic?.panel) {
      const more = el('button', 'btn small', `${tr(UI.more)} → ${tr((DYNAMIC[topic.panel] || PANELS[topic.panel]).title)}`);
      more.type = 'button';
      more.addEventListener('click', () => openPanel(topic.panel, null));
      log.append(more);
      log.scrollTop = log.scrollHeight;
    }
    blip(660, 0.06);
  };
  say('me', tr(CHAT.hello));
  const chips = el('div', 'chips');
  CHAT.topics.forEach((topic) => {
    const b = el('button', 'chip', tr(topic.q));
    b.type = 'button';
    b.addEventListener('click', () => ask(tr(topic.q), topic));
    chips.append(b);
  });
  const form = el('form', 'chat-form');
  const input = el('input');
  input.type = 'text';
  input.maxLength = 500;
  input.placeholder = tr(UI.chatPlaceholder);
  input.setAttribute('aria-label', tr(UI.chatPlaceholder));
  const send = el('button', 'btn', tr(UI.send));
  form.append(input, send);
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    ask(text, null);
  });
  wrap.append(log, chips, form);
  return wrap;
}

function openPanel(key, hotName) {
  dom.panelBody.replaceChildren(key === 'chat' ? chatContent() : panelContent(key));
  dom.panel.hidden = false;
  dom.panelBody.scrollTop = 0;
  set({ panel: key, hover: null });
  dom.tip.hidden = true;
  const hot = hotName && scene.hots[hotName];
  if (hot) flyTo(G.viewForBBox(hot.bbox, vp(), img, panelLayout()));
  dom.back.focus({ preventScroll: true });
  blip(440, 0.07);
}

function closePanel() {
  if (!state.panel) return;
  chatAbort?.abort();
  dom.panel.hidden = true;
  set({ panel: null });
  flyTo(homeView(), 800);
}

function activate(name) {
  const hot = HOTS[name];
  if (!hot) return;
  if (hot.action === 'style') setStyle(state.style + 1);
  else if (hot.action === 'chat') openPanel('chat', 'monitor');
  else openPanel(hot.panel, name);
}

// ───────────────────────── 阅读模式 ─────────────────────────
function renderIntro() {
  const head = el('header', 'intro-head');
  head.append(el('p', 'kicker', tr(UI.introTitle)), el('h1', null, tr(PANELS.about.title)), el('p', 'sub', tr(PANELS.about.sub)));
  dom.introBody.replaceChildren(head, ...INTRO_ORDER.map(panelContent));
}

function setMode(mode) {
  set({ mode });
  dom.intro.hidden = mode !== 'intro';
  dom.btnDesk.setAttribute('aria-pressed', String(mode === 'desk'));
  dom.btnIntro.setAttribute('aria-pressed', String(mode === 'intro'));
  if (mode === 'intro') {
    dom.panel.hidden = true;
    set({ panel: null, hover: null });
    renderIntro();
    dom.intro.scrollTop = 0;
  }
}

function applyLang() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  dom.btnDesk.textContent = tr(UI.desk);
  dom.btnIntro.textContent = tr(UI.intro);
  dom.btnLang.textContent = state.lang === 'zh' ? 'EN' : '中文';
  dom.btnSound.textContent = state.sound ? '♪ ON' : '♪ OFF';
  dom.btnSound.setAttribute('aria-label', tr(state.sound ? UI.soundOn : UI.soundOff));
  dom.back.textContent = tr(UI.back);
  dom.hint.textContent = tr(UI.hint);
  dom.loaderText.textContent = tr(UI.loading);
  dom.canvas.setAttribute('aria-label', tr(UI.canvasLabel));
  if (scene) applyTheme();
  if (state.mode === 'intro') renderIntro();
  if (state.panel) dom.panelBody.replaceChildren(state.panel === 'chat' ? chatContent() : panelContent(state.panel));
}

// ───────────────────────── 指针 ─────────────────────────
function hotAt(clientX, clientY) {
  if (!hotPixels) return null;
  const p = G.screenToImage({ x: clientX, y: clientY }, state.view, vp(), img);
  const idx = G.hotIndexAt(hotPixels.data, hotPixels.w, hotPixels.h, (p.x / img.w) * hotPixels.w, (p.y / img.h) * hotPixels.h);
  return hotByIndex[idx] || null;
}

function showTip(name, x, y) {
  if (!name) { dom.tip.hidden = true; return; }
  dom.tip.textContent = tr(LABELS[name]);
  dom.tip.hidden = false;
  dom.tip.style.left = `${G.clamp(x + 18, 8, innerWidth - dom.tip.offsetWidth - 8)}px`;
  dom.tip.style.top = `${G.clamp(y + 20, 8, innerHeight - 48)}px`;
}

function bindPointer() {
  const pointers = new Map();
  let drag = null;      // { x, y, view, moved }
  let pinch = 0;

  dom.canvas.addEventListener('pointerdown', (ev) => {
    dom.canvas.setPointerCapture(ev.pointerId);
    pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    drag = { x: ev.clientX, y: ev.clientY, view: state.view, moved: false };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });

  dom.canvas.addEventListener('pointermove', (ev) => {
    if (pointers.has(ev.pointerId)) pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pointers.size === 2 && pinch) {        // 双指缩放
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      set({ view: G.zoomAt(state.view, dist / pinch, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, vp(), img), viewTo: null });
      pinch = dist;
      if (drag) drag.moved = true;
      return;
    }
    if (drag && pointers.size === 1) {
      const dx = ev.clientX - drag.x;
      const dy = ev.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      if (drag.moved) {
        const s = G.viewScale(drag.view, vp(), img);
        set({ view: G.clampView({ ...drag.view, cx: drag.view.cx - dx / s, cy: drag.view.cy - dy / s }, vp(), img), viewTo: null, hover: null });
        dom.tip.hidden = true;
        return;
      }
    }
    if (ev.pointerType === 'mouse' && state.mode === 'desk') {
      const name = hotAt(ev.clientX, ev.clientY);
      if (name !== state.hover) {
        set({ hover: name });
        dom.canvas.style.cursor = name ? 'pointer' : 'grab';
        if (name) blip(880, 0.03, 'sine');
      }
      showTip(name, ev.clientX, ev.clientY);
    }
  });

  const end = (ev) => {
    const wasDrag = drag?.moved;
    pointers.delete(ev.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (pointers.size === 0) {
      drag = null;
      if (!wasDrag && ev.type === 'pointerup' && state.mode === 'desk') {
        const name = hotAt(ev.clientX, ev.clientY);
        if (name) activate(name);
        else if (state.panel) closePanel();
      }
    }
  };
  dom.canvas.addEventListener('pointerup', end);
  dom.canvas.addEventListener('pointercancel', end);
  dom.canvas.addEventListener('pointerleave', () => { set({ hover: null }); dom.tip.hidden = true; });
  dom.canvas.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    set({ view: G.zoomAt(state.view, Math.exp(-ev.deltaY * 0.0016), { x: ev.clientX, y: ev.clientY }, vp(), img), viewTo: null });
    wantHiRes();
  }, { passive: false });
}

function bindKeys() {
  addEventListener('keydown', (ev) => {
    if (ev.target instanceof HTMLInputElement || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (lightbox) {      // 看图时方向键翻页、Esc 关闭，不切宇宙
      if (ev.key === 'Escape') lightbox.close();
      else if (ev.key === 'ArrowRight') lightbox.step(1);
      else if (ev.key === 'ArrowLeft') lightbox.step(-1);
      return;
    }
    if (ev.key === 'Escape') { state.mode === 'intro' ? setMode('desk') : closePanel(); return; }
    if (state.mode !== 'desk') return;
    if (ev.key === ' ') { ev.preventDefault(); setStyle(state.style + 1); }
    else if (ev.key === 'ArrowRight') setStyle(state.style + 1);
    else if (ev.key === 'ArrowLeft') setStyle(state.style - 1);
    else if (/^[0-9]$/.test(ev.key)) setStyle(ev.key === '0' ? 9 : Number(ev.key) - 1);
  });
}

// ───────────────────────── 每帧 ─────────────────────────
const rain = [];
function drawFx(time) {
  const c = dom.fx;
  const ctx = c.getContext('2d');
  const w = innerWidth;
  const h = innerHeight;
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  ctx.clearRect(0, 0, w, h);
  if (STYLES[state.style].id !== 'noir' || reduceMotion || state.mode !== 'desk') return;
  while (rain.length < 140) rain.push({ x: Math.random() * w * 1.2, y: Math.random() * h, v: 900 + Math.random() * 700, l: 14 + Math.random() * 26 });
  ctx.strokeStyle = 'rgba(240,238,230,0.5)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  rain.forEach((d) => {
    const y = (d.y + (time / 1000) * d.v) % (h + 60) - 30;
    const x = d.x - (y / h) * w * 0.12;
    ctx.moveTo(x, y);
    ctx.lineTo(x - d.l * 0.14, y + d.l);
  });
  ctx.stroke();
}

function frame(now) {
  if (state.t < 1) set({ t: Math.min(1, (now - state.tStart) / 850) });
  if (state.viewTo) {
    const k = Math.min(1, (now - state.viewStart) / state.viewDur);
    set(k >= 1 ? { view: state.viewTo, viewTo: null } : { view: G.lerpView(state.viewFrom, state.viewTo, G.easeInOut(k)) });
  }
  const size = vp();
  if (!(size.w > 0 && size.h > 0)) { requestAnimationFrame(frame); return; }   // 面板被隐藏时视口是 0，先不画
  stage.resize(size, dpr());
  stage.draw({
    a: STYLES[state.from].id, b: STYLES[state.style].id, t: state.t,
    view: state.view, scale: G.viewScale(state.view, size, img) * dpr(), time: now / 1000,
    hover: state.hover && state.mode === 'desk' ? scene.hots[state.hover].index : 0,
    hi: hexToRgb(STYLES[state.style].accent),
  });
  drawFx(now);
  requestAnimationFrame(frame);
}

// ───────────────────────── 启动 ─────────────────────────
function progress(p) {
  dom.loaderBar.style.width = `${Math.round(p * 100)}%`;
}

function buildHud() {
  STYLES.forEach((s, i) => {
    const b = el('button', 'dot');
    b.type = 'button';
    b.style.setProperty('--c', s.accent);
    b.title = `${s.earth} · ${s.name.en}`;
    b.setAttribute('aria-label', `${s.earth} ${s.name.en}`);
    b.addEventListener('click', () => setStyle(i));
    dom.dots.append(b);
  });
  dom.btnDesk.addEventListener('click', () => setMode('desk'));
  dom.btnIntro.addEventListener('click', () => setMode('intro'));
  dom.btnLang.addEventListener('click', () => { set({ lang: state.lang === 'zh' ? 'en' : 'zh' }); store.set('lang', state.lang); applyLang(); });
  dom.btnSound.addEventListener('click', () => { set({ sound: !state.sound }); applyLang(); blip(660, 0.1); });
  dom.back.addEventListener('click', closePanel);
  addEventListener('resize', () => { if (state.view) set({ view: G.clampView(state.viewTo || state.view, vp(), img), viewTo: null }); });
}

async function boot() {
  applyLang();
  buildHud();
  try {
    scene = await (await fetch('assets/scene.json')).json();
    img = { w: scene.width, h: scene.height };
    hotByIndex = Object.entries(scene.hots).reduce((arr, [name, h]) => { const next = arr.slice(); next[h.index] = name; return next; }, []);
    stage = createStage(dom.canvas, img);
    progress(0.2);
    const hotImg = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'assets/hot.png'; });
    const cv = document.createElement('canvas');
    cv.width = hotImg.width;
    cv.height = hotImg.height;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(hotImg, 0, 0);
    hotPixels = { data: cx.getImageData(0, 0, cv.width, cv.height).data, w: cv.width, h: cv.height };
    stage.setHot(hotImg);
    progress(0.5);
    await stage.loadStyle(STYLES[0].id);
    progress(1);
    set({ view: homeView(), ready: true });
    applyTheme();
    bindPointer();
    bindKeys();
    requestAnimationFrame(frame);
    dom.loader.classList.add('done');
    wantHiRes();
    STYLES.slice(1).reduce((p, s) => p.then(() => stage.loadStyle(s.id)), Promise.resolve());   // 其余九个宇宙后台慢慢载
  } catch (err) {
    console.error(err);
    dom.loaderText.textContent = '3D 场景加载失败，已切到阅读模式。';
    dom.loader.classList.add('done');
    setMode('intro');
  }
}

boot();
