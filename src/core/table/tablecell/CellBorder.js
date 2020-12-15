import { Border } from './Border';
import { LINE_TYPE } from '../../../canvas/Line';

/**
 * CellBorder
 * @author jerry
 */
class CellBorder {

  /**
   * CellBorder
   * @param time
   * @param left
   * @param top
   * @param right
   * @param bottom
   */
  constructor({
    left = {},
    bottom = {},
    top = {},
    right = {},
  }) {
    this.left = new Border(left);
    this.bottom = new Border(bottom);
    this.top = new Border(top);
    this.right = new Border(right);
  }

  hasDouble() {
    const { top, left, right, bottom } = this;
    if (top.type === LINE_TYPE.DOUBLE_LINE) {
      return true;
    }
    if (left.type === LINE_TYPE.DOUBLE_LINE) {
      return true;
    }
    if (right.type === LINE_TYPE.DOUBLE_LINE) {
      return true;
    }
    return bottom.type === LINE_TYPE.DOUBLE_LINE;
  }

  isDisplay() {
    return this.left.display || this.top.display
      || this.bottom.display || this.right.display;
  }

  setAllDisplay(display) {
    this.setBDisplay(display);
    this.setLDisplay(display);
    this.setTDisplay(display);
    this.setRDisplay(display);
  }

  setLDisplay(display) {
    this.left.display = display;
  }

  setTDisplay(display) {
    this.top.display = display;
  }

  setRDisplay(display) {
    this.right.display = display;
  }

  setBDisplay(display) {
    this.bottom.display = display;
  }

  setAllColor(color) {
    this.setBColor(color);
    this.setLColor(color);
    this.setTColor(color);
    this.setRColor(color);
  }

  setLColor(color) {
    this.left.color = color;
  }

  setTColor(color) {
    this.top.color = color;
  }

  setRColor(color) {
    this.right.color = color;
  }

  setBColor(color) {
    this.bottom.color = color;
  }

  setAllWidthType(widthType) {
    this.setBWidthType(widthType);
    this.setLWidthType(widthType);
    this.setTWidthType(widthType);
    this.setRWidthType(widthType);
  }

  setLWidthType(widthType) {
    this.left.widthType = widthType;
  }

  setTWidthType(widthType) {
    this.top.widthType = widthType;
  }

  setRWidthType(widthType) {
    this.right.widthType = widthType;
  }

  setBWidthType(widthType) {
    this.bottom.widthType = widthType;
  }

  setAllType(type) {
    this.setBType(type);
    this.setLType(type);
    this.setTType(type);
    this.setRType(type);
  }

  setLType(type) {
    this.left.type = type;
  }

  setTType(type) {
    this.top.type = type;
  }

  setRType(type) {
    this.right.type = type;
  }

  setBType(type) {
    this.bottom.type = type;
  }

  updateMaxIndex() {
    const zIndex = Border.getZIndex();
    this.bottom.zIndex = zIndex;
    this.left.zIndex = zIndex;
    this.top.zIndex = zIndex;
    this.right.zIndex = zIndex;
  }

  clone() {
    const {
      left,
      top,
      right,
      bottom,
    } = this;
    return new CellBorder({
      left,
      top,
      right,
      bottom,
    });
  }

}

export { CellBorder };
