class Rect {

  /**
   * Rect
   * @param x
   * @param y
   * @param width
   * @param height
   */
  constructor({
    x, y, width, height,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * 判断两个矩形是否不发生重合
   * @param {Rect} other 区域
   * @returns {boolean}
   */
  disjoint(other) {
    return this.x > other.x + other.width
      || this.y > this.y + other.height
      || other.x > this.x + this.width
      || other.y > this.y + this.height;
  }

  /**
   * 扩展尺寸
   * @param size
   * @returns {Rect}
   */
  expandSize(size) {
    this.width += size;
    this.height += size;
    return this;
  }

  /**
   * 是否包含点
   * @param x
   * @param y
   * @returns {boolean}
   */
  includePoint(x, y) {
    return x >= this.x && x <= this.x + this.width
      && y >= this.y && y <= this.y + this.height;
  }

  /**
   * 是否包含矩形
   * @param rect
   * @returns {boolean|boolean}
   */
  includeRect(rect) {
    const { x, y, width, height } = rect;
    return this.x <= x && this.x + this.width >= x + width
      && this.y <= y && this.y + this.height >= y + height;
  }

  /**
   * 计算当前矩形在指定矩形内部的位置
   * @param rect
   * @returns {Rect}
   */
  inRectPosition(rect) {
    return new Rect({
      x: this.x - rect.x,
      y: this.y - rect.y,
      width: this.width,
      height: this.height,
    });
  }

  /**
   * 复制
   * @returns {Rect}
   */
  clone() {
    const { x, y, width, height } = this;
    return new Rect({ x, y, width, height });
  }

}

export { Rect };
