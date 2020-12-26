import { PlainRuler } from '../PlainRuler';
import { BaseFont } from '../BaseFont';

class HorizonVisual extends PlainRuler {

  constructor({
    draw, text, align, padding,
  }) {
    super({ draw, text });
    this.align = align;
    this.padding = padding;
  }

  displayFont(rect) {
    const { align } = this;
    const { width } = rect;
    const origin = this.text;
    const length = origin.length;
    switch (align) {
      case BaseFont.ALIGN.left: {
        let text = '';
        let textWidth = 0;
        let start = 0;
        while (start < length) {
          const str = text + origin.charAt(start);
          const len = this.textWidth(str);
          if (len >= width) {
            break;
          }
          text = str;
          textWidth = len;
          start += 1;
        }
        return {
          text, textWidth,
        };
      }
      case BaseFont.ALIGN.center: {
        const textWidth = this.textWidth(origin);
        const lOffset = width / 2 - textWidth / 2;
        if (lOffset < 0) {
          let start = 0;
          let temp = '';
          while (start < length) {
            const str = temp + origin.charAt(start);
            if (lOffset + this.textWidth(str) >= 0) {
              break;
            }
            temp = str;
            start += 1;
          }
          let over = start;
          let text = '';
          let textWidth = 0;
          while (over < length) {
            const str = text + origin.charAt(over);
            const len = this.textWidth(str);
            if (len >= width) {
              break;
            }
            text = str;
            textWidth = len;
            over += 1;
          }
          return {
            text, textWidth,
          };
        }
        return {
          text: origin, textWidth,
        };
      }
      case BaseFont.ALIGN.right: {
        let start = length - 1;
        let text = '';
        let textWidth = 0;
        while (start >= 0) {
          const str = origin.charAt(start) + text;
          const len = this.textWidth(str);
          if (len >= width) {
            break;
          }
          text = str;
          textWidth = len;
          start -= 1;
        }
        return {
          text, textWidth,
        };
      }
    }
    return {
      text: '',
      textWidth: 0,
    };
  }

  getAlignPadding() {
    if (this.align === BaseFont.ALIGN.center) {
      return 0;
    }
    return this.padding;
  }

}

export {
  HorizonVisual,
};
