class Box {

  constructor({
    rect, draw, path, background,
  }) {
    this.draw = draw;
    this.path = path;
    this.rect = rect;
    this.background = background;
  }

  setPath({
    path,
  }) {
    this.path = path;
  }

  setRect({
    rect,
  }) {
    this.rect = rect;
  }

  setBackground({
    color,
  }) {
    this.background = color;
  }

  render() {
    const { draw, rect, path, background } = this;
    if (rect && background) {
      draw.attr({
        fillStyle: background,
      });
      draw.fillRect(rect.x, rect.y, rect.width, rect.height);
      return;
    }
    if (path && background) {
      draw.attr({
        fillStyle: background,
      });
      draw.fillPath(path);
    }
  }

}

export { Box };
