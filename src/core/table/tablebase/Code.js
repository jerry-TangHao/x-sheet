import { ScaleAdapter } from './Scale';

class Code {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    height = 33,
    width = 50,
    background = '#f6f7fa',
    color = '#585757',
    size = 11,
    gridColor = '#e8e8e8',
  }) {
    this.scaleAdapter = scaleAdapter;
    this.height = height;
    this.width = width;
    this.background = background;
    this.color = color;
    this.size = size;
    this.gridColor = gridColor;
  }

  getGridColor() {
    const { gridColor } = this;
    return gridColor;
  }

  getColor() {
    const { color } = this;
    return color;
  }

  getSize() {
    const { scaleAdapter } = this;
    const { size } = this;
    return scaleAdapter.goto(size);
  }

  getBackground() {
    const { background } = this;
    return background;
  }

  getHeight() {
    const { scaleAdapter } = this;
    const { height } = this;
    return scaleAdapter.goto(height);
  }

  getWidth() {
    const { scaleAdapter } = this;
    const { width } = this;
    return scaleAdapter.goto(width);
  }

}

export { Code };
