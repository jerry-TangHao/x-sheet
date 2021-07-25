import { BaseFont } from '../../BaseFont';
import { AngleBoxDraw } from '../draw/AngleBoxDraw';
import { AngleBarDraw } from '../draw/AngleBarDraw';
import { HorizonDraw } from '../draw/HorizonDraw';
import { VerticalDraw } from '../draw/VerticalDraw';
import { AngleBoxRuler } from '../ruler/AngleBoxRuler';
import { AngleBarRuler } from '../ruler/AngleBarRuler';
import { HorizonRuler } from '../ruler/HorizonRuler';
import { VerticalRuler } from '../ruler/VerticalRuler';
import { PlainUtils } from '../../../../utils/PlainUtils';

class DrawTextBuilder {

  constructor({
    draw, text, rect, overflow, attr,
  }) {
    this.attr = PlainUtils.extends({}, BaseFont.DEFAULT_FONT_ATTR, attr);
    this.text = text;
    this.rect = rect;
    this.draw = draw;
    this.overflow = overflow;
  }

  buildFont() {
    const { text, attr, draw, rect , overflow } = this;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new HorizonDraw({
          draw, text, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new VerticalDraw({
          draw, text, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new AngleBoxDraw({
          draw, text, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new AngleBarDraw({
          draw, text, rect, overflow, attr,
        });
    }
    return null;
  }

  buildRuler() {
    const { text, attr, draw, rect, overflow } = this;
    const { size, align, angle } = attr;
    const { padding, textWrap } = attr;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new HorizonRuler({
          draw, text, size, rect, overflow,
          align, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new VerticalRuler({
          draw, text, size, rect, overflow,
          align, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new AngleBoxRuler({
          draw, text, rect, overflow,
          size, angle, align, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new AngleBarRuler({
          draw, text,rect, overflow,
          size, angle, align, textWrap, padding
        });
    }
    return null;
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

}

export {
  DrawTextBuilder,
};
