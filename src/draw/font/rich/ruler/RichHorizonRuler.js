import { BaseRuler } from '../../BaseRuler';
import { RichHorizonVisual } from './RichHorizonVisual';
import { BaseFont } from '../../BaseFont';
import { RichHorizonWrapLine } from './RichHorizonWrapLine';
import { SheetUtils } from '../../../../utils/SheetUtils';

class RichHorizonRuler extends RichHorizonVisual {

  constructor({
    draw, rich, rect, overflow,
    name, size, bold, italic, align, padding, textWrap,
    lineHeight = 8, spacing = 0,
  }) {
    super({
      draw, rich, padding, align,
    });
    this.rect = rect;
    this.overflow = overflow;
    this.name = name;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
    this.textWrap = textWrap;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.used = BaseRuler.USED.DEFAULT_INI;

    this.truncateText = [];
    this.truncateTextWidth = 0;
    this.truncateTextHeight = 0;

    this.overflowText = [];
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;

    this.textWrapTextArray = [];
    this.textWrapTextHeight = 0;
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.constructor !== RichHorizonRuler) {
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
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { draw, rich, spacing } = this;
    const truncateTextArray = [];
    let truncateTextWidth = 0;
    let truncateTextHeight = 0;
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
      const { width, height, ascent } = this.textSize(text);
      truncateTextArray.push({
        tx: truncateTextWidth, ty: 0, style: attr, text, width, height, ascent,
      });
      if (truncateTextHeight < height) {
        truncateTextHeight = height;
      }
      truncateTextWidth += spacing + width;
      draw.restore();
    }
    RichHorizonWrapLine.wrapAlignBottom(truncateTextArray);
    if (truncateTextWidth > 0) {
      truncateTextWidth -= spacing;
    }
    this.truncateText = truncateTextArray;
    this.truncateTextWidth = truncateTextWidth;
    this.truncateTextHeight = truncateTextHeight;
    this.setUsedType(BaseRuler.USED.TRUNCATE);
  }

  overflowRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { draw, rich, spacing } = this;
    const flowTextArray = [];
    let flowTextWidth = 0;
    let flowTextHeight = 0;
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
      const { width, height, ascent } = this.textSize(text);
      flowTextArray.push({
        tx: flowTextWidth, ty: 0, style: attr, text, width, height, ascent,
      });
      if (flowTextHeight < height) {
        flowTextHeight = height;
      }
      flowTextWidth += spacing + width;
      draw.restore();
    }
    RichHorizonWrapLine.wrapAlignBottom(flowTextArray);
    if (flowTextWidth > 0) {
      flowTextWidth -= spacing;
    }
    this.overflowText = flowTextArray;
    this.overflowTextHeight = flowTextHeight;
    this.overflowTextWidth = flowTextWidth;
    this.setUsedType(BaseRuler.USED.OVER_FLOW);
  }

  textWrapRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { draw, rich, rect, spacing } = this;
    const { width } = rect;
    const { lineHeight } = this;
    const alignPadding = this.getAlignPadding();
    const maxRectWidth = width - (alignPadding * 2);
    const wrapTextArray = [];
    const wrapLine = new RichHorizonWrapLine();
    for (let i = 0, len = rich.length, eff = len - 1; i < len; i++) {
      const item = rich[i];
      const style = SheetUtils.extends({
        size, name, bold, italic,
      }, item);
      const { text } = style;
      const fontItalic = `${style.italic ? 'italic' : ''}`;
      const fontBold = `${style.bold ? 'bold' : ''}`;
      const fontSize = `${style.size}px`;
      const fontName = `${style.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
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
          wrapTextArray.push({
            items: wrapLine.items,
            width: wrapLine.width,
            height: wrapLine.height,
          });
          wrapLine.addOffsetY(lineHeight);
          wrapLine.addOffsetY(wrapLine.height);
          wrapLine.resetWrapLine();
        }
        const text = breakArray[breakIndex];
        const textLength = text.length;
        let innerIndex = 0;
        while (innerIndex < textLength) {
          const wrapLineItem = wrapLine.getOrNewItem({ style });
          const measureText = wrapLineItem.text + text.charAt(innerIndex);
          const measureSize = this.textSize(measureText);
          const offsetWidth = wrapLine.offsetX + measureSize.width;
          if (offsetWidth > maxRectWidth) {
            if (wrapLine.width === 0) {
              wrapLine.width = measureSize.width;
              wrapLine.height = measureSize.height;
              wrapLineItem.ascent = measureSize.ascent;
              wrapLineItem.text = measureText;
              wrapLineItem.tx = wrapLine.offsetX;
              wrapLineItem.ty = wrapLine.offsetY;
              wrapLineItem.width = measureSize.width;
              wrapLineItem.height = measureSize.height;
              wrapTextArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
              innerIndex += 1;
            } else {
              wrapLineItem.tx = wrapLine.offsetX;
              wrapLineItem.ty = wrapLine.offsetY;
              wrapTextArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
            }
            wrapLine.addOffsetY(lineHeight);
            wrapLine.addOffsetY(wrapLine.height);
            wrapLine.resetWrapLine();
          } else {
            wrapLineItem.text = measureText;
            wrapLineItem.height = measureSize.height;
            wrapLineItem.width = measureSize.width;
            wrapLineItem.ascent = measureSize.ascent;
            wrapLine.width = offsetWidth;
            wrapLine.height = Math.max(measureSize.height, wrapLine.height);
            innerIndex += 1;
          }
        }
        breakIndex += 1;
      }
      if (wrapLine.width > 0) {
        const wrapLineItem = wrapLine.getOrNewItem();
        wrapLineItem.tx = wrapLine.offsetX;
        wrapLineItem.ty = wrapLine.offsetY;
        wrapLine.addWidth(spacing);
        wrapLine.addOffsetX(spacing);
        wrapLine.addOffsetX(wrapLineItem.width);
      }
      if (i < eff) {
        wrapLine.nextLineItem();
      }
      draw.restore();
    }
    if (wrapLine.width > 0) {
      wrapTextArray.push({
        items: wrapLine.items,
        width: wrapLine.width,
        height: wrapLine.height,
      });
      wrapLine.addOffsetY(lineHeight);
      wrapLine.addOffsetY(wrapLine.height);
      wrapLine.resetWrapLine();
    }
    this.textWrapTextArray = wrapTextArray;
    this.textWrapTextHeight = wrapLine.offsetY;
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
  }

}

export {
  RichHorizonRuler,
};
