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

    // 裁剪文本
    this.truncateText = [];
    this.truncateTextWidth = 0;
    this.truncateTextHeight = 0;

    // 溢出文本
    this.overflowText = [];
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;

    // 自动换行文本
    this.textWrapTextArray = [];
    this.textWrapTextHeight = 0;
  }

  truncateRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { draw, rich, spacing } = this;
    const textArray = [];
    let textWidth = 0;
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
      const { width, height, ascent } = this.textSize(text);
      textArray.push({
        tx: textWidth, ty: 0, style: attr, text, width, height, ascent,
      });
      if (textHeight < height) {
        textHeight = height;
      }
      textWidth += spacing + width;
      draw.restore();
    }
    RichHorizonWrapLine.wrapAlignBottom(textArray);
    if (textWidth > 0) {
      textWidth -= spacing;
    }
    this.truncateText = textArray;
    this.truncateTextWidth = textWidth;
    this.truncateTextHeight = textHeight;
    this.setUsedType(BaseRuler.USED.TRUNCATE);
  }

  overflowRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { draw, rich, spacing } = this;
    const textArray = [];
    let textWidth = 0;
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
      const { width, height, ascent } = this.textSize(text);
      textArray.push({
        tx: textWidth, ty: 0, style: attr, text, width, height, ascent,
      });
      if (textHeight < height) {
        textHeight = height;
      }
      textWidth += spacing + width;
      draw.restore();
    }
    RichHorizonWrapLine.wrapAlignBottom(textArray);
    if (textWidth > 0) {
      textWidth -= spacing;
    }
    this.overflowText = textArray;
    this.overflowTextWidth = textWidth;
    this.overflowTextHeight = textHeight;
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
    const textArray = [];
    const wrapLine = new RichHorizonWrapLine();
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
          wrapLine.addOffsetY(lineHeight);
          wrapLine.addOffsetY(wrapLine.height);
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
          const lineWidth = wrapLine.offsetX + measure.width;
          if (lineWidth > maxRectWidth) {
            if (wrapLine.width === 0) {
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
            wrapLine.addOffsetY(lineHeight);
            wrapLine.addOffsetY(wrapLine.height);
            wrapLine.resetWrapLine();
          } else {
            lineItem.text = measureText;
            lineItem.height = measure.height;
            lineItem.width = measure.width;
            lineItem.ascent = measure.ascent;
            wrapLine.width = lineWidth;
            if (measure.height > wrapLine.height) {
              wrapLine.height = measure.height;
            }
            innerIndex += 1;
          }
        }
        breakIndex += 1;
      }
      if (wrapLine.width > 0) {
        const lineItem = wrapLine.getOrNewItem();
        lineItem.tx = wrapLine.offsetX;
        lineItem.ty = wrapLine.offsetY;
        wrapLine.addWidth(spacing);
        wrapLine.addOffsetX(spacing);
        wrapLine.addOffsetX(lineItem.width);
      }
      if (i < eff) {
        wrapLine.nextLineItem();
      }
      draw.restore();
    }
    if (wrapLine.width > 0) {
      textArray.push({
        items: wrapLine.items,
        width: wrapLine.width,
        height: wrapLine.height,
      });
      wrapLine.addOffsetY(lineHeight);
      wrapLine.addOffsetY(wrapLine.height);
      wrapLine.resetWrapLine();
    }
    if (wrapLine.offsetY > 0) {
      wrapLine.addOffsetY(-lineHeight);
    }
    this.textWrapTextArray = textArray;
    this.textWrapTextHeight = wrapLine.offsetY;
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
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

}

export {
  RichHorizonRuler,
};
