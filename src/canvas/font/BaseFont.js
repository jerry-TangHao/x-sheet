class BaseFont {

  constructor({
    draw, ruler, attr,
  }) {
    this.draw = draw;
    this.ruler = ruler;
    this.attr = attr;
  }

  setRuler(ruler) {
    this.ruler = ruler;
  }

  getAlignPadding() {
    if (this.attr.align === BaseFont.ALIGN.center) {
      return 0;
    }
    return this.attr.padding;
  }

  isBlank(text) {
    return text === null || text === undefined || text.toString().trim() === '';
  }

  hasBreak(text) {
    return text.indexOf('\n') > -1;
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
