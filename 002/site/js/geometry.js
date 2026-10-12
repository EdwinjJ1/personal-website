// 视口 ↔ 图像坐标的纯函数。view = { cx, cy, zoom }：图像上的视点中心 + 相对“铺满”的倍率。

export const MAX_ZOOM = 5;

export const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/** 图像铺满视口（cover）所需的缩放。 */
export const coverScale = (vp, img) => Math.max(vp.w / img.w, vp.h / img.h);

export const viewScale = (view, vp, img) => coverScale(vp, img) * view.zoom;

const finite = (v, fallback) => (Number.isFinite(v) ? v : fallback);

/**
 * 把 view 收回合法范围：倍率 1..MAX_ZOOM，画面任何一边都不露出图像之外。
 * 视口是 0（页面在隐藏的面板 / 标签里启动）或者传进来的数不是有限值时，退回图像中心，免得 NaN 一路传到着色器里。
 * vp.under：视口底部被面板盖住的高度（竖屏手机）。这一截反正看不见，允许图像底边抬到面板上沿，桌子前排的物件才露得出来。
 */
export function clampView(view, vp, img) {
  const zoom = clamp(finite(view.zoom, 1), 1, MAX_ZOOM);
  if (!(vp.w > 0 && vp.h > 0)) return { cx: img.w / 2, cy: img.h / 2, zoom };
  const s = coverScale(vp, img) * zoom;
  const halfW = vp.w / (2 * s);
  const halfH = vp.h / (2 * s);
  const lift = vp.under > 0 ? vp.under / s : 0;
  return {
    cx: halfW * 2 >= img.w ? img.w / 2 : clamp(finite(view.cx, img.w / 2), halfW, img.w - halfW),
    cy: halfH * 2 >= img.h + lift ? img.h / 2 : clamp(finite(view.cy, img.h / 2), halfH, img.h - halfH + lift),
    zoom,
  };
}

export function screenToImage(pt, view, vp, img) {
  const s = viewScale(view, vp, img);
  return { x: (pt.x - vp.w / 2) / s + view.cx, y: (pt.y - vp.h / 2) / s + view.cy };
}

export function imageToScreen(pt, view, vp, img) {
  const s = viewScale(view, vp, img);
  return { x: (pt.x - view.cx) * s + vp.w / 2, y: (pt.y - view.cy) * s + vp.h / 2 };
}

/**
 * 把镜头推到一个包围盒上。
 * usable：面板打开后还能看见的那块视口（占比），anchor：包围盒中心落在视口的哪个位置（占比）。
 */
export function viewForBBox(bbox, vp, img, { pad = 1.7, usable = { w: 1, h: 1 }, anchor = { x: 0.5, y: 0.5 }, maxZoom = 3.2 } = {}) {
  const bw = Math.max(bbox[2] - bbox[0], 1);
  const bh = Math.max(bbox[3] - bbox[1], 1);
  const fit = Math.min((vp.w * usable.w) / (bw * pad), (vp.h * usable.h) / (bh * pad));
  const zoom = clamp(fit / coverScale(vp, img), 1, maxZoom);
  const s = coverScale(vp, img) * zoom;
  const view = {
    cx: (bbox[0] + bbox[2]) / 2 - ((anchor.x - 0.5) * vp.w) / s,
    cy: (bbox[1] + bbox[3]) / 2 - ((anchor.y - 0.5) * vp.h) / s,
    zoom,
  };
  return clampView(view, vp, img);
}

/** 两个 view 之间插值；倍率按指数走，镜头推近时速度看起来才均匀。 */
export const lerpView = (a, b, t) => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  zoom: a.zoom * Math.pow(b.zoom / a.zoom, t),
});

export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** 以屏幕上一点为锚缩放（滚轮 / 双指）：锚点下的图像位置保持不动。 */
export function zoomAt(view, factor, pt, vp, img) {
  const before = screenToImage(pt, view, vp, img);
  const zoom = clamp(view.zoom * factor, 1, MAX_ZOOM);
  const s = coverScale(vp, img) * zoom;
  return clampView({ cx: before.x - (pt.x - vp.w / 2) / s, cy: before.y - (pt.y - vp.h / 2) / s, zoom }, vp, img);
}

/** 热点图取样：data 是 RGBA 字节，R = 序号 × 8。越界返回 0。 */
export function hotIndexAt(data, w, h, x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || iy < 0 || ix >= w || iy >= h) return 0;
  return Math.round(data[(iy * w + ix) * 4] / 8);
}

/** 手指比鼠标粗：正下方没有热点时，在 radius（热点图像素）以内一圈圈往外找，返回最先碰到的那个。 */
export function hotIndexNear(data, w, h, x, y, radius = 0, rings = 4, spokes = 12) {
  const hit = hotIndexAt(data, w, h, x, y);
  if (hit || !(radius > 0)) return hit;
  for (let ring = 1; ring <= rings; ring++) {
    const r = (radius * ring) / rings;
    for (let k = 0; k < spokes; k++) {
      const a = (k / spokes) * Math.PI * 2;
      const idx = hotIndexAt(data, w, h, x + Math.cos(a) * r, y + Math.sin(a) * r);
      if (idx) return idx;
    }
  }
  return 0;
}

/** 当前视野占整张图的哪一块（都是 0..1 的比例）：小地图上的取景框。 */
export function viewRect(view, vp, img) {
  const s = viewScale(view, vp, img);
  const w = Math.min(1, vp.w / (s * img.w));
  const h = Math.min(1, vp.h / (s * img.h));
  return { x: clamp(view.cx / img.w - w / 2, 0, 1 - w), y: clamp(view.cy / img.h - h / 2, 0, 1 - h), w, h };
}

/** 中心落在视口里的热点名，从左到右。inset：四边各让出多少像素（被 HUD 盖住的地方不算看得见）。 */
export function hotsInView(hots, view, vp, img, inset = { top: 0, right: 0, bottom: 0, left: 0 }) {
  return Object.entries(hots)
    .map(([name, hot]) => ({ name, p: imageToScreen({ x: hot.center[0], y: hot.center[1] }, view, vp, img) }))
    .filter(({ p }) => p.x >= inset.left && p.x <= vp.w - inset.right && p.y >= inset.top && p.y <= vp.h - inset.bottom)
    .sort((a, b) => a.p.x - b.p.x)
    .map(({ name }) => name);
}

/** 风格序号循环。 */
export const wrapIndex = (i, n) => ((i % n) + n) % n;
