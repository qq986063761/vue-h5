import ResizeObserver from 'resize-observer-polyfill'
const isServer = typeof window === 'undefined';

const resizeHandler = function(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
}

export const addResizeListener = function(element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

/**
 * 获取真实的dom样式
 * @param {Object} el 元素
 */
export function getStyle(el) {
  return (window.getComputedStyle ?
    window.getComputedStyle(el, null) :
    el.currentStyle)
}