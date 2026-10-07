// 黑胶播放器的逻辑：一张歌单 + 一个 <audio>。不碰 DOM，方便测试；界面在 app.js。
// 歌单来自 assets/data/music.json（pipeline/sync_music.py 从网易云的公开歌单同步），
// 声音走网易云官方的外链地址：只有不用会员就能听的歌放得出来，放不了的自动跳过。

export const MAX_SKIPS = 5;          // 连着这么多首放不了就停下，多半是地区或网络的问题
const RESTART_AFTER = 3;             // 放了超过这么多秒，“上一首”先回到开头

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const wrap = (i, n) => ((i % n) + n) % n;

export const songUrl = (id) => `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(id)}.mp3`;

export const coverUrl = (url, size = 300) => (url ? `${String(url).replace(/^http:/, 'https:')}?param=${size}y${size}` : '');

/** 秒 → m:ss。 */
export function fmtTime(seconds) {
  const n = Number(seconds);
  const s = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * 接下来放哪一首。dead 是放不了的序号；随机播放不重复当前这首。
 * 只剩一首能放就还是它；一首都没有返回 -1。
 */
export function pickNext(count, current, { step = 1, shuffle = false, dead = [], random = Math.random } = {}) {
  const alive = Array.from({ length: Math.max(0, count) }, (_, i) => i).filter((i) => !dead.includes(i));
  if (!alive.length) return -1;
  const others = alive.filter((i) => i !== current);
  if (!others.length) return alive[0];
  if (shuffle) return others[Math.min(others.length - 1, Math.floor(random() * others.length))];
  const dir = step < 0 ? -1 : 1;
  return Array.from({ length: count }, (_, k) => wrap(current + dir * (k + 1), count)).find((i) => others.includes(i));
}

/**
 * audio 是一个 <audio>（测试里换成假的）。状态只读，每次变化换一个新对象并通知订阅者。
 * 面板关掉之后播放器还在，音乐不会断。
 */
export function createPlayer(audio, { random = Math.random } = {}) {
  let state = Object.freeze({ tracks: [], index: -1, playing: false, loading: false, shuffle: false, time: 0, duration: 0, volume: 0.8, dead: [], blocked: false });
  let misses = 0;
  const listeners = new Set();
  const set = (patch) => {
    state = Object.freeze({ ...state, ...patch });
    listeners.forEach((fn) => fn(state));
  };
  const next = (step, dead = state.dead) => pickNext(state.tracks.length, state.index, { step, shuffle: state.shuffle, dead, random });

  function start(index) {
    const track = state.tracks[index];
    if (!track || state.dead.includes(index)) return;
    audio.src = songUrl(track.id);
    set({ index, time: 0, duration: track.duration || 0, loading: true, blocked: false });
    // 地址放不了由 error 事件处理；这里只管浏览器不让出声的情况，被下一次播放打断不算
    Promise.resolve(audio.play()).catch((err) => { if (err?.name === 'NotAllowedError') set({ loading: false, playing: false }); });
  }

  audio.volume = state.volume;
  audio.addEventListener('playing', () => { misses = 0; set({ playing: true, loading: false }); });
  audio.addEventListener('pause', () => set({ playing: false }));
  audio.addEventListener('waiting', () => set({ loading: true }));
  audio.addEventListener('timeupdate', () => set({ time: audio.currentTime }));
  audio.addEventListener('durationchange', () => { if (Number.isFinite(audio.duration) && audio.duration > 0) set({ duration: audio.duration }); });
  audio.addEventListener('ended', () => start(next(1)));
  audio.addEventListener('error', () => {
    if (state.index < 0 || state.blocked) return;
    misses += 1;
    const dead = state.dead.includes(state.index) ? state.dead : [...state.dead, state.index];
    const to = misses >= MAX_SKIPS ? -1 : next(1, dead);
    if (to < 0) { set({ dead, playing: false, loading: false, blocked: true }); return; }
    set({ dead });
    start(to);
  });

  return {
    get state() { return state; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    load(tracks) {
      audio.pause();
      misses = 0;
      set({ tracks: Object.freeze([...(tracks || [])]), index: -1, playing: false, loading: false, time: 0, duration: 0, dead: [], blocked: false });
    },
    play: start,
    toggle() {
      if (state.blocked || state.index < 0) { misses = 0; start(next(1)); }
      else if (audio.paused) Promise.resolve(audio.play()).catch(() => {});
      else audio.pause();
    },
    step(dir) {
      if (dir < 0 && audio.currentTime > RESTART_AFTER) this.seek(0);
      else start(next(dir));
    },
    seek(seconds) {
      const time = clamp(Number(seconds) || 0, 0, state.duration || 0);
      audio.currentTime = time;
      set({ time });
    },
    setShuffle(on) { set({ shuffle: Boolean(on) }); },
    setVolume(v) {
      const volume = clamp(Number(v) || 0, 0, 1);
      audio.volume = volume;
      set({ volume });
    },
  };
}
