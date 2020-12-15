import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';
import { Crop } from '../Crop';
import { FontDrawResult } from './FontDrawResult';

class VerticalFont extends BaseFont {

  constructor({
    text, rect, dw, attr,
  }) {
    super({
      text, rect, dw, attr,
    });
    this.attr = PlainUtils.mergeDeep({
      lineHeight: 8,
      spacing: 2,
    }, this.attr);
  }

  drawLine(type, tx, ty, textWidth, align, verticalAlign) {
    const { dw, attr } = this;
    const { size } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      switch (align) {
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.left:
        case BaseFont.ALIGN.right:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
        case BaseFont.VERTICAL_ALIGN.top:
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
      }
    }
    if (type === 'underline') {
      switch (align) {
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.left:
        case BaseFont.ALIGN.right:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
        case BaseFont.VERTICAL_ALIGN.top:
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty + size;
          e[1] = ty + size;
          break;
      }
    }
    dw.line(s, e);
  }

  draw() {
    const { text } = this;
    if (this.isBlank(text)) {
      return new FontDrawResult();
    }
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: BaseFont.ALIGN.left,
      textBaseline: BaseFont.VERTICAL_ALIGN.top,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`,
      fillStyle: attr.color,
      strokeStyle: attr.color,
    });
    if (this.hasBreak(text)) {
      return this.wrapTextFont();
    }
    switch (textWrap) {
      case BaseFont.TEXT_WRAP.OVER_FLOW:
        return this.overflowFont();
      case BaseFont.TEXT_WRAP.TRUNCATE:
        return this.truncateFont();
      case BaseFont.TEXT_WRAP.WORD_WRAP:
        return this.wrapTextFont();
    }
    return new FontDrawResult();
  }

  truncateFont() {
    const { text, dw, attr, rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    const { size, spacing } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 文本位置计算
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
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2 - size / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - size - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - maxLen - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = maxLen + verticalAlignPadding > height;
    const outboundsWidth = size + alignPadding > width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
      crop.close();
    } else {
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return new FontDrawResult();
  }

  overflowFont() {
    return this.truncateFont();
  }

  wrapTextFont() {
    const { text, dw, attr, rect } = this;
    const { width, height } = rect;
    const { size, spacing, verticalAlign, underline } = attr;
    const { strikethrough, align, lineHeight } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    const breakArray = this.textBreak(text);
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
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2 - wOffset / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - wOffset - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - maxLen - verticalAlignPadding;
        break;
    }
    // 边界检查
    const totalWidth = textArray.length * size;
    const outboundsWidth = totalWidth + alignPadding > width;
    if (outboundsWidth) {
      const textLen = textArray.length;
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
      crop.close();
    } else {
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return new FontDrawResult();
  }

}

export {
  VerticalFont,
};
