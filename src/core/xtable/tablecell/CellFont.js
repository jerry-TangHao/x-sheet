import { BaseFont } from '../../../draw/font/BaseFont';
import { ColorArray } from '../../../module/colorpicker/colorarray/ColorArray';

/**
 *  CellFont
 *  @author jerry
 */
class CellFont {

  /**
   * CellFont
   * @param align
   * @param verticalAlign
   * @param textWrap
   * @param strikethrough
   * @param underline
   * @param color
   * @param name
   * @param size
   * @param bold
   * @param italic
   * @param angle
   * @param direction
   * @param padding
   */
  constructor({
    align = BaseFont.ALIGN.left,
    verticalAlign = BaseFont.VERTICAL_ALIGN.center,
    textWrap = BaseFont.TEXT_WRAP.TRUNCATE,
    strikethrough = false,
    underline = false,
    color = ColorArray.BLACK,
    name = 'Arial',
    size = 14,
    bold = false,
    italic = false,
    angle = 0,
    direction = BaseFont.TEXT_DIRECTION.HORIZONTAL,
    padding = 5,
  }) {
    this.align = align;
    this.verticalAlign = verticalAlign;
    this.textWrap = textWrap;
    this.strikethrough = strikethrough;
    this.underline = underline;
    this.color = color;
    this.name = name;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
    this.direction = direction;
    this.angle = angle;
    this.padding = padding;
  }

  clone() {
    const {
      align,
      verticalAlign,
      textWrap,
      strikethrough,
      underline,
      color,
      name,
      size,
      bold,
      italic,
      angle,
      direction,
      padding,
    } = this;
    return new CellFont({
      align,
      verticalAlign,
      textWrap,
      strikethrough,
      underline,
      color,
      name,
      size,
      bold,
      italic,
      angle,
      direction,
      padding,
    });
  }

  reset() {
    this.align = BaseFont.ALIGN.left;
    this.verticalAlign = BaseFont.VERTICAL_ALIGN.center;
    this.textWrap = BaseFont.TEXT_WRAP.TRUNCATE;
    this.strikethrough = false;
    this.underline = false;
    this.color = ColorArray.BLACK;
    this.name = 'Arial';
    this.size = 14;
    this.bold = false;
    this.italic = false;
    this.angle = 0;
    this.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
    this.padding = 5;
  }

  equals(other) {
    let keys1 = Object.keys(this);
    let keys2 = Object.keys(other);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
    }
    for (let key of keys1) {
      if (this[key] !== other[key]) {
        return false;
      }
    }
    return true;
  }

}

CellFont.scaleAdapter = null;

export { CellFont };
