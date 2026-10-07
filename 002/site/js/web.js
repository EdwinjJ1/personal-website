// 友链蛛网的布局：Evan 在中心，每个朋友是一根蛛丝另一头的宇宙。
// 坐标都落在 0–100 的正方形里（直接当 SVG viewBox 用）。纯函数，方便测试。

export const CENTER = 50;
const REACH = 47;                     // 辐条伸到多远
const RINGS = [14, 23, 32, 41];       // 每圈蛛丝的半径
const ORBIT = { x: 30, y: 33 };       // 节点所在的椭圆：横向收窄，给名字留位置
const MIN_SPOKES = 8;

const round = (v) => Math.round(v * 100) / 100;
const polar = (angle, r) => ({ x: round(CENTER + Math.cos(angle) * r), y: round(CENTER + Math.sin(angle) * r) });

/** FNV-1a。同一个字符串永远得到同一个数，用来给每个朋友派宇宙编号。 */
export function hashOf(text) {
  let h = 0x811c9dc5;
  for (const ch of String(text ?? '')) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function hostOf(link) {
  try { return new URL(link).hostname.replace(/^www\./, ''); } catch { return ''; }
}

/** 每个朋友的站是一个平行宇宙：编号由域名决定，换了顺序也不会变。 */
export const earthOf = (link) => `EARTH-${1000 + (hashOf(hostOf(link) || link) % 9000)}`;

/** 椭圆在某个方向上的半径，节点沿着辐条放在这个距离上。 */
const orbitRadius = (angle) => (ORBIT.x * ORBIT.y) / Math.hypot(ORBIT.y * Math.cos(angle), ORBIT.x * Math.sin(angle));

/** 手画的网不会正圆：每个交点按固定的规律里外挪一点。 */
const wobble = (spoke, ring) => 1 + 0.05 * Math.sin((spoke + 1) * 12.9898 + (ring + 1) * 78.233);

function ringPath(radius, ring, angles) {
  const step = (Math.PI * 2) / angles.length;
  const pts = angles.map((a, k) => polar(a, radius * wobble(k, ring)));
  const sag = radius * Math.cos(step / 2) * 0.86;      // 两根辐条之间的丝往中心垂
  const curves = pts.map((_, k) => {
    const mid = polar(angles[k] + step / 2, sag);
    const next = pts[(k + 1) % pts.length];
    return `Q${mid.x} ${mid.y} ${next.x} ${next.y}`;
  });
  return `M${pts[0].x} ${pts[0].y}${curves.join('')}Z`;
}

/**
 * count 个朋友的蛛网。
 * 返回 { spokes: 辐条外端 [{x, y}], rings: 每圈蛛丝的 SVG 路径, nodes: [{x, y, spoke}] }。
 * 朋友少的时候补几根空辐条，网才像网；多于 5 个时里外交错，名字不打架。
 */
export function webLayout(count) {
  const n = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const per = n >= MIN_SPOKES ? 1 : Math.ceil(MIN_SPOKES / Math.max(n, 1));
  const total = Math.max(n, 1) * per;
  const start = n <= 2 ? -Math.PI / 4 : -Math.PI / 2 + Math.PI / n;      // 避开正上正下和正左正右
  const angles = Array.from({ length: total }, (_, k) => start + (k * Math.PI * 2) / total);
  const nodes = Array.from({ length: n }, (_, i) => {
    const spoke = i * per;
    const pull = n > 5 && i % 2 ? 0.68 : 1;
    return { ...polar(angles[spoke], orbitRadius(angles[spoke]) * pull), spoke };
  });
  return {
    spokes: angles.map((a) => polar(a, REACH)),
    rings: RINGS.map((r, ring) => ringPath(r, ring, angles)),
    nodes,
  };
}
