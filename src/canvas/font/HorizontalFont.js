import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';
import { Crop } from '../Crop';
import { DisplayFont } from './DisplayFont';
import { FontDrawResult } from './FontDrawResult';

class HorizontalFont extends DisplayFont {

  constructor({
    text, overflow, rect, dw, attr,
  }) {
    super({
      text, rect, dw, attr,
    });
    this.overflow = overflow;
    this.attr = PlainUtils.mergeDeep({
      lineHeight: 4,
    }, this.attr);
  }

  drawLine(type, tx, ty, textWidth) {
    const { dw, attr } = this;
    const { size, verticalAlign, align } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      switch (align) {
        case BaseFont.ALIGN.right:
          s[0] = tx - textWidth;
          e[0] = tx;
          break;
        case BaseFont.ALIGN.center:
          s[0] = tx - textWidth / 2;
          e[0] = tx + textWidth / 2;
          break;
        case BaseFont.ALIGN.left:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          s[1] = ty;
          e[1] = ty;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty - size / 2;
          e[1] = ty - size / 2;
          break;
        default:
          break;
      }
    }
    if (type === 'underline') {
      switch (align) {
        case BaseFont.ALIGN.right:
          s[0] = tx - textWidth;
          e[0] = tx;
          break;
        case BaseFont.ALIGN.center:
          s[0] = tx - textWidth / 2;
          e[0] = tx + textWidth / 2;
          break;
        case BaseFont.ALIGN.left:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          s[1] = ty + size;
          e[1] = ty + size;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty;
          e[1] = ty;
          break;
        default:
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
    const font = `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`.trim();
    dw.attr({
      textAlign: attr.align,
      textBaseline: attr.verticalAlign,
      font,
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
    const { dw, attr, rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 文字宽度
    const { text, textWidth } = this.displayFont();
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.center:
        bx += width / 2;
        break;
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.right:
        bx += width - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = size + verticalAlignPadding > height;
    const outboundsWidth = textWidth + alignPadding > width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      dw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
      crop.close();
    } else {
      dw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
    }
    return new FontDrawResult();
  }

  overflowFont() {
    const { dw, attr, rect, overflow, text } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 文字宽度
    const textWidth = this.textWidth(text);
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = size + verticalAlignPadding > overflow.height;
    const outboundsWidth = textWidth + alignPadding > overflow.width;
    let pointOffset = false;
    if (align === BaseFont.ALIGN.center) {
      const diff = textWidth / 2 - width / 2;
      if (diff > 0) {
        if (overflow.x > rect.x - diff) {
          pointOffset = true;
        } else if (overflow.x + overflow.width < rect.x + rect.width + diff) {
          pointOffset = true;
        }
      }
    }
    if (outboundsHeight || outboundsWidth || pointOffset) {
      const crop = new Crop({
        draw: dw,
        rect: overflow,
      });
      crop.open();
      dw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
      crop.close();
    } else {
      dw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
    }
    return new FontDrawResult(textWidth + alignPadding);
  }

  wrapTextFont() {
    const { text, dw, attr, rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size, lineHeight } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    const breakArray = this.textBreak(text);
    const textArray = [];
    const maxWidth = width - (alignPadding * 2);
    const breakLen = breakArray.length;
    let bi = 0;
    let hOffset = 0;
    while (bi < breakLen) {
      if (bi > 0) {
        hOffset += size + lineHeight;
      }
      const text = breakArray[bi];
      const textLen = text.length;
      let ii = 0;
      const line = {
        str: '',
        len: 0,
        start: 0,
      };
      while (ii < textLen) {
        const str = line.str + text.charAt(ii);
        const len = this.textWidth(str);
        if (len > maxWidth) {
          if (line.len === 0) {
            textArray.push({
              text: str,
              len,
              tx: 0,
              ty: hOffset,
            });
            ii += 1;
          } else {
            textArray.push({
              text: line.str,
              len: line.len,
              tx: 0,
              ty: hOffset,
            });
          }
          hOffset += size + lineHeight;
          line.str = '';
          line.len = 0;
          line.start = ii;
        } else {
          line.str = str;
          line.len = len;
          ii += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: line.str,
          len: line.len,
          tx: 0,
          ty: hOffset,
        });
      }
      bi += 1;
    }
    if (hOffset > 0) {
      hOffset -= lineHeight;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - alignPadding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - hOffset - verticalAlignPadding;
        break;
    }
    // 边界检查
    const totalHeight = (textArray.length * (size + lineHeight)) - lineHeight;
    const outboundsHeight = totalHeight + verticalAlignPadding > height;
    if (outboundsHeight) {
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
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
        ti += 1;
      }
      crop.close();
    } else {
      for (let i = 0, len = textArray.length; i < len; i += 1) {
        const item = textArray[i];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
      }
    }
    return new FontDrawResult();
  }

}

export {
  HorizontalFont,
};
