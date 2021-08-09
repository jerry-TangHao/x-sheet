import { AngleBoxRuler } from './AngleBoxRuler';
import { BaseFont } from '../../BaseFont';
import { SheetUtils } from '../../../../utils/SheetUtils';

class AngleBarRuler extends AngleBoxRuler {

  constructor({
    draw, text, rect, overflow,
    size, angle, align, verticalAlign, textWrap, padding,
    lineHeight = 8,
  }) {
    super({
      draw, text, size, angle, rect, overflow, align, verticalAlign, textWrap, lineHeight, padding,
    });
    this.overflowTextCenterX = 0;
    this.textWrapTextCenterX = 0;
  }

  overflowRuler() {
    if (this.used) {
      return;
    }
    super.overflowRuler();
    const { overflowBlockWidth } = this;
    this.overflowTextCenterX = overflowBlockWidth / 2;
  }

  textWrapRuler() {
    if (this.used) {
      return;
    }
    super.textWrapRuler();
    const { textWrapTextArray, textWrapTextWidth } = this;
    const head = SheetUtils.arrayHead(textWrapTextArray);
    const last = SheetUtils.arrayLast(textWrapTextArray);
    if (head !== last) {
      const headCenter = head.tx + head.blockWidth / 2;
      const lastCenter = last.tx + last.blockWidth / 2;
      const textCenter = lastCenter - headCenter;
      this.textWrapTextCenterX = headCenter + textCenter / 2;
    } else {
      this.textWrapTextCenterX = textWrapTextWidth / 2;
    }
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.constructor !== AngleBarRuler) {
      return false;
    }
    if (other.text !== this.text) {
      return false;
    }
    if (other.size !== this.size) {
      return false;
    }
    if (other.angle !== this.angle) {
      return false;
    }
    if (other.align !== this.align) {
      return false;
    }
    if (other.verticalAlign !== this.verticalAlign) {
      return false;
    }
    if (other.textWrap !== this.textWrap) {
      return false;
    }
    if (other.padding !== this.padding) {
      return false;
    }
    const diffWidth = other.overflow.width !== this.overflow.width;
    const diffHeight = other.overflow.height !== this.overflow.height;
    if (diffWidth || diffHeight) {
      return false;
    }
    switch (this.textWrap) {
      case BaseFont.TEXT_WRAP.WORD_WRAP: {
        if (other.lineHeight !== this.lineHeight) {
          return false;
        }
        break;
      }
    }
    return true;
  }

}

export {
  AngleBarRuler,
};
