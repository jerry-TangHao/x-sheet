class BaseFont {

  constructor({
    draw, ruler, attr,
  }) {
    this.draw = draw;
    this.attr = attr;
    this.ruler = ruler;
  }

  hasBreak(text) {
    return text.indexOf('\n') > -1;
  }

  setRuler(ruler) {
    this.ruler = ruler;
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
  ANGLE_BAR: 'bar',
};
export {
  BaseFont,
};
