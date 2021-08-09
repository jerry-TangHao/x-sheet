import { BaseFont } from '../../BaseFont';
import {RichAngleBoxDraw} from "../draw/RichAngleBoxDraw";
import {RichAngleBarDraw} from "../draw/RichAngleBarDraw";
import {RichHorizonDraw} from "../draw/RichHorizonDraw";
import {RichVerticalDraw} from "../draw/RichVerticalDraw";
import {RichHorizonRuler} from "../ruler/RichHorizonRuler";
import {RichVerticalRuler} from "../ruler/RichVerticalRuler";
import {RichAngleBoxRuler} from "../ruler/RichAngleBoxRuler";
import {RichAngleBarRuler} from "../ruler/RichAngleBarRuler";
import { SheetUtils } from '../../../../utils/SheetUtils';

class RichDrawTextBuilder {

  constructor({
    draw, rich, rect, overflow, attr
  }) {
    this.attr = SheetUtils.extends({}, BaseFont.DEFAULT_RICH_ATTR, attr);
    this.rich = rich;
    this.rect = rect;
    this.draw = draw;
    this.overflow = overflow;
  }

  buildFont() {
    const { rich, attr, draw, rect , overflow } = this;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new RichHorizonDraw({
          draw, rich, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new RichAngleBoxDraw({
          draw, rich, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new RichVerticalDraw({
          draw, rich, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new RichAngleBarDraw({
          draw, rich, rect, overflow, attr,
        });
    }
    return null;
  }

  buildRuler() {
    const { attr, draw, rect, overflow } = this;
    const rich = this.rich.map(item => item);
    const { align, padding, textWrap } = attr;
    const { name, size, bold, italic, angle } = attr;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new RichHorizonRuler({
          draw, rich, rect, overflow,
          name, size, bold, italic, align, padding, textWrap,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new RichVerticalRuler({
          draw, rich, rect, overflow,
          name, size, bold, italic, align, padding, textWrap,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new RichAngleBoxRuler({
          draw, rich, rect, overflow,
          name, size, bold, italic, angle, align, padding, textWrap,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new RichAngleBarRuler({
          draw, rich, rect, overflow,
          name, size, bold, italic, angle, align, padding, textWrap,
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
  RichDrawTextBuilder
}
