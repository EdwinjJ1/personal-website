import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapPhotos, orderPhotos } from '../pipeline/photos.mjs';

const photo = (id, extra = {}) => ({
  id, title: `t${id}`, location: 'Sydney', description: 'd', category: 'Street', image: `/images/photography/${id}.jpg`,
  date: '2026-03', camera: 'Lumix S9', settings: '35mm • f/2', ...extra,
});

test('mapPhotos：全部保留、顺序不变、字段归一，source 指到旧站的 public 目录', () => {
  const list = Array.from({ length: 60 }, (_, i) => photo(i + 1));
  const out = mapPhotos(list, '/legacy/public');
  assert.equal(out.length, 60);
  assert.deepEqual(out.map((p) => p.id), list.map((p) => p.id));
  assert.deepEqual(out[0], {
    id: 1, title: 't1', location: 'Sydney', category: 'Street', date: '2026-03', camera: 'Lumix S9', settings: '35mm • f/2',
    description: 'd', series: '', source: '/legacy/public/images/photography/1.jpg',
  });
});

test('mapPhotos：占位的相机信息清空，系列名保留，日期统一成字符串', () => {
  const out = mapPhotos([
    photo(1, { camera: 'Unknown — WeChat export', settings: 'EXIF unavailable', series: 'Her', seriesOrder: 1, date: 2026 }),
    photo(2, { camera: undefined, settings: undefined, location: undefined, description: undefined }),
  ], '/p');
  assert.deepEqual([out[0].camera, out[0].settings, out[0].series, out[0].date], ['', '', 'Her', '2026']);
  assert.ok(!('seriesOrder' in out[0]));
  assert.deepEqual([out[1].camera, out[1].settings, out[1].location, out[1].description], ['', '', '', '']);
});

test('mapPhotos：同一个 id 或同一张图只留第一条；缺图、缺标题、id 不是整数的丢掉', () => {
  const out = mapPhotos([
    photo(1), photo(1, { title: 'same id' }), photo(2, { image: '/images/photography/1.jpg' }),
    photo(3, { image: '' }), photo(4, { title: '  ' }), photo('x'), null, photo(5, { category: '' }),
  ], '/p');
  assert.deepEqual(out.map((p) => [p.id, p.title]), [[1, 't1'], [5, 't5']]);
  assert.equal(out[1].category, 'Archive');
});

test('mapPhotos：不改传入的数组和对象', () => {
  const list = Object.freeze([Object.freeze(photo(1, { title: ' padded ' }))]);
  const out = mapPhotos(list, '/p');
  assert.equal(out[0].title, 'padded');
  assert.equal(list[0].title, ' padded ');
  assert.deepEqual(mapPhotos([], '/p'), []);
});

test('orderPhotos：人像和 Her 先按拍摄系列排、再按日期倒序；其他分类只按日期倒序', () => {
  const list = [
    photo(1, { category: 'Her', seriesOrder: 20, date: '2026-07-01' }),
    photo(2, { category: 'Her', seriesOrder: 0, date: '2026' }),
    photo(3, { category: 'Her', date: '2026-08' }),
    photo(4, { category: 'Portrait', seriesOrder: 2, date: '2025-01' }),
    photo(5, { category: 'Portrait', seriesOrder: 1, date: '2024-01' }),
    photo(6, { category: 'Portrait', seriesOrder: 1, date: '2026-01' }),
    photo(7, { category: 'Night', seriesOrder: 1, date: '2025-03' }),
    photo(8, { category: 'Night', date: '2026-02-11' }),
    photo(9, { category: 'Night', seriesOrder: 9, date: '2026-02-12' }),
  ];
  const ids = (category) => orderPhotos(list).filter((p) => p.category === category).map((p) => p.id);
  assert.deepEqual(ids('Her'), [2, 1, 3]);
  assert.deepEqual(ids('Portrait'), [6, 5, 4]);
  assert.deepEqual(ids('Night'), [9, 8, 7]);
});

test('orderPhotos：只有年份或年月的日期也能比；排不出先后的保持原来的顺序；不改传入的数组', () => {
  const list = Object.freeze([photo(1, { date: '2026' }), photo(2, { date: '2026-03' }), photo(3, { date: '2026' }), photo(4, { date: undefined }), photo(5, { date: '2025-12-31' })]);
  assert.deepEqual(orderPhotos(list).map((p) => p.id), [2, 1, 3, 5, 4]);
  assert.deepEqual(list.map((p) => p.id), [1, 2, 3, 4, 5]);
  assert.deepEqual(orderPhotos([]), []);
});
