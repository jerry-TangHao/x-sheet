import { BaseFont } from '../BaseFont';
import { Crop } from '../../Crop';
import { DrawResult } from '../DrawResult';

class VerticalDraw extends BaseFont {

  constructor({
    draw, ruler, rect, attr,
  }) {
    super({ draw, ruler, attr });
    this.rect = rect;
  }

  drawingFont() {
    const { ruler } = this;
    if (ruler.isBlank()) {
      return new DrawResult();
    }
    const { draw, attr } = this;
    const { textWrap } = attr;
    draw.attr({
      textAlign: BaseFont.ALIGN.left,
      textBaseline: BaseFont.VERTICAL_ALIGN.top,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`,
      fillStyle: attr.color,
      strokeStyle: attr.color,
    });
    if (ruler.hasBreak()) {
      return this.textWrapDraw();
    }
    switch (textWrap) {
      case BaseFont.TEXT_WRAP.OVER_FLOW:
        return this.overflowDraw();
      case BaseFont.TEXT_WRAP.TRUNCATE:
        return this.truncateDraw();
      case BaseFont.TEXT_WRAP.WORD_WRAP:
        return this.textWrapDraw();
    }
    return new DrawResult();
  }

  drawingLine(type, tx, ty, textWidth, align, verticalAlign) {
    const { draw, attr } = this;
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
    draw.line(s, e);
  }

  truncateDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    const { size } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 文本位置计算
    ruler.truncateRuler();
    const {
      truncateTextArray: textArray,
      truncateMaxLen: maxLen,
    } = ruler;
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
        draw,
        rect,
      });
      crop.open();
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        const tx = item.tx + bx;
        const ty = item.ty + by;
        draw.fillText(item.text, tx, ty);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
      crop.close();
    } else {
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        const tx = item.tx + bx;
        const ty = item.ty + by;
        draw.fillText(item.text, tx, ty);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return new DrawResult();
  }

  overflowDraw() {
    return this.truncateDraw();
  }

  textWrapDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { size, verticalAlign, underline } = attr;
    const { strikethrough, align } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapMaxLen: maxLen,
      textWrapWOffset: wOffset,
    } = ruler;
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
        draw,
        rect,
      });
      crop.open();
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        const tx = item.tx + bx;
        const ty = item.ty + by;
        draw.fillText(item.text, tx, ty);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
      crop.close();
    } else {
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        const tx = item.tx + bx;
        const ty = item.ty + by;
        draw.fillText(item.text, tx, ty);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return new DrawResult();
  }

}

export {
  VerticalDraw,
};
