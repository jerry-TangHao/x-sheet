class Crop {

  constructor({
    rect, draw, offset = 0,
  }) {
    this.rect = rect;
    this.draw = draw;
    this.offset = offset;
  }

  open() {
    const {
      rect, draw, offset,
    } = this;
    const {
      x, y, width, height,
    } = rect;
    draw.save()
      .rect(x, y, width + offset, height + offset)
      .clip()
      .beginPath();
    return this;
  }

  close() {
    const { draw } = this;
    draw.restore();
    return this;
  }

}

export { Crop };
