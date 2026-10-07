import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_SKIPS, coverUrl, createPlayer, fmtTime, pickNext, songUrl } from '../site/js/music.js';

/** 够用的假 <audio>：记下调用，事件由测试自己派发。 */
class FakeAudio extends EventTarget {
  src = '';
  currentTime = 0;
  duration = NaN;
  volume = 1;
  paused = true;
  plays = 0;
  reject = null;
  play() {
    this.plays += 1;
    this.paused = false;
    return this.reject ? Promise.reject(this.reject) : Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.fire('pause');
  }
  fire(type) { this.dispatchEvent(new Event(type)); }
}

const TRACKS = Object.freeze([
  { id: 11, title: 'A', artist: 'x', album: '', cover: '', duration: 100 },
  { id: 22, title: 'B', artist: 'y', album: '', cover: '', duration: 200 },
  { id: 33, title: 'C', artist: 'z', album: '', cover: '', duration: 300 },
]);

function setup(options) {
  const audio = new FakeAudio();
  const player = createPlayer(audio, options);
  player.load(TRACKS);
  return { audio, player };
}

test('fmtTime：秒 → m:ss，乱七八糟的输入当 0', () => {
  assert.equal(fmtTime(0), '0:00');
  assert.equal(fmtTime(61.9), '1:01');
  assert.equal(fmtTime(3600), '60:00');
  [NaN, undefined, -5, 'abc', Infinity].forEach((v) => assert.equal(fmtTime(v), '0:00'));
});

test('songUrl / coverUrl：走 https，封面带尺寸，没有封面返回空串', () => {
  assert.equal(songUrl(22831671), 'https://music.163.com/song/media/outer/url?id=22831671.mp3');
  assert.equal(songUrl('1&x=2'), 'https://music.163.com/song/media/outer/url?id=1%26x%3D2.mp3');
  assert.equal(coverUrl('http://p1.music.126.net/a/b.jpg', 120), 'https://p1.music.126.net/a/b.jpg?param=120y120');
  assert.equal(coverUrl('https://p2.music.126.net/a/b.jpg'), 'https://p2.music.126.net/a/b.jpg?param=300y300');
  assert.equal(coverUrl(''), '');
  assert.equal(coverUrl(undefined), '');
});

test('pickNext：顺序播放首尾相接，跳过放不了的', () => {
  assert.equal(pickNext(3, -1), 0);
  assert.equal(pickNext(3, 0), 1);
  assert.equal(pickNext(3, 2), 0);
  assert.equal(pickNext(3, 0, { step: -1 }), 2);
  assert.equal(pickNext(4, 0, { dead: [1, 2] }), 3);
  assert.equal(pickNext(4, 3, { step: -1, dead: [2] }), 1);
});

test('pickNext：随机播放不重复当前这首，也不挑放不了的', () => {
  assert.equal(pickNext(4, 1, { shuffle: true, random: () => 0 }), 0);
  assert.equal(pickNext(4, 1, { shuffle: true, random: () => 0.999 }), 3);
  assert.equal(pickNext(4, 1, { shuffle: true, random: () => 1 }), 3);          // random 返回 1 也不越界
  assert.equal(pickNext(4, 1, { shuffle: true, dead: [0, 3], random: () => 0.5 }), 2);
});

test('pickNext：只剩一首就还是它，一首都没有返回 -1', () => {
  assert.equal(pickNext(3, 1, { dead: [0, 2] }), 1);
  assert.equal(pickNext(3, 1, { dead: [0, 1, 2] }), -1);
  assert.equal(pickNext(0, -1), -1);
});

test('load 之后停在唱针抬起的状态，state 不可变', () => {
  const { player } = setup();
  assert.equal(player.state.tracks.length, 3);
  assert.equal(player.state.index, -1);
  assert.equal(player.state.playing, false);
  assert.ok(Object.isFrozen(player.state));
  assert.throws(() => { player.state.index = 2; });
});

test('play：换上那首歌的地址并开始播放，播起来之后 playing 才是 true', () => {
  const { audio, player } = setup();
  player.play(1);
  assert.equal(audio.src, songUrl(22));
  assert.equal(audio.plays, 1);
  assert.deepEqual([player.state.index, player.state.loading, player.state.playing, player.state.duration], [1, true, false, 200]);
  audio.fire('playing');
  assert.deepEqual([player.state.loading, player.state.playing], [false, true]);
  player.play(99);        // 不存在的序号不理
  assert.equal(player.state.index, 1);
  assert.equal(audio.plays, 1);
});

test('toggle：没选歌时从第一首开始，之后在暂停和继续之间切换，不重新加载', () => {
  const { audio, player } = setup();
  player.toggle();
  assert.equal(player.state.index, 0);
  audio.fire('playing');
  player.toggle();
  assert.equal(audio.paused, true);
  assert.equal(player.state.playing, false);
  player.toggle();
  assert.equal(audio.paused, false);
  assert.equal(audio.src, songUrl(11));
  assert.equal(audio.plays, 2);
});

test('step：下一首 / 上一首首尾相接；已经放了一会儿时，上一首是回到开头', () => {
  const { audio, player } = setup();
  player.play(2);
  player.step(1);
  assert.equal(player.state.index, 0);
  player.step(-1);
  assert.equal(player.state.index, 2);
  audio.currentTime = 42;
  player.step(-1);
  assert.equal(player.state.index, 2);
  assert.equal(audio.currentTime, 0);
});

test('放完自动下一首', () => {
  const { audio, player } = setup();
  player.play(0);
  audio.fire('playing');
  audio.fire('ended');
  assert.equal(player.state.index, 1);
  assert.equal(audio.src, songUrl(22));
});

test('放不了的歌标记出来并自动跳过；之后不会再选到它', () => {
  const { audio, player } = setup();
  player.play(0);
  audio.fire('error');
  assert.deepEqual(player.state.dead, [0]);
  assert.equal(player.state.index, 1);
  audio.fire('playing');
  player.play(0);
  assert.equal(player.state.index, 1);
  player.step(-1);
  assert.equal(player.state.index, 2);
});

test('连着好几首都放不了就停下来，不无限跳', () => {
  const audio = new FakeAudio();
  const player = createPlayer(audio);
  player.load(Array.from({ length: MAX_SKIPS + 3 }, (_, i) => ({ id: i + 1, title: `t${i}`, duration: 10 })));
  player.play(0);
  for (let i = 0; i < MAX_SKIPS; i += 1) audio.fire('error');
  assert.equal(player.state.blocked, true);
  assert.equal(player.state.playing, false);
  assert.equal(player.state.loading, false);
  assert.equal(player.state.dead.length, MAX_SKIPS);
  const plays = audio.plays;
  audio.fire('error');                    // 停下之后再来的错误不再触发播放
  assert.equal(audio.plays, plays);
  player.toggle();                        // 用户再点一次可以接着试
  assert.equal(player.state.blocked, false);
  assert.equal(player.state.loading, true);
});

test('整张歌单都放不了：停下并标记 blocked', () => {
  const { audio, player } = setup();
  player.play(0);
  audio.fire('error');
  audio.fire('error');
  audio.fire('error');
  assert.equal(player.state.blocked, true);
  assert.deepEqual([...player.state.dead].sort(), [0, 1, 2]);
  player.toggle();
  assert.equal(player.state.blocked, true);
});

test('放成功一首之后，跳过的计数清零', () => {
  const audio = new FakeAudio();
  const player = createPlayer(audio);
  player.load(Array.from({ length: MAX_SKIPS * 3 }, (_, i) => ({ id: i + 1, title: `t${i}`, duration: 10 })));
  player.play(0);
  for (let i = 0; i < MAX_SKIPS - 1; i += 1) audio.fire('error');
  audio.fire('playing');
  for (let i = 0; i < MAX_SKIPS - 1; i += 1) audio.fire('error');
  assert.equal(player.state.blocked, false);
});

test('随机播放用注入的随机数', () => {
  const { player } = setup({ random: () => 0.999 });
  player.setShuffle(true);
  assert.equal(player.state.shuffle, true);
  player.play(0);
  player.step(1);
  assert.equal(player.state.index, 2);
});

test('进度、时长、音量：跟着 audio 走，越界的值收回来', () => {
  const { audio, player } = setup();
  player.play(1);
  audio.currentTime = 12.5;
  audio.fire('timeupdate');
  assert.equal(player.state.time, 12.5);
  audio.duration = 187;
  audio.fire('durationchange');
  assert.equal(player.state.duration, 187);
  audio.duration = Infinity;
  audio.fire('durationchange');
  assert.equal(player.state.duration, 187);
  player.seek(9999);
  assert.equal(audio.currentTime, 187);
  player.seek(-3);
  assert.equal(player.state.time, 0);
  player.setVolume(1.7);
  assert.equal(audio.volume, 1);
  player.setVolume(0.25);
  assert.deepEqual([audio.volume, player.state.volume], [0.25, 0.25]);
  audio.fire('waiting');
  assert.equal(player.state.loading, true);
});

test('浏览器不让自动播放时，回到暂停状态而不是一直转圈', async () => {
  const { audio, player } = setup();
  audio.reject = Object.assign(new Error('blocked'), { name: 'NotAllowedError' });
  player.play(0);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual([player.state.loading, player.state.playing], [false, false]);
  audio.reject = Object.assign(new Error('interrupted'), { name: 'AbortError' });
  player.play(1);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(player.state.loading, true);     // 被下一次播放打断不算失败
});

test('subscribe：每次状态变化都通知，退订之后不再通知', () => {
  const { audio, player } = setup();
  const seen = [];
  const off = player.subscribe((s) => seen.push(s.index));
  player.play(1);
  assert.deepEqual(seen, [1]);
  off();
  audio.fire('playing');
  assert.deepEqual(seen, [1]);
});

test('load 不改传进来的数组，重新 load 会清掉放不了的标记', () => {
  const { audio, player } = setup();
  player.play(0);
  audio.fire('error');
  player.load(TRACKS);
  assert.deepEqual(player.state.dead, []);
  assert.equal(player.state.index, -1);
  assert.equal(TRACKS.length, 3);
  player.load(undefined);
  assert.deepEqual(player.state.tracks, []);
  player.toggle();
  assert.equal(player.state.index, -1);
});
