import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { createTour } from '../site/js/tour.js';

mock.timers.enable({ apis: ['setTimeout'] });
const tick = (ms) => mock.timers.tick(ms);

/** 一个假舞台：记下点了谁的名、收了几次。 */
function rig({ names = ['a', 'b', 'c'], idle = () => true, step = 100 } = {}) {
  const log = [];
  const tour = createTour({ list: () => names, idle, show: (n) => log.push(n), hide: () => log.push('-'), step });
  return { tour, log };
}

test('start 等够了才开始，按顺序每个停一拍，走完收起来就停', () => {
  const { tour, log } = rig();
  tour.start(500);
  tick(499);
  assert.deepEqual(log, []);
  tick(1);
  assert.deepEqual(log, ['a']);
  tick(100);
  assert.deepEqual(log, ['a', 'b']);
  tick(100);
  assert.deepEqual(log, ['a', 'b', 'c']);
  tick(100);
  assert.deepEqual(log, ['a', 'b', 'c', '-']);
  tick(5000);
  assert.deepEqual(log, ['a', 'b', 'c', '-']);       // 一轮走完不再循环
});

test('stop 立刻收起来；没在点名时 stop 不会多收一次', () => {
  const { tour, log } = rig();
  tour.stop();
  assert.deepEqual(log, []);
  tour.start(10);
  tick(10);
  tour.stop();
  assert.deepEqual(log, ['a', '-']);
  tour.stop();
  tick(1000);
  assert.deepEqual(log, ['a', '-']);
});

test('等的时候再 start 会从头计时；点到一半再 start 先收起来再重来', () => {
  const { tour, log } = rig();
  tour.start(100);
  tick(80);
  tour.start(100);
  tick(80);
  assert.deepEqual(log, []);
  tick(20);
  assert.deepEqual(log, ['a']);
  tour.start(50);
  assert.deepEqual(log, ['a', '-']);
  tick(50);
  assert.deepEqual(log, ['a', '-', 'a']);
  tour.stop();
});

test('不空闲就不开始；点到一半不空闲了就收起来', () => {
  let free = false;
  const { tour, log } = rig({ idle: () => free });
  tour.start(10);
  tick(1000);
  assert.deepEqual(log, []);
  free = true;
  tour.start(10);
  tick(10);
  assert.deepEqual(log, ['a']);
  free = false;
  tick(100);
  assert.deepEqual(log, ['a', '-']);
  tick(1000);
  assert.deepEqual(log, ['a', '-']);
});

test('视野里没有物件时什么都不做；list 每一轮重新取', () => {
  const names = [];
  const { tour, log } = rig({ names });
  tour.start(10);
  tick(1000);
  assert.deepEqual(log, []);
  names.push('x');
  tour.start(10);
  tick(10);
  assert.deepEqual(log, ['x']);
  tour.stop();
});
