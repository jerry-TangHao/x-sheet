import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';

class DisplayFont extends BaseFont {

  displayFont() {
    const { attr, rect } = this;
    const { align } = attr;
    const { width } = rect;
    const font = this.text;
    const fontLen = font.length;
    switch (align) {
      case BaseFont.ALIGN.left: {
        let text = PlainUtils.EMPTY;
        let textWidth = 0;
        let start = 0;
        while (start < fontLen) {
          const str = text + font.charAt(start);
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
        const textWidth = this.textWidth(font);
        const lOffset = width / 2 - textWidth / 2;
        if (lOffset < 0) {
          let start = 0;
          let temp = PlainUtils.EMPTY;
          while (start < fontLen) {
            const str = temp + font.charAt(start);
            if (lOffset + this.textWidth(str) >= 0) {
              break;
            }
            temp = str;
            start += 1;
          }
          let over = start;
          let text = PlainUtils.EMPTY;
          let textWidth = 0;
          while (over < fontLen) {
            const str = text + font.charAt(over);
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
          text: font, textWidth,
        };
      }
      case BaseFont.ALIGN.right: {
        let start = fontLen - 1;
        let text = PlainUtils.EMPTY;
        let textWidth = 0;
        while (start >= 0) {
          const str = font.charAt(start) + text;
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
      text: PlainUtils.EMPTY,
      textWidth: 0,
    };
  }

}

export {
  DisplayFont,
};
