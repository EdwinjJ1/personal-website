// 摄影合集：把照片按分类归成一组一组，每组第一张是封面。纯函数，方便测试。

/**
 * order 是 [{ key, name: { zh, en } }]，决定合集的先后和显示的名字；
 * 没登记的分类排在后面（按出现的先后），名字就用分类本身。没有照片的合集不出现。
 * 返回 [{ key, name, cover, photos }]，照片保持传入的顺序。
 */
export function groupAlbums(photos, order) {
  const groups = (photos || []).reduce((map, p) => {
    const key = p.category || 'Archive';
    return new Map(map).set(key, [...(map.get(key) || []), p]);
  }, new Map());
  const known = order.filter((a) => groups.has(a.key));
  const extra = [...groups.keys()].filter((key) => !order.some((a) => a.key === key)).map((key) => ({ key, name: { zh: key, en: key } }));
  return [...known, ...extra].map((a) => ({ key: a.key, name: a.name, cover: groups.get(a.key)[0], photos: groups.get(a.key) }));
}
