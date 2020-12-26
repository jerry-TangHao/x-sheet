import { PlainUtils } from '../../../utils/PlainUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';

/**
 * Cell
 * @author jerry
 */
class Cell {

  /**
   * Cell
   * @param text
   * @param background
   * @param format
   * @param fontAttr
   * @param icons
   * @param borderAttr
   * @param contentWidth
   * @param leftSdistWidth
   * @param rightSdistWidth
   */
  constructor({
    text = PlainUtils.EMPTY,
    background = PlainUtils.Nul,
    format = 'default',
    borderAttr = {},
    icons = [],
    fontAttr = {},
    contentWidth = 0,
    leftSdistWidth = 0,
    rightSdistWidth = 0,
  }) {
    this.text = text;
    this.ruler = null;
    this.background = background;
    this.format = format;
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.contentWidth = contentWidth;
    this.leftSdistWidth = leftSdistWidth;
    this.rightSdistWidth = rightSdistWidth;
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
  }

  setIcons(icons) {
    this.icons = icons;
  }

  setText(text) {
    this.text = text;
    this.setContentWidth(0);
    this.setLeftSdistWidth(0);
    this.setRightSdistWidth(0);
  }

  setRuler(ruler) {
    this.ruler = ruler;
  }

  setLeftSdistWidth(leftSdistWidth) {
    this.leftSdistWidth = leftSdistWidth;
  }

  setRightSdistWidth(rightSdistWidth) {
    this.rightSdistWidth = rightSdistWidth;
  }

  clone() {
    const { background, format, text, fontAttr, borderAttr, contentWidth, icons } = this;
    return new Cell({
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    });
  }

  toJSON() {
    const { background, format, text, fontAttr, borderAttr, contentWidth, icons } = this;
    return {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    };
  }

}

export { Cell };
