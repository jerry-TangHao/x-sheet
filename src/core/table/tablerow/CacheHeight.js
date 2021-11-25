class CacheItems {

  constructor() {
    this.items = [];
    this.min = Infinity;
    this.max = -Infinity;
  }

  get(eri) {
    return this.items[eri];
  }

  set(eri, val) {
    this.items[eri] = val;
    if (eri < this.min) {
      this.min = eri;
    }
    if (eri > this.max) {
      this.max = eri;
    }
  }

}

class CacheHeight {

  constructor() {
    this.cache = [];
  }

  clear() {
    this.cache = [];
  }

  get(sri, eri) {
    const items = this.cache[sri];
    return items ? items.get(eri) : null;
  }

  getItems(sri) {
    return this.cache[sri];
  }

  add(sri, eri, height) {
    const items = this.cache[sri] || new CacheItems();
    items.set(eri, height);
    this.cache[sri] = items;
  }

}

export {
  CacheHeight,
};
