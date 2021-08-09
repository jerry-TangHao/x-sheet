class BaseFont {

  constructor({
    draw, ruler, attr,
  }) {
    this.draw = draw;
    this.attr = attr;
    this.ruler = ruler;
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
BaseFont.DEFAULT_FONT_ATTR = {
  name: 'Arial',
  size: 14,
  color: 'rgb(0,0,0)',
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  angle: 0,
  padding: 8,
  align: BaseFont.ALIGN.left,
  textWrap: BaseFont.TEXT_WRAP.TRUNCATE,
  verticalAlign: BaseFont.VERTICAL_ALIGN.center,
  direction: BaseFont.TEXT_DIRECTION.HORIZONTAL,
};
BaseFont.DEFAULT_RICH_ATTR = {
  angle: 0,
  padding: 8,
  align: BaseFont.ALIGN.left,
  textWrap: BaseFont.TEXT_WRAP.TRUNCATE,
  verticalAlign: BaseFont.VERTICAL_ALIGN.center,
  direction: BaseFont.TEXT_DIRECTION.HORIZONTAL,
};
BaseFont.DEFAULT_RICH_ITEM_ATTR = {
  name: 'Arial',
  size: 14,
  color: 'rgb(0,0,0)',
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
};

export {
  BaseFont,
};
