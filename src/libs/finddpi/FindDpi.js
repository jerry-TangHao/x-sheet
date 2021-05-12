(function (root, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory() : typeof define === 'function' && define.amd
      ? define(factory) : typeof layui === 'object' && layui.define
        ? layui.define((exports) => { exports('findDPI', factory()); }) : (global.findDPI = global.findDPI = factory());
}(this, () => {

  function findFirstPositive(fn) {
    let start = 1;
    while (fn(start) <= 0) start <<= 1;
    return binSearch(fn, start >>> 1, start) | 0;
  }

  function findDPI() {
    return findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches);
  }

  function binSearch(fn, min, max) {
    if (max < min) return -1; // not found

    let mid = (min + max) >>> 1;
    if (fn(mid) > 0) {
      if (mid === min || fn(mid - 1) <= 0) {
        return mid;
      }
      return binSearch(fn, min, mid - 1);
    }
    return binSearch(fn, mid + 1, max);
  }

  return findDPI;
}));
