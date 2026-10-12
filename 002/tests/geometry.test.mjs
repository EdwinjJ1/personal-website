import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as G from '../site/js/geometry.js';

const img = { w: 3840, h: 2160 };
const wide = { w: 1440, h: 900 };
const tall = { w: 390, h: 844 };
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test('coverScale 取较大的那一边，保证铺满', () => {
  near(G.coverScale(wide, img), 900 / 2160);
  near(G.coverScale(tall, img), 844 / 2160);
  near(G.coverScale({ w: 3840, h: 100 }, img), 1);
});

test('clampView 不让画面露出图像之外', () => {
  const v = G.clampView({ cx: -500, cy: 99999, zoom: 1 }, wide, img);
  const s = G.viewScale(v, wide, img);
  assert.ok(v.cx - wide.w / (2 * s) >= -1e-6);
  assert.ok(v.cy + wide.h / (2 * s) <= img.h + 1e-6);
  near(v.cy, img.h / 2);          // 高度方向刚好铺满，只能居中
});

test('clampView 限制倍率，且不改传入对象', () => {
  const input = Object.freeze({ cx: 1000, cy: 1000, zoom: 99 });
  const v = G.clampView(input, wide, img);
  assert.equal(v.zoom, G.MAX_ZOOM);
  assert.equal(G.clampView({ cx: 0, cy: 0, zoom: 0.2 }, wide, img).zoom, 1);
  assert.equal(input.zoom, 99);
});

test('screenToImage 与 imageToScreen 互逆', () => {
  const view = G.clampView({ cx: 1700, cy: 900, zoom: 2.3 }, wide, img);
  const p = { x: 321, y: 654 };
  const back = G.imageToScreen(G.screenToImage(p, view, wide, img), view, wide, img);
  near(back.x, p.x, 1e-6);
  near(back.y, p.y, 1e-6);
  const c = G.imageToScreen({ x: view.cx, y: view.cy }, view, wide, img);
  near(c.x, wide.w / 2);
  near(c.y, wide.h / 2);
});

test('viewForBBox 把包围盒中心放到锚点上', () => {
  const bbox = [1800, 1000, 2000, 1150];
  const anchor = { x: 0.3, y: 0.5 };
  const view = G.viewForBBox(bbox, wide, img, { anchor, usable: { w: 0.56, h: 0.8 } });
  const p = G.imageToScreen({ x: 1900, y: 1075 }, view, wide, img);
  near(p.x, wide.w * anchor.x, 0.5);
  near(p.y, wide.h * anchor.y, 0.5);
  assert.ok(view.zoom > 1 && view.zoom <= 3.2);
});

test('viewForBBox 对贴边的大包围盒退回合法范围', () => {
  const view = G.viewForBBox([0, 0, 3840, 2160], wide, img);
  assert.equal(view.zoom, 1);
  near(view.cy, img.h / 2);
  const tiny = G.viewForBBox([10, 10, 11, 11], tall, img, { maxZoom: 2 });
  assert.equal(tiny.zoom, 2);
});

test('lerpView 端点正确，倍率按指数插值', () => {
  const a = { cx: 0, cy: 0, zoom: 1 };
  const b = { cx: 100, cy: 50, zoom: 4 };
  assert.deepEqual(G.lerpView(a, b, 0), a);
  assert.deepEqual(G.lerpView(a, b, 1), b);
  near(G.lerpView(a, b, 0.5).zoom, 2);
  near(G.lerpView(a, b, 0.5).cx, 50);
});

test('easeInOut 单调，两端为 0 和 1', () => {
  assert.equal(G.easeInOut(0), 0);
  assert.equal(G.easeInOut(1), 1);
  near(G.easeInOut(0.5), 0.5);
  let prev = 0;
  for (let i = 1; i <= 20; i++) { const v = G.easeInOut(i / 20); assert.ok(v >= prev); prev = v; }
});

test('zoomAt 让锚点下的图像位置保持不动', () => {
  const view = G.clampView({ cx: 1920, cy: 1080, zoom: 1.5 }, wide, img);
  const pt = { x: 900, y: 400 };
  const before = G.screenToImage(pt, view, wide, img);
  const zoomed = G.zoomAt(view, 1.6, pt, wide, img);
  const after = G.screenToImage(pt, zoomed, wide, img);
  near(after.x, before.x, 1e-6);
  near(after.y, before.y, 1e-6);
  assert.equal(G.zoomAt(view, 0.01, pt, wide, img).zoom, 1);
});

test('hotIndexAt 解码 R 通道并处理越界', () => {
  const w = 4, h = 2;
  const data = new Uint8ClampedArray(w * h * 4);
  data[(1 * w + 2) * 4] = 24;     // 第 3 号热点
  data[(0 * w + 0) * 4] = 9;      // 压缩误差：9 ≈ 8 → 1 号
  assert.equal(G.hotIndexAt(data, w, h, 2.7, 1.2), 3);
  assert.equal(G.hotIndexAt(data, w, h, 0, 0), 1);
  assert.equal(G.hotIndexAt(data, w, h, 3, 0), 0);
  assert.equal(G.hotIndexAt(data, w, h, -1, 0), 0);
  assert.equal(G.hotIndexAt(data, w, h, 4, 1), 0);
  assert.equal(G.hotIndexAt(data, w, h, 0, 2), 0);
});

test('wrapIndex 双向循环', () => {
  assert.equal(G.wrapIndex(10, 10), 0);
  assert.equal(G.wrapIndex(-1, 10), 9);
  assert.equal(G.wrapIndex(3, 10), 3);
});

test('clamp', () => {
  assert.equal(G.clamp(5, 0, 3), 3);
  assert.equal(G.clamp(-5, 0, 3), 0);
  assert.equal(G.clamp(2, 0, 3), 2);
});

test('clampView 在零视口或非有限输入时退回图像中心', () => {
  assert.deepEqual(G.clampView({ cx: 10, cy: 10, zoom: 2 }, { w: 0, h: 0 }, img), { cx: 1920, cy: 1080, zoom: 2 });
  const v = G.clampView({ cx: NaN, cy: undefined, zoom: NaN }, wide, img);
  assert.deepEqual(v, { cx: 1920, cy: 1080, zoom: 1 });
  const z = G.clampView({ cx: Infinity, cy: 500, zoom: 3 }, wide, img);
  assert.ok(Number.isFinite(z.cx) && Number.isFinite(z.cy));
});

// ── 手机 / 触屏适配用到的换算 ──

test('hotIndexNear 正下方有热点就直接返回，半径为 0 时等同 hotIndexAt', () => {
  const w = 40, h = 40;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 15; y <= 25; y++) for (let x = 25; x <= 30; x++) data[(y * w + x) * 4] = 40;   // 5 号热点，在右边
  assert.equal(G.hotIndexNear(data, w, h, 27, 20, 8), 5);
  assert.equal(G.hotIndexNear(data, w, h, 20, 20, 0), 0);
  assert.equal(G.hotIndexNear(data, w, h, 20, 20), 0);
});

test('hotIndexNear 点偏了就在半径里往外找，够不着返回 0', () => {
  const w = 40, h = 40;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 15; y <= 25; y++) for (let x = 25; x <= 30; x++) data[(y * w + x) * 4] = 40;   // 5 号，离 (20,20) 5 格
  for (let y = 15; y <= 25; y++) for (let x = 5; x <= 10; x++) data[(y * w + x) * 4] = 16;    // 2 号，离 (20,20) 10 格
  assert.equal(G.hotIndexNear(data, w, h, 20, 20, 8), 5);
  assert.equal(G.hotIndexNear(data, w, h, 20, 20, 3), 0);
  assert.equal(G.hotIndexNear(data, w, h, 20, 20, 16), 5);     // 两个都够得着：取近的
  assert.equal(G.hotIndexNear(data, w, h, 13, 20, 4), 2);
  assert.equal(G.hotIndexNear(data, w, h, 1, 1, 2), 0);        // 贴着图像边缘找，不越界
});

test('viewRect 给出视野占整张图的比例', () => {
  const home = G.viewRect(G.clampView({ cx: 1920, cy: 1080, zoom: 1 }, tall, img), tall, img);
  near(home.h, 1);
  near(home.y, 0);
  near(home.w, tall.w / ((tall.h / img.h) * img.w));        // 竖屏只看得到中间一条
  near(home.x, 0.5 - home.w / 2);
  const left = G.viewRect(G.clampView({ cx: 0, cy: 0, zoom: 2 }, tall, img), tall, img);
  near(left.x, 0);
  near(left.y, 0);
  near(left.w, home.w / 2);
  near(left.h, 0.5);
  const all = G.viewRect(G.clampView({ cx: 1920, cy: 1080, zoom: 1 }, { w: 1600, h: 900 }, img), { w: 1600, h: 900 }, img);
  [all.x, all.y].forEach((v) => near(v, 0));               // 16:9 的窗口刚好看全
  [all.w, all.h].forEach((v) => near(v, 1));
});

test('hotsInView 只留中心在视口里的热点，从左到右，四边可以让出 HUD', () => {
  const hots = {
    right: { center: [2300, 1080] },
    left: { center: [1500, 1080] },
    mid: { center: [1920, 1080] },
    off: { center: [200, 1080] },         // 竖屏下在画面外
    low: { center: [1900, 2140] },        // 画面最底下
  };
  const view = G.clampView({ cx: 1920, cy: 1080, zoom: 1 }, tall, img);
  assert.deepEqual(G.hotsInView(hots, view, tall, img), ['left', 'low', 'mid', 'right']);
  assert.deepEqual(G.hotsInView(hots, view, tall, img, { top: 60, right: 16, bottom: 60, left: 16 }), ['left', 'mid', 'right']);
  const panned = G.clampView({ cx: 0, cy: 1080, zoom: 1 }, tall, img);
  assert.deepEqual(G.hotsInView(hots, panned, tall, img), ['off']);
  assert.deepEqual(G.hotsInView({}, view, tall, img), []);
});

test('clampView：视口底部被面板盖住时（vp.under），图像底边可以抬到面板上沿，别的边不变', () => {
  const s = G.coverScale(tall, img);                       // zoom 1：竖屏刚好铺满高度
  const plain = G.clampView({ cx: 1920, cy: 99999, zoom: 1 }, tall, img);
  near(plain.cy, img.h / 2);
  const sheet = { ...tall, under: 400 };
  const lifted = G.clampView({ cx: 1920, cy: 99999, zoom: 1 }, sheet, img);
  near(lifted.cy, img.h / 2 + 400 / s);                    // 最多抬 400 屏幕像素
  near(G.imageToScreen({ x: 0, y: img.h }, lifted, sheet, img).y, tall.h - 400);
  near(G.clampView({ cx: 1920, cy: -99999, zoom: 1 }, sheet, img).cy, img.h / 2);    // 顶边照旧不许露
  near(G.clampView({ cx: 1920, cy: 1300, zoom: 1 }, sheet, img).cy, 1300);           // 范围内的原样留着
  const zoomed = G.clampView({ cx: 1920, cy: 99999, zoom: 2 }, sheet, img);
  near(zoomed.cy, img.h - tall.h / (4 * s) + 400 / (2 * s));
  assert.deepEqual(G.clampView({ cx: 700, cy: 99999, zoom: 1.5 }, { ...wide, under: 0 }, img), G.clampView({ cx: 700, cy: 99999, zoom: 1.5 }, wide, img));
});

test('viewForBBox：面板盖住下半截时，贴着图像底边的物件也能抬进上面那一截', () => {
  const sheet = { ...tall, under: 420 };
  const bbox = [499, 1543, 861, 1899];                     // 桌子最前排的报纸
  const anchor = { x: 0.5, y: 0.3 };
  const stuck = G.imageToScreen({ x: 680, y: 1721 }, G.viewForBBox(bbox, tall, img, { anchor, usable: { w: 0.9, h: 0.4 } }), tall, img);
  assert.ok(stuck.y > tall.h - 420);                       // 不让抬：物件被压在面板底下
  const view = G.viewForBBox(bbox, sheet, img, { anchor, usable: { w: 0.9, h: 0.4 } });
  const p = G.imageToScreen({ x: 680, y: 1721 }, view, sheet, img);
  near(p.x, tall.w * anchor.x, 0.5);
  near(p.y, tall.h * anchor.y, 0.5);
});
