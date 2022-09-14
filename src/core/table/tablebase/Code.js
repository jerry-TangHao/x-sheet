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
    displayLeftIndex = true,
    displayTopIndex = true,
  }) {
    this.displayLeftIndex = displayLeftIndex;
    this.displayTopIndex = displayTopIndex;
    this.size = size;
    this.background = background;
    this.color = color;
    this.gridColor = gridColor;
    this.scaleAdapter = scaleAdapter;
    // 保留边框
    this.width = width < 1 || !displayLeftIndex ? 1 : width;
    this.height = height < 1 || !displayTopIndex ? 1 : height;
  }

  isDisplayTopIndex() {
    return this.displayTopIndex;
  }

  isDisplayLeftIndex() {
    return this.displayLeftIndex;
  }

  getSize() {
    const { scaleAdapter } = this;
    const { size } = this;
    return scaleAdapter.goto(size);
  }

  getGridColor() {
    const { gridColor } = this;
    return gridColor;
  }

  getColor() {
    const { color } = this;
    return color;
  }

  getWidth() {
    const { scaleAdapter } = this;
    const { width } = this;
    return scaleAdapter.goto(width);
  }

  getHeight() {
    const { scaleAdapter } = this;
    const { height } = this;
    return scaleAdapter.goto(height);
  }

  getBackground() {
    const { background } = this;
    return background;
  }

}

export { Code };
