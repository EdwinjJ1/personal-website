import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CENTER, earthOf, hashOf, hostOf, webLayout } from '../site/js/web.js';

const fromCenter = (p) => Math.hypot(p.x - CENTER, p.y - CENTER);
const numbers = (path) => path.match(/-?\d+(\.\d+)?/g).map(Number);

test('hashOf 稳定、是非负整数，不同的字符串得到不同的数', () => {
  assert.equal(hashOf('joyehuang.me'), hashOf('joyehuang.me'));
  assert.notEqual(hashOf('joyehuang.me'), hashOf('hejiac.com'));
  ['', 'a', '雪', 'boblee.dev'].forEach((s) => {
    const h = hashOf(s);
    assert.ok(Number.isInteger(h) && h >= 0, s);
  });
  assert.equal(hashOf(undefined), hashOf(''));
});

test('hostOf 去掉 www，坏链接返回空串', () => {
  assert.equal(hostOf('https://www.boblee.dev/'), 'boblee.dev');
  assert.equal(hostOf('https://daily.yybb.us/a/b?c=1'), 'daily.yybb.us');
  assert.equal(hostOf('not a url'), '');
  assert.equal(hostOf(undefined), '');
});

test('earthOf：同一个站永远是同一个四位编号，带不带 www 都一样', () => {
  assert.match(earthOf('https://hejiac.com'), /^EARTH-\d{4}$/);
  assert.equal(earthOf('https://www.boblee.dev/'), earthOf('https://boblee.dev/about'));
  assert.notEqual(earthOf('https://hejiac.com'), earthOf('https://joyehuang.me/'));
  assert.match(earthOf('not a url'), /^EARTH-\d{4}$/);
});

test('webLayout：每个朋友占一根辐条，辐条不少于 8 根', () => {
  [1, 2, 3, 4, 5, 7, 8, 12].forEach((n) => {
    const web = webLayout(n);
    assert.equal(web.nodes.length, n);
    assert.ok(web.spokes.length >= 8, `${n} 个朋友只有 ${web.spokes.length} 根辐条`);
    assert.equal(new Set(web.nodes.map((p) => p.spoke)).size, n);
    web.nodes.forEach((p) => assert.ok(web.spokes[p.spoke], `辐条 ${p.spoke} 不存在`));
  });
});

test('节点在自己那根辐条上，离中心和边缘都留了位置', () => {
  [1, 2, 3, 4, 6, 9].forEach((n) => {
    const web = webLayout(n);
    web.nodes.forEach((p) => {
      const end = web.spokes[p.spoke];
      const cross = (p.x - CENTER) * (end.y - CENTER) - (p.y - CENTER) * (end.x - CENTER);
      assert.ok(Math.abs(cross) < 0.5, `n=${n} 的节点偏离辐条 ${cross}`);
      assert.ok(fromCenter(p) > 18 && fromCenter(p) < fromCenter(end), `n=${n} 的节点离中心 ${fromCenter(p)}`);
      assert.ok(p.x >= 18 && p.x <= 82, `n=${n} 的节点 x=${p.x}，名字会被裁掉`);
      assert.ok(p.y >= 14 && p.y <= 84, `n=${n} 的节点 y=${p.y}`);
    });
  });
});

test('节点之间不挤在一起', () => {
  [2, 3, 4, 5, 6, 8].forEach((n) => {
    const { nodes } = webLayout(n);
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach((b) => {
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= 18, `n=${n} 有两个节点只隔 ${Math.hypot(a.x - b.x, a.y - b.y)}`);
    }));
  });
});

test('蛛丝环：每圈是一条闭合路径，经过每根辐条，全在画布里', () => {
  const web = webLayout(4);
  assert.ok(web.rings.length >= 3);
  web.rings.forEach((d) => {
    assert.match(d, /^M[\d. -]+(Q[\d. -]+)+Z$/);
    assert.equal(d.match(/Q/g).length, web.spokes.length);
    numbers(d).forEach((v) => assert.ok(v >= 0 && v <= 100, `${v} 出界`));
  });
  web.spokes.forEach((p) => assert.ok(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100));
});

test('没有朋友、或者传进来的不是正常数字，也照样画出一张空网', () => {
  [0, -3, NaN, undefined].forEach((n) => {
    const web = webLayout(n);
    assert.deepEqual(web.nodes, []);
    assert.equal(web.spokes.length, 8);
    assert.ok(web.rings.length >= 3);
  });
  assert.equal(webLayout(3.9).nodes.length, 3);
});

test('同样的输入得到同样的布局', () => {
  assert.deepEqual(webLayout(4), webLayout(4));
});
