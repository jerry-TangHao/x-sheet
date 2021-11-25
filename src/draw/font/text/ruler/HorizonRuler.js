import { HorizonVisual } from './HorizonVisual';
import { BaseRuler } from '../../BaseRuler';
import { BaseFont } from '../../BaseFont';
import { SheetUtils } from '../../../../utils/SheetUtils';

class HorizonRuler extends HorizonVisual {

  constructor({
    draw, text, rect, overflow, bold,
    name, size, align, textWrap, padding,
    lineHeight = 8,
  }) {
    super({
      text, draw, align, padding,
    });

    this.overflow = overflow;
    this.textWrap = textWrap;
    this.bold = bold;
    this.size = size;
    this.rect = rect;
    this.name = name;
    this.lineHeight = lineHeight;

    // 裁剪文本
    this.truncateText = '';
    this.truncateTextWidth = 0;
    this.truncateTextHeight = 0;
    this.truncateTextAscent = 0;

    // 溢出文本
    this.overflowText = '';
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;
    this.overflowTextAscent = 0;

    // 自动换行文本
    this.textWrapTextArray = [];
    this.textWrapTextHeight = 0;
  }

  truncateRuler() {
    if (this.used) { return; }
    const { rect } = this;
    const { text, width, height, ascent } = this.displayFont(rect);
    this.truncateText = text;
    this.truncateTextAscent = ascent;
    this.truncateTextWidth = width;
    this.truncateTextHeight = height;
    this.setUsedType(BaseRuler.USED.TRUNCATE);
  }

  overflowRuler() {
    if (this.used) { return; }
    const { overflow } = this;
    const { text, width, height, ascent } = this.displayFont(overflow);
    this.overflowText = text;
    this.overflowTextAscent = ascent;
    this.overflowTextWidth = width;
    this.overflowTextHeight = height;
    this.setUsedType(BaseRuler.USED.OVER_FLOW);
  }

  textWrapRuler() {
    if (this.used) { return; }
    const { rect, lineHeight } = this;
    const { width } = rect;
    const alignPadding = this.getAlignPadding();
    const breakArray = this.textBreak();
    const breakLength = breakArray.length;
    const maxRectWidth = width - (alignPadding * 2);
    const textArray = [];
    let textHeight = 0;
    let breakIndex = 0;
    while (breakIndex < breakLength) {
      const text = breakArray[breakIndex];
      const textLength = text.length;
      const line = {
        text: '',
        width: 0,
        height: 0,
        ascent: 0,
      };
      let innerIndex = 0;
      while (innerIndex < textLength) {
        const measureText = line.text + text.charAt(innerIndex);
        const measure = this.textSize(measureText);
        if (measure.width > maxRectWidth) {
          if (line.width === 0) {
            textArray.push({
              tx: 0,
              ty: textHeight,
              text: measureText,
              width: measure.width,
              height: measure.height,
              ascent: measure.ascent,
            });
            innerIndex += 1;
          } else {
            textArray.push({
              tx: 0,
              ty: textHeight,
              text: line.text,
              width: line.width,
              height: line.height,
              ascent: line.ascent,
            });
          }
          textHeight += measure.height + lineHeight;
          line.text = '';
          line.width = 0;
          line.height = 0;
          line.ascent = 0;
        } else {
          line.text = measureText;
          line.width = measure.width;
          line.height = measure.height;
          line.ascent = measure.ascent;
          innerIndex += 1;
        }
      }
      if (line.width > 0) {
        textArray.push({
          tx: 0,
          ty: textHeight,
          text: line.text,
          width: line.width,
          height: line.height,
          ascent: line.ascent,
        });
        textHeight += line.height + lineHeight;
      }
      breakIndex += 1;
    }
    if (textHeight > 0) {
      textHeight -= lineHeight;
    }
    this.textWrapTextArray = textArray;
    this.textWrapTextHeight = textHeight;
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.constructor !== HorizonRuler) {
      return false;
    }
    if (other.bold !== this.bold) {
      return false;
    }
    if (other.name !== this.name) {
      return false;
    }
    if (other.text !== this.text) {
      return false;
    }
    if (other.align !== this.align) {
      return false;
    }
    if (other.size !== this.size) {
      return false;
    }
    if (other.padding !== this.padding) {
      return false;
    }
    if (other.textWrap !== this.textWrap) {
      return false;
    }
    const diffWidth = other.rect.width !== this.rect.width;
    const diffHeight = other.rect.height !== this.rect.height;
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
  HorizonRuler,
};
