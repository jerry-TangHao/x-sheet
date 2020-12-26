class XMergesItems {

  constructor() {
    this.recovery = [];
    this.items = [];
  }

  get(point) {
    return this.items[point];
  }

  add(item) {
    const point = this.recovery.pop();
    if (point) {
      this.items[point] = item;
      return point;
    }
    this.items.push(item);
    return this.items.length - 1;
  }

  clear(point) {
    this.items[point] = null;
    this.recovery.push(point);
  }

  getItems() {
    return this.items;
  }

}

export {
  XMergesItems,
};
