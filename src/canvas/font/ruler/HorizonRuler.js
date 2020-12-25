import { HorizonVisual } from './HorizonVisual';
import { BaseRuler } from '../BaseRuler';
import { BaseFont } from '../BaseFont';

class HorizonRuler extends HorizonVisual {

  constructor({
    draw,
    text,
    size,
    rect,
    overflow,
    align,
    textWrap,
    lineHeight = 4,
    padding,
  }) {
    super({
      text, draw, align, padding,
    });

    this.size = size;
    this.rect = rect;
    this.overflow = overflow;
    this.textWrap = textWrap;
    this.lineHeight = lineHeight;
    this.used = BaseRuler.USED.DEFAULT_INI;

    this.truncateText = '';
    this.truncateTextWidth = 0;

    this.overflowText = '';
    this.overflowTextWidth = 0;

    this.textWrapTextArray = [];
    this.textWrapHOffset = 0;
  }

  equals(other) {
    if (other === null) {
      return false;
    }
    if (other.constructor !== HorizonRuler) {
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
    switch (this.textWrap) {
      case BaseFont.TEXT_WRAP.TRUNCATE: {
        const notWidth = other.rect.width !== this.rect.width;
        const notHeight = other.rect.height !== this.rect.height;
        if (notWidth || notHeight) {
          return false;
        }
        break;
      }
      case BaseFont.TEXT_WRAP.OVER_FLOW: {
        const notWidth = other.overflow.width !== this.overflow.width;
        const notHeight = other.overflow.height !== this.overflow.height;
        if (notWidth || notHeight) {
          return false;
        }
        break;
      }
      case BaseFont.TEXT_WRAP.WORD_WRAP: {
        if (other.lineHeight !== this.lineHeight) {
          return false;
        }
        break;
      }
    }
    return true;
  }

  truncateRuler() {
    if (this.used) { return; }
    const { rect } = this;
    const { text, textWidth } = this.displayFont(rect);
    this.truncateText = text;
    this.truncateTextWidth = textWidth;
    this.used = BaseRuler.USED.TRUNCATE;
  }

  overflowRuler() {
    if (this.used) { return; }
    const { overflow } = this;
    const { text, textWidth } = this.displayFont(overflow);
    this.overflowText = text;
    this.overflowTextWidth = textWidth;
    this.used = BaseRuler.USED.OVER_FLOW;
  }

  textWrapRuler() {
    if (this.used) { return; }
    const { size, rect, lineHeight } = this;
    const { width } = rect;
    const alignPadding = this.getAlignPadding();
    const breakArray = this.textBreak();
    const textArray = [];
    const maxWidth = width - (alignPadding * 2);
    const breakLen = breakArray.length;
    let bi = 0;
    let hOffset = 0;
    while (bi < breakLen) {
      if (bi > 0) {
        hOffset += size + lineHeight;
      }
      const text = breakArray[bi];
      const textLen = text.length;
      let ii = 0;
      const line = {
        str: '',
        len: 0,
        start: 0,
      };
      while (ii < textLen) {
        const str = line.str + text.charAt(ii);
        const len = this.textWidth(str);
        if (len > maxWidth) {
          if (line.len === 0) {
            textArray.push({
              text: str,
              len,
              tx: 0,
              ty: hOffset,
            });
            ii += 1;
          } else {
            textArray.push({
              text: line.str,
              len: line.len,
              tx: 0,
              ty: hOffset,
            });
          }
          hOffset += size + lineHeight;
          line.str = '';
          line.len = 0;
          line.start = ii;
        } else {
          line.str = str;
          line.len = len;
          ii += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: line.str,
          len: line.len,
          tx: 0,
          ty: hOffset,
        });
      }
      bi += 1;
    }
    if (hOffset > 0) {
      hOffset -= lineHeight;
    }
    this.textWrapTextArray = textArray;
    this.textWrapHOffset = hOffset;
    this.used = BaseRuler.USED.TEXT_WRAP;
  }

}

export {
  HorizonRuler,
};
