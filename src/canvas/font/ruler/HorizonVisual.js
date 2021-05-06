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
    const { text } = this;
    const { width } = rect;
    const { length } = text;
    switch (align) {
      case BaseFont.ALIGN.left: {
        let displayHeight = 0;
        let displayWidth = 0;
        let displayAscent = 0;
        let displayStart = 0;
        let displayText = '';
        while (displayStart < length) {
          const measureText = displayText + text.charAt(displayStart);
          const measure = this.textSize(measureText);
          if (measure.width >= width) {
            break;
          }
          displayText = measureText;
          displayAscent = measure.ascent;
          displayWidth = measure.width;
          displayHeight = measure.height;
          displayStart += 1;
        }
        return {
          text: displayText,
          ascent: displayAscent,
          width: displayWidth,
          height: displayHeight,
        };
      }
      case BaseFont.ALIGN.center: {
        const measure = this.textSize(text);
        const lOffset = width / 2 - measure.width / 2;
        if (lOffset < 0) {
          // 测量左边的起始位置
          let displayStart = 0;
          let displayTemp = '';
          while (displayStart < length) {
            const measureText = displayTemp + text.charAt(displayStart);
            const measureWidth = this.textWidth(measureText);
            if ((lOffset + measureWidth) >= 0) {
              break;
            }
            displayTemp = measureText;
            displayStart += 1;
          }
          // 测量右边的结束位置
          let displayHeight = 0;
          let displayWidth = 0;
          let displayAscent = 0;
          let displayText = '';
          let displayOver = displayStart;
          while (displayOver < length) {
            const measureText = displayText + text.charAt(displayOver);
            const measure = this.textSize(measureText);
            if (measure.width >= width) {
              break;
            }
            displayText = measureText;
            displayHeight = measure.height;
            displayWidth = measure.width;
            displayAscent = measure.ascent;
            displayOver += 1;
          }
          return {
            text: displayText,
            ascent: displayAscent,
            width: displayWidth,
            height: displayHeight,
          };
        }
        let displayText = text;
        let displayHeight = measure.height;
        let displayWidth = measure.width;
        let displayAscent = measure.ascent;
        return {
          text: displayText,
          ascent: displayAscent,
          width: displayWidth,
          height: displayHeight,
        };

      }
      case BaseFont.ALIGN.right: {
        let displayStart = length - 1;
        let displayWidth = 0;
        let displayText = '';
        let displayAscent = 0;
        let displayHeight = 0;
        while (displayStart >= 0) {
          const measureText = text.charAt(displayStart) + displayText;
          const measure = this.textSize(measureText);
          if (measure.width >= width) {
            break;
          }
          displayText = measureText;
          displayHeight = measure.height;
          displayWidth = measure.width;
          displayAscent = measure.ascent;
          displayStart -= 1;
        }
        return {
          text: displayText,
          ascent: displayAscent,
          width: displayWidth,
          height: displayHeight,
        };
      }
    }
    return {
      text: '',
      ascent: 0,
      width: 0,
      height: 0,
    };
  }

  getAlignPadding() {
    const { align, padding } = this;
    switch (align) {
      case BaseFont.ALIGN.center:
        return 0;
    }
    return padding;
  }

}

export {
  HorizonVisual,
};
