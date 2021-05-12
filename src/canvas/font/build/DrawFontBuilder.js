import { BaseFont } from '../BaseFont';
import { AngleBoxDraw } from '../draw/AngleBoxDraw';
import { AngleBarDraw } from '../draw/AngleBarDraw';
import { HorizonDraw } from '../draw/HorizonDraw';
import { VerticalDraw } from '../draw/VerticalDraw';
import { AngleBoxRuler } from '../ruler/AngleBoxRuler';
import { AngleBarRuler } from '../ruler/AngleBarRuler';
import { HorizonRuler } from '../ruler/HorizonRuler';
import { VerticalRuler } from '../ruler/VerticalRuler';
import { PlainUtils } from '../../../utils/PlainUtils';

class DrawFontBuilder {

  constructor({
    draw, text, rect, overflow, attr,
  }) {
    this.attr = Object.assign({}, {
      verticalAlign: BaseFont.VERTICAL_ALIGN.center,
      direction: BaseFont.TEXT_DIRECTION.HORIZONTAL,
      name: 'Arial',
      size: 14,
      color: 'rgb(0,0,0)',
      underline: false,
      strikethrough: false,
      bold: false,
      italic: false,
      textWrap: BaseFont.TEXT_WRAP.TRUNCATE,
      align: BaseFont.ALIGN.left,
      angle: 0,
      padding: 8,
    }, attr);
    this.draw = draw;
    this.text = text;
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

  buildFont() {
    const { draw, rect, attr, overflow } = this;
    const text = PlainUtils.safeValue(this.text).toString();
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new AngleBoxDraw({
          draw, text, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new AngleBarDraw({
          draw, text, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new HorizonDraw({
          draw, text, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new VerticalDraw({
          draw, text, rect, overflow, attr,
        });
    }
    return null;
  }

  buildRuler() {
    const { attr, draw, rect, overflow } = this;
    const { size, align, angle } = attr;
    const { padding, textWrap } = attr;
    const text = PlainUtils.safeValue(this.text).toString();
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new AngleBoxRuler({
          draw, text, size, angle, rect, overflow, align, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new AngleBarRuler({
          draw, text, size, angle, rect, overflow, align, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new HorizonRuler({
          draw, text, size, rect, overflow, align, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new VerticalRuler({
          draw, text, size, rect, overflow, align, textWrap, padding
        });
    }
    return null;
  }

}

export {
  DrawFontBuilder,
};
