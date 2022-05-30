import { RichVerticalVisual } from './RichVerticalVisual';
import { BaseRuler } from '../../BaseRuler';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { RichVerticalWrapLine } from './RichVerticalWrapLine';
import { BaseFont } from '../../BaseFont';

class RichVerticalRuler extends RichVerticalVisual {

  constructor({
    draw, rich, rect, overflow,
    name, size, bold, italic, verticalAlign, padding, textWrap,
    spacing = 6, lineHeight = 8,
  }) {
    super({
      draw, rich, verticalAlign, padding,
    });

    this.textWrap = textWrap;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.bold = bold;
    this.italic = italic;
    this.name = name;
    this.size = size;
    this.rect = rect;
    this.overflow = overflow;

    this.truncateTextArray = [];
    this.truncateTextHeight = 0;

    this.textWrapTextWidth = 0;
    this.textWrapTextArray = [];
    this.textWrapHeightArray = [];
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.constructor !== RichVerticalRuler) {
      return false;
    }
    if (!SheetUtils.equals(this.rich, other.rich)) {
      return false;
    }
    if (other.align !== this.align) {
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

  truncateRuler() {
    if (this.used) {
      return;
    }
    let { size, name, bold, italic } = this;
    let { rich, draw, spacing } = this;
    let textArray = [];
    let textHeight = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      let item = rich[i];
      let attr = SheetUtils.extends({
        size, name, bold, italic,
      }, item);
      let fontItalic = `${attr.italic ? 'italic' : ''}`;
      let fontBold = `${attr.bold ? 'bold' : ''}`;
      let fontSize = `${attr.size}px`;
      let fontName = `${attr.name}`;
      let fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      let { text } = attr;
      draw.save();
      draw.attr({
        font: fontStyle.trim(),
      });
      let textLength = text.length;
      let textIndex = 0;
      while (textIndex < textLength) {
        let measureText = text.charAt(textIndex);
        let measure = this.textSize(measureText);
        textArray.push({
          tx: 0,
          ty: textHeight,
          style: attr,
          text: measureText,
          width: measure.width,
          height: measure.height,
          ascent: measure.ascent,
        });
        textHeight += measure.height + spacing;
        textIndex += 1;
      }
      draw.restore();
    }
    if (textHeight > 0) {
      textHeight -= spacing;
    }
    this.truncateTextArray = textArray;
    this.truncateTextHeight = textHeight;
    this.setUsedType(BaseRuler.USED.TRUNCATE);
  }

  overflowRuler() {
    this.truncateRuler();
  }

  textWrapRuler() {
    if (this.used) { return; }
    let { size, name, bold, italic } = this;
    let { draw, rich, rect, spacing } = this;
    let { height } = rect;
    let { lineHeight } = this;
    let verticalAlignPadding = this.getVerticalAlignPadding();
    let maxRectHeight = height - (verticalAlignPadding * 2);
    let wrapTextArray = [];
    let wrapHeightArray = [];
    let wrapLine = new RichVerticalWrapLine();
    for (let i = 0, len = rich.length, eff = len - 1; i < len; i++) {
      let item = rich[i];
      let style = SheetUtils.extends({
        size, name, bold, italic,
      }, item);
      let { text } = style;
      let fontItalic = `${style.italic ? 'italic' : ''}`;
      let fontName = `${style.name}`;
      let fontBold = `${style.bold ? 'bold' : ''}`;
      let fontSize = `${style.size}px`;
      let fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      draw.save();
      draw.attr({
        font: fontStyle.trim(),
      });
      let breakArray = this.textBreak(text);
      let breakLength = breakArray.length;
      let breakIndex = 0;
      while (breakIndex < breakLength) {
        if (breakIndex) {
          wrapTextArray.push({
            items: wrapLine.items,
            width: wrapLine.width,
            height: wrapLine.height,
          });
          wrapHeightArray.push(wrapLine.height);
          wrapLine.addOffsetX(lineHeight);
          wrapLine.addOffsetX(wrapLine.width);
          wrapLine.resetWrapLine();
        }
        let text = breakArray[breakIndex];
        let textLength = text.length;
        let textIndex = 0;
        while (textIndex < textLength) {
          let wrapLineItem = wrapLine.getOrNewItem({ style });
          let measureText = text.charAt(textIndex);
          let measureSize = this.textSize(measureText);
          let totalHeight = wrapLine.offsetY + measureSize.height;
          let offsetHeight = totalHeight + spacing;
          if (offsetHeight > maxRectHeight) {
            if (wrapLine.height === 0) {
              wrapLine.width = measureSize.width;
              wrapLine.height = measureSize.height;
              wrapLineItem.width = measureSize.width;
              wrapLineItem.height = measureSize.height;
              wrapLineItem.append({
                text: measureText,
                tx: wrapLine.offsetX,
                ty: wrapLine.offsetY,
                width: measureSize.width,
                height: measureSize.height,
                ascent: measureSize.ascent,
              });
              wrapTextArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
              wrapHeightArray.push(wrapLine.height);
              textIndex += 1;
            } else {
              wrapTextArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
              wrapHeightArray.push(wrapLine.height);
            }
            wrapLine.addOffsetX(lineHeight);
            wrapLine.addOffsetX(wrapLine.width);
            wrapLine.resetWrapLine();
          } else {
            let olderOffsetY = wrapLine.offsetY;
            wrapLine.width = Math.max(measureSize.width, wrapLine.width);
            wrapLine.height = offsetHeight;
            wrapLine.offsetY = offsetHeight;
            wrapLineItem.width = wrapLine.width;
            wrapLineItem.height = wrapLine.height;
            wrapLineItem.append({
              text: measureText,
              tx: wrapLine.offsetX,
              ty: olderOffsetY,
              width: measureSize.width,
              height: measureSize.height,
              ascent: measureSize.ascent,
            });
            textIndex += 1;
          }
        }
        breakIndex += 1;
      }
      if (i < eff) {
        wrapLine.nextLineItem();
      }
      draw.restore();
    }
    if (wrapLine.height > 0) {
      wrapTextArray.push({
        items: wrapLine.items,
        width: wrapLine.width,
        height: wrapLine.height,
      });
      wrapHeightArray.push(wrapLine.height);
      wrapLine.addOffsetX(lineHeight);
      wrapLine.addOffsetX(wrapLine.width);
      wrapLine.resetWrapLine();
    }
    this.textWrapTextArray = wrapTextArray;
    this.textWrapHeightArray = wrapHeightArray;
    this.textWrapTextWidth = wrapLine.offsetX;
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
  }

}

export {
  RichVerticalRuler,
};
