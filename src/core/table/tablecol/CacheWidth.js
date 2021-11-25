
class CacheItems {

  constructor() {
    this.items = [];
    this.min = Infinity;
    this.max = -Infinity;
  }

  get(eci) {
    return this.items[eci];
  }

  set(eci, val) {
    this.items[eci] = val;
    if (eci < this.min) {
      this.min = eci;
    }
    if (eci > this.max) {
      this.max = eci;
    }
  }

}

class CacheWidth {

  constructor() {
    this.cache = [];
  }

  clear() {
    this.cache = [];
  }

  get(sci, eci) {
    const items = this.cache[sci];
    return items ? items.get(eci) : null;
  }

  getItems(sci) {
    return this.cache[sci];
  }

  add(sci, eci, width) {
    const items = this.cache[sci] || new CacheItems();
    items.set(eci, width);
    this.cache[sci] = items;
  }

}

export {
  CacheWidth,
};
