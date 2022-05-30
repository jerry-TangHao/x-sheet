class RichHorizonWrapLineItem {
  constructor({
    text = '',
    style = {},
    tx = 0,
    ty = 0,
    width = 0,
    height = 0,
  } = {}) {
    this.text = text;
    this.tx = tx;
    this.ty = ty;
    this.style = style;
    this.width = width;
    this.height = height;
  }
}

class RichHorizonWrapLine {

  static wrapAlignBottom(items) {
    let maxHeight = 0;
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      if (item.height > maxHeight) {
        maxHeight = item.height;
      }
    }
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      const diff = maxHeight - item.height;
      item.ty += diff;
    }
  }

  constructor({
    offsetX = 0,
    offsetY = 0,
    items = [],
    width = 0,
    height = 0,
  } = {}) {
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

  addWidth(width) {
    this.width += width;
  }

  resetWrapLine() {
    const { items } = this;
    RichHorizonWrapLine.wrapAlignBottom(items);
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
    this.items[this.index] = new RichHorizonWrapLineItem(options);
    return this.items[this.index];
  }

}

export {
  RichHorizonWrapLine,
};
