import { BaseFont } from '../../../draw/font/BaseFont';

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
    color = 'rgb(0,0,0)',
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

}
CellFont.scaleAdapter = null;

export { CellFont };
