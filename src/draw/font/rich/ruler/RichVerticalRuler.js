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

    // 裁剪文本
    this.truncateTextArray = [];
    this.truncateTextHeight = 0;

    // 自动换行文本
    this.textWrapTextArray = [];
    this.textWrapHeightArray = [];
    this.textWrapTextWidth = 0;
  }

  truncateRuler() {
    if (this.used) {
      return;
    }
    const { size, name, bold, italic } = this;
    const { rich, spacing } = this;
    const { draw } = this;
    const textArray = [];
    let textHeight = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      const item = rich[i];
      const attr = SheetUtils.extends({
        size, name, bold, italic,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      const { text } = attr;
      draw.save();
      draw.attr({
        font: fontStyle.trim(),
      });
      let textLength = text.length;
      let textIndex = 0;
      while (textIndex < textLength) {
        const measureText = text.charAt(textIndex);
        const measure = this.textSize(measureText);
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
    if (this.used) {
      return;
    }
    let { size, name, bold, italic } = this;
    let { draw, rich, rect, spacing } = this;
    let { height } = rect;
    let { lineHeight } = this;
    let verticalAlignPadding = this.getVerticalAlignPadding();
    let maxHeight = height - (verticalAlignPadding * 2);
    // 状态标记
    let wrapLine = new RichVerticalWrapLine();
    let textWidth = 0;
    let textArray = [];
    let heightArray = [];
    for (let i = 0, len = rich.length, eff = len - 1; i < len; i++) {
      const item = rich[i];
      const attr = SheetUtils.extends({
        size, name, bold, italic,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      const { text } = attr;
      draw.save();
      draw.attr({
        font: fontStyle.trim(),
      });
      const breakArray = this.textBreak(text);
      const breakLength = breakArray.length;
      let breakIndex = 0;
      while (breakIndex < breakLength) {
        if (breakIndex) {
          const lineItem = wrapLine.getOrNewItem();
          lineItem.tx = wrapLine.offsetX;
          lineItem.ty = wrapLine.offsetY;
          textArray.push({
            items: wrapLine.items,
            width: wrapLine.width,
            height: wrapLine.height,
          });
          wrapLine.addOffsetX(lineHeight);
          wrapLine.addOffsetX(wrapLine.height);
          wrapLine.resetWrapLine();
        }
        const text = breakArray[breakIndex];
        const textLength = text.length;
        let innerIndex = 0;
        while (innerIndex < textLength) {
          const lineItem = wrapLine.getOrNewItem({
            style: attr, text: '',
          });
          const measureText = lineItem.text + text.charAt(innerIndex);
          const measure = this.textSize(measureText);
          const effectHeight = wrapLine.offsetY + measure.height;
          if (effectHeight > maxHeight) {
            if (wrapLine.height === 0) {
              lineItem.ascent = measure.ascent;
              lineItem.text = measureText;
              lineItem.tx = wrapLine.offsetX;
              lineItem.ty = wrapLine.offsetY;
              lineItem.width = measure.width;
              lineItem.height = measure.height;
              wrapLine.width = measure.width;
              wrapLine.height = measure.height;
              textArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
              innerIndex += 1;
            } else {
              lineItem.tx = wrapLine.offsetX;
              lineItem.ty = wrapLine.offsetY;
              textArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
            }
            wrapLine.addOffsetX(lineHeight);
            wrapLine.addOffsetX(wrapLine.width);
            wrapLine.resetWrapLine();
          } else {
            lineItem.text = measureText;
            lineItem.height = measure.height;
            lineItem.width = measure.width;
            lineItem.ascent = measure.ascent;
            wrapLine.height = effectHeight;
            if (measure.width > wrapLine.width) {
              wrapLine.width = measure.width;
            }
            innerIndex += 1;
          }
        }
        breakIndex += 1;
      }
      if (wrapLine.width > 0) {
        const lineItem = wrapLine.getOrNewItem({
          tx: 0,
          ty: 0,
          width: 0,
        });
        lineItem.tx = wrapLine.offsetX;
        lineItem.ty = wrapLine.offsetY;
        wrapLine.addHeight(spacing);
        wrapLine.addOffsetY(spacing);
        wrapLine.addOffsetY(lineItem.width);
      }
      if (i < eff) {
        wrapLine.nextLineItem();
      }
      draw.restore();
    }
    // 文本最大宽度
    if (textWidth > 0) {
      textWidth -= lineHeight;
    }
    this.textWrapTextWidth = textWidth;
    this.textWrapTextArray = textArray;
    this.textWrapHeightArray = heightArray;
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
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

}

export {
  RichVerticalRuler,
};
