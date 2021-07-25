class Box {

  constructor({
    rect,
    draw,
    path,
    background,
  }) {
    this.draw = draw;
    this.path = path;
    this.rect = rect;
    this.background = background;
  }

  setRect({ rect }) {
    this.rect = rect;
    return this;
  }

  setPath({ path }) {
    this.path = path;
    return this;
  }

  renderPath() {
    const { draw, path, background } = this;
    if (path && background) {
      draw.attr({
        fillStyle: background,
      });
      draw.fillPath(path);
    }
    return this;
  }

  renderRect() {
    const { draw, rect, background } = this;
    if (rect && background) {
      draw.attr({
        fillStyle: background,
      });
      draw.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    return this;
  }

  setBackground({ color }) {
    this.background = color;
    return this;
  }

}

export { Box };
