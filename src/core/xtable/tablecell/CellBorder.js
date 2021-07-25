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
    this.left.setDisplay(display);
  }

  setTDisplay(display) {
    this.top.setDisplay(display);
  }

  setRDisplay(display) {
    this.right.setDisplay(display);
  }

  setBDisplay(display) {
    this.bottom.setDisplay(display);
  }

  setAllColor(color) {
    this.setBColor(color);
    this.setLColor(color);
    this.setTColor(color);
    this.setRColor(color);
  }

  setLColor(color) {
    this.left.setColor(color);
  }

  setTColor(color) {
    this.top.setColor(color);
  }

  setRColor(color) {
    this.right.setColor(color);
  }

  setBColor(color) {
    this.bottom.setColor(color);
  }

  setAllWidthType(widthType) {
    this.setBWidthType(widthType);
    this.setLWidthType(widthType);
    this.setTWidthType(widthType);
    this.setRWidthType(widthType);
  }

  setLWidthType(widthType) {
    this.left.setWidthType(widthType);
  }

  setTWidthType(widthType) {
    this.top.setWidthType(widthType);
  }

  setRWidthType(widthType) {
    this.right.setWidthType(widthType);
  }

  setBWidthType(widthType) {
    this.bottom.setWidthType(widthType);
  }

  setAllType(type) {
    this.setBType(type);
    this.setLType(type);
    this.setTType(type);
    this.setRType(type);
  }

  setLType(type) {
    this.left.setType(type);
  }

  setTType(type) {
    this.top.setType(type);
  }

  setRType(type) {
    this.right.setType(type);
  }

  setBType(type) {
    this.bottom.setType(type);
  }

  updateMaxIndex() {
    const zIndex = Border.getZIndex();
    this.left.setZIndex(zIndex);
    this.bottom.setZIndex(zIndex);
    this.top.setZIndex(zIndex);
    this.right.setZIndex(zIndex);
  }

  clone() {
    const {
      left, top, right, bottom,
    } = this;
    return new CellBorder({
      left, top, right, bottom,
    });
  }

}

export { CellBorder };
