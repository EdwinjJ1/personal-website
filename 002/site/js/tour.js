// 闲时点名：触屏没有悬停，没人碰的时候就把视野里的物件挨个亮一遍、报一下名字。
// 这里只管排队和计时；亮哪些、怎么亮都由调用方传进来（app.js），所以不碰 DOM，方便测试。

/**
 * list()：这一轮要点名的热点名；idle()：现在能不能点名；show(name) / hide()：亮起来 / 收起来。
 * 一轮走完就停，等下一次 start。
 */
export function createTour({ list, idle, show, hide, step = 2200 }) {
  let timer = null;
  let showing = false;

  const stop = () => {
    clearTimeout(timer);
    timer = null;
    if (showing) hide();
    showing = false;
  };

  const run = (queue) => {
    if (!queue.length || !idle()) { stop(); return; }
    show(queue[0]);
    showing = true;
    timer = setTimeout(() => run(queue.slice(1)), step);
  };

  return {
    /** delay 毫秒之后走一轮；等的时候再调用就从头计时。 */
    start(delay) {
      stop();
      timer = setTimeout(() => run(idle() ? list() : []), delay);
    },
    stop,
  };
}
