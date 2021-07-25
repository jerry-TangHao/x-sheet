class RichVerticalWrapLine {

  constructor({
    offsetX = 0,
    offsetY = 0,
    items = [],
    width = 0,
    height = 0,
  }) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.index = 0;
    this.items = items;
    this.width = width;
    this.height = height;
    if (items.length) {
      this.index = items.length - 1;
    }
  }

  addOffsetY(y) {
    this.offsetY += y;
  }

  addOffsetX(x) {
    this.offsetX += x;
  }

  addHeight(height) {
    this.height += height;
  }

  resetWrapLine() {
    this.offsetX = 0;
    this.index = 0;
    this.items = [];
    this.width = 0;
    this.height = 0;
  }

  nextLineItem() {
    if (this.items.length) {
      this.index++;
    } else {
      this.index = 0;
    }
  }

  getOrNewItem(options) {
    const item = this.items[this.index];
    if (item) {
      return item;
    }
    this.items[this.index] = { ...options };
    return this.items[this.index];
  }

}

export {
  RichVerticalWrapLine,
};
