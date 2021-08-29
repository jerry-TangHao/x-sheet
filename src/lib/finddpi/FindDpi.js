function binSearch(fn, min, max) {
  // not found
  if (max < min) return -1;
  // eslint-disable-next-line no-bitwise
  let mid = (min + max) >>> 1;
  if (fn(mid) > 0) {
    if (mid === min || fn(mid - 1) <= 0) {
      return mid;
    }
    return binSearch(fn, min, mid - 1);
  }
  return binSearch(fn, mid + 1, max);
}

function findFirstPositive(fn) {
  let start = 1;
  // eslint-disable-next-line no-bitwise
  while (fn(start) <= 0) start <<= 1;
  // eslint-disable-next-line no-bitwise
  return binSearch(fn, start >>> 1, start) | 0;
}

function FindDPI() {
  // eslint-disable-next-line no-undef
  return findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches);
}

export { FindDPI };
