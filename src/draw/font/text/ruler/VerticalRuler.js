import { VerticalVisual } from './VerticalVisual';
import { BaseRuler } from '../../BaseRuler';
import { BaseFont } from '../../BaseFont';
import { SheetUtils } from '../../../../utils/SheetUtils';

class VerticalRuler extends VerticalVisual {

  constructor({
    draw, text, rect,
    size, verticalAlign, textWrap, padding,
    spacing = 6, lineHeight = 8,
  }) {
    super({
      draw, text, verticalAlign, padding,
    });

    this.textWrap = textWrap;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.size = size;
    this.rect = rect;

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
    const { text, spacing } = this;
    const textArray = [];
    const textLength = text.length;
    let textIndex = 0;
    let textHeight = 0;
    while (textIndex < textLength) {
      const measureText = text.charAt(textIndex);
      const measure = this.textSize(measureText);
      textArray.push({
        tx: 0,
        ty: textHeight,
        text: measureText,
        width: measure.width,
        height: measure.height,
        ascent: measure.ascent,
      });
      textHeight += measure.height + spacing;
      textIndex += 1;
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
    const { rect, size, spacing, lineHeight } = this;
    const { height } = rect;
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const breakArray = this.textBreak();
    const maxHeight = height - (verticalAlignPadding * 2);
    const breakLength = breakArray.length;
    // 状态标记
    const textArray = [];
    const heightArray = [];
    let textWidth = 0;
    let breakIndex = 0;
    // 处理文本折行
    while (breakIndex < breakLength) {
      // 换行文本
      const text = breakArray[breakIndex];
      const textLength = text.length;
      // 状态标记
      let breakTextLine = [];
      let textHeight = 0;
      // 计算换行
      let innerIndex = 0;
      while (innerIndex < textLength) {
        const measureText = text.charAt(innerIndex);
        const measure = this.textSize(measureText);
        const item = {
          tx: textWidth,
          ty: textHeight,
          text: measureText,
          width: measure.width,
          height: measure.height,
          ascent: measure.ascent,
        };
        const effectHeight = textHeight + measure.height;
        if (effectHeight > maxHeight) {
          // 非第一个字符
          if (innerIndex > 0) {
            // 偏移坐标
            textWidth += size + lineHeight;
            // 保存上一行
            textArray.push(breakTextLine);
            heightArray.push(textHeight - spacing);
          }
          // 重置状态标记
          breakTextLine = [];
          textHeight = 0;
          // 超出高度的文本换行
          item.tx = textWidth;
          item.ty = textHeight;
          breakTextLine.push(item);
        } else {
          breakTextLine.push(item);
        }
        textHeight += measure.height + spacing;
        innerIndex += 1;
      }
      // 将文本换行
      textWidth += size + lineHeight;
      // 保存当前行(如果存在的话)
      if (breakTextLine.length > 0) {
        textArray.push(breakTextLine);
        heightArray.push(textHeight - spacing);
      }
      breakIndex += 1;
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
  VerticalRuler,
};
