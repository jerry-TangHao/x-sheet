import { PlainUtils } from '../../utils/PlainUtils';
import { VerticalFont } from './VerticalFont';
import { AngleFont } from './AngleFont';
import { HorizontalFont } from './HorizontalFont';
import { BaseFont } from './BaseFont';
import { AngleBarFont } from './AngleBarFont';

class XFontBuilder {

  constructor({
    text, dw, rect, attr, overflow,
  }) {
    this.attr = PlainUtils.mergeDeep({}, {
      verticalAlign: BaseFont.VERTICAL_ALIGN.center,
      direction: BaseFont.TEXT_DIRECTION.HORIZONTAL,
      name: 'Arial',
      size: 14,
      color: '#000000',
      underline: false,
      strikethrough: false,
      bold: false,
      italic: false,
      textWrap: BaseFont.TEXT_WRAP.TRUNCATE,
      align: BaseFont.ALIGN.left,
      angle: 0,
      padding: 8,
    }, attr);
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.overflow = overflow;
  }

  setPadding(padding) {
    this.attr.padding = padding;
  }

  setSize(size) {
    this.attr.size = size;
  }

  setDirection(direction) {
    this.attr.direction = direction;
  }

  build() {
    const { text, dw, rect, attr, overflow } = this;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new AngleFont({
          text, rect, dw, attr: this.attr, overflow,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new AngleBarFont({
          text, rect, dw, attr: this.attr, overflow,
        });
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new HorizontalFont({
          text, rect, dw, attr: this.attr, overflow,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new VerticalFont({
          text, rect, dw, attr: this.attr,
        });
    }
    return null;
  }

}

export {
  XFontBuilder,
};
