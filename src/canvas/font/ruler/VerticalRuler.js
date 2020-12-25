import { VerticalVisual } from './VerticalVisual';
import { BaseRuler } from '../BaseRuler';
import { BaseFont } from '../BaseFont';

class VerticalRuler extends VerticalVisual {

  constructor({
    draw,
    text,
    size,
    rect,
    verticalAlign,
    textWrap,
    spacing = 2,
    lineHeight = 8,
    padding,
  }) {
    super({
      draw,
      text,
      verticalAlign,
      padding,
    });

    this.size = size;
    this.rect = rect;
    this.textWrap = textWrap;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.used = BaseRuler.USED.DEFAULT_INI;

    this.truncateTextArray = [];
    this.truncateMaxLen = 0;

    this.textWrapTextArray = [];
    this.textWrapMaxLen = 0;
    this.textWrapWOffset = 0;
  }

  equals(other) {
    if (other === null) {
      return false;
    }
    if (other.constructor !== VerticalRuler) {
      return false;
    }
    if (other.text !== this.text) {
      return false;
    }
    if (other.size !== this.size) {
      return false;
    }
    if (other.spacing !== this.spacing) {
      return false;
    }
    if (other.padding !== this.padding) {
      return false;
    }
    if (other.verticalAlign !== this.verticalAlign) {
      return false;
    }
    if (other.textWrap !== this.textWrap) {
      return false;
    }
    switch (this.textWrap) {
      case BaseFont.TEXT_WRAP.TRUNCATE:
      case BaseFont.TEXT_WRAP.OVER_FLOW: {
        const notWidth = other.rect.width !== this.rect.width;
        const notHeight = other.rect.height !== this.rect.height;
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
    if (this.used) {
      return;
    }
    const { text, size, spacing } = this;
    const textArray = [];
    const textLen = text.length;
    let maxLen = 0;
    let hOffset = 0;
    let ii = 0;
    while (ii < textLen) {
      const char = text.charAt(ii);
      const width = this.textWidth(char);
      textArray.push({
        len: width,
        text: char,
        tx: size / 2 - width / 2,
        ty: hOffset,
      });
      hOffset += size + spacing;
      ii += 1;
    }
    if (hOffset > 0) {
      hOffset -= spacing;
    }
    if (hOffset > maxLen) {
      maxLen = hOffset;
    }
    this.truncateTextArray = textArray;
    this.truncateMaxLen = maxLen;
    this.used = BaseRuler.USED.TRUNCATE;
  }

  overflowRuler() {
    this.truncateRuler();
  }

  textWrapRuler() {
    const { rect, size, spacing, lineHeight } = this;
    const { height } = rect;
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const breakArray = this.textBreak();
    const textArray = [];
    const maxHeight = height - (verticalAlignPadding * 2);
    const breakLen = breakArray.length;
    let maxLen = 0;
    let wOffset = 0;
    let bi = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const textLen = text.length;
      let hOffset = 0;
      let ii = 0;
      while (ii < textLen) {
        const char = text.charAt(ii);
        const width = this.textWidth(char);
        const item = {
          len: width,
          text: char,
          tx: wOffset + (size / 2 - width / 2),
          ty: hOffset,
        };
        textArray.push(item);
        if (hOffset + size > maxHeight) {
          if (hOffset > maxLen) {
            maxLen = hOffset - spacing;
          }
          wOffset += size + lineHeight;
          hOffset = 0;
          item.tx = wOffset + (size / 2 - width / 2);
          item.ty = hOffset;
        }
        hOffset += size + spacing;
        ii += 1;
      }
      if (hOffset > maxLen) {
        maxLen = hOffset - spacing;
      }
      wOffset += size;
      bi += 1;
    }
    this.textWrapTextArray = textArray;
    this.textWrapMaxLen = maxLen;
    this.textWrapWOffset = wOffset;
  }

}

export {
  VerticalRuler,
};
