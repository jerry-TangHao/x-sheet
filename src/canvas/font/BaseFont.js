class BaseFont {

  constructor({
    text, dw, attr, rect,
  }) {
    this.text = text;
    this.dw = dw;
    this.attr = attr;
    this.rect = rect;
  }

  truncateFont() {
    throw new TypeError('child impl');
  }

  overflowFont() {
    throw new TypeError('child impl');
  }

  wrapTextFont() {
    throw new TypeError('child impl');
  }

  draw() {
    throw new TypeError('child impl');
  }

  /**
   * 文字宽度测量(性能杀手,考虑缓存优化)
   * @param text
   * @returns {number}
   */
  textWidth(text) {
    return this.dw.measureText(text).width;
  }

  textBreak(text) {
    return text.split(/\n/);
  }

  hasBreak(text) {
    return text.indexOf('\n') > -1;
  }

  isBlank(text) {
    return text === null || text === undefined || text.toString().trim() === '';
  }

  getAlignPadding() {
    if (this.attr.align === BaseFont.ALIGN.center) {
      return 0;
    }
    return this.attr.padding;
  }

  getVerticalAlignPadding() {
    if (this.attr.verticalAlign === BaseFont.VERTICAL_ALIGN.center) {
      return 0;
    }
    return this.attr.padding;
  }

}
BaseFont.VERTICAL_ALIGN = {
  top: 'top',
  center: 'middle',
  bottom: 'bottom',
};
BaseFont.ALIGN = {
  left: 'left',
  center: 'center',
  right: 'right',
};
BaseFont.TEXT_WRAP = {
  OVER_FLOW: 1,
  WORD_WRAP: 2,
  TRUNCATE: 3,
};
BaseFont.TEXT_DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  ANGLE: 'angle',
  ANGLE_BAR: 'anglebar',
};
export {
  BaseFont,
};
