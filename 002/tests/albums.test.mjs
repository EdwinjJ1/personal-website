import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupAlbums } from '../site/js/albums.js';

const ORDER = [
  { key: 'Her', name: { zh: 'Her', en: 'Her' } },
  { key: 'Street', name: { zh: '街头', en: 'Street' } },
  { key: 'Night', name: { zh: '夜', en: 'Night' } },
];
const p = (id, category) => ({ id, category, title: `t${id}` });

test('groupAlbums：按给定顺序排合集，合集里的照片保持原来的顺序，第一张是封面', () => {
  const albums = groupAlbums([p(1, 'Street'), p(2, 'Her'), p(3, 'Street'), p(4, 'Her')], ORDER);
  assert.deepEqual(albums.map((a) => a.key), ['Her', 'Street']);
  assert.deepEqual(albums[0].photos.map((x) => x.id), [2, 4]);
  assert.equal(albums[0].cover.id, 2);
  assert.deepEqual(albums[1].name, { zh: '街头', en: 'Street' });
  assert.deepEqual(albums[1].photos.map((x) => x.id), [1, 3]);
});

test('groupAlbums：一张照片都没有的合集不出现', () => {
  assert.deepEqual(groupAlbums([p(1, 'Night')], ORDER).map((a) => a.key), ['Night']);
  assert.deepEqual(groupAlbums([], ORDER), []);
  assert.deepEqual(groupAlbums(undefined, ORDER), []);
});

test('groupAlbums：没登记的分类排在后面，按出现的先后，名字就用分类本身', () => {
  const albums = groupAlbums([p(1, 'Macro'), p(2, 'Street'), p(3, 'Film'), p(4, 'Macro'), p(5, undefined)], ORDER);
  assert.deepEqual(albums.map((a) => a.key), ['Street', 'Macro', 'Film', 'Archive']);
  assert.deepEqual(albums[1].name, { zh: 'Macro', en: 'Macro' });
  assert.deepEqual(albums[1].photos.map((x) => x.id), [1, 4]);
  assert.equal(albums[3].photos[0].id, 5);
});

test('groupAlbums：不改传入的数组', () => {
  const photos = Object.freeze([Object.freeze(p(1, 'Street')), Object.freeze(p(2, 'Her'))]);
  const albums = groupAlbums(photos, Object.freeze(ORDER));
  assert.equal(photos.length, 2);
  assert.equal(albums.reduce((n, a) => n + a.photos.length, 0), 2);
});
