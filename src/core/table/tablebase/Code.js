import { ScaleAdapter } from './Scale';

class Code {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    height = 33,
    width = 50,
    background = 'rgb(246,247,250)',
    color = 'rgb(88,87,87)',
    size = 11,
    gridColor = 'rgb(232,232,232)',
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
