import { BaseFont } from '../../BaseFont';
import { Crop } from '../../../Crop';
import { DrawResult } from '../../DrawResult';
import { BaseText } from '../BaseText';

class VerticalDraw extends BaseText {

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
    const fontItalic = `${attr.italic ? 'italic' : ''}`;
    const fontBold = `${attr.bold ? 'bold' : ''}`;
    const fontName = `${attr.name}`;
    const fontSize = `${attr.size}px`;
    const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
    draw.attr({
      font: fontStyle.trim(),
      textAlign: 'start',
      textBaseline: 'alphabetic',
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

  drawingLine(type, tx, ty, textWidth, textHeight, align, verticalAlign) {
    const { draw } = this;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      switch (align) {
        case BaseFont.ALIGN.left:
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.right:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
        case BaseFont.VERTICAL_ALIGN.center:
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty + textHeight / 2;
          e[1] = ty + textHeight / 2;
          break;
      }
    }
    if (type === 'underline') {
      switch (align) {
        case BaseFont.ALIGN.left:
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.right:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
        case BaseFont.VERTICAL_ALIGN.center:
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty + textHeight;
          e[1] = ty + textHeight;
          break;
      }
    }
    draw.line(s, e);
  }

  truncateDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { size, underline, align } = attr;
    const { strikethrough, verticalAlign } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 文本位置计算
    ruler.truncateRuler();
    const {
      truncateTextArray: textArray,
      truncateTextHeight: textHeight,
    } = ruler;
    // 文本越界检查
    const outboundsHeight = textHeight + verticalAlignPadding > height;
    if (textHeight > outboundsHeight) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      for (let index = 0, length = textArray.length; index < length; index++) {
        const item = textArray[index];
        // 计算文本坐标
        let bx = rect.x + (size / 2 - item.width / 2);
        let by = rect.y;
        // 计算文本对齐
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
            by += height / 2 - textHeight / 2;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - verticalAlignPadding;
            break;
        }
        // 绘制文本
        const tx = item.tx + bx;
        const ty = item.ty + by;
        draw.fillText(item.text, tx, ty + item.ascent);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.width, item.height, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.width, item.height, align, verticalAlign);
        }
      }
      crop.close();
    } else {
      for (let index = 0, length = textArray.length; index < length; index++) {
        const item = textArray[index];
        // 计算文本坐标
        let bx = rect.x + (size / 2 - item.width / 2);
        let by = rect.y;
        // 计算文本对齐
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
            by += height / 2 - textHeight / 2;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - verticalAlignPadding;
            break;
        }
        // 绘制文本
        const tx = item.tx + bx;
        const ty = item.ty + by;
        draw.fillText(item.text, tx, ty + item.ascent);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.width, item.height, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.width, item.height, align, verticalAlign);
        }
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
    const { verticalAlign, underline } = attr;
    const { size, strikethrough, align } = attr;
    // 填充尺寸
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapTextWidth: textWidth,
      textWrapHeightArray: heightArray,
    } = ruler;
    // 边界检查
    const outboundsWidth = textWidth + alignPadding > width;
    if (outboundsWidth) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      for (let index = 0, length = textArray.length; index < length; index++) {
        const textLine = textArray[index];
        const lineHeight = heightArray[index];
        for (let index = 0, length = textLine.length; index < length; index++) {
          const item = textLine[index];
          // 计算文本坐标
          let bx = rect.x + (size / 2 - item.width / 2);
          let by = rect.y;
          // 计算文本对齐
          switch (align) {
            case BaseFont.ALIGN.left:
              bx += alignPadding;
              break;
            case BaseFont.ALIGN.center:
              bx += width / 2 - textWidth / 2;
              break;
            case BaseFont.ALIGN.right:
              bx += width - textWidth - alignPadding;
              break;
          }
          switch (verticalAlign) {
            case BaseFont.VERTICAL_ALIGN.top:
              by += verticalAlignPadding;
              break;
            case BaseFont.VERTICAL_ALIGN.center:
              by += height / 2 - lineHeight / 2;
              break;
            case BaseFont.VERTICAL_ALIGN.bottom:
              by += height - lineHeight - verticalAlignPadding;
              break;
          }
          // 绘制文本
          const tx = item.tx + bx;
          const ty = item.ty + by;
          draw.fillText(item.text, tx, ty + item.ascent);
          if (underline) {
            this.drawingLine('underline', tx, ty, item.width, item.height, align, verticalAlign);
          }
          if (strikethrough) {
            this.drawingLine('strike', tx, ty, item.width, item.height, align, verticalAlign);
          }
        }
      }
      crop.close();
    } else {
      for (let index = 0, length = textArray.length; index < length; index++) {
        const textLine = textArray[index];
        const lineHeight = heightArray[index];
        for (let index = 0, length = textLine.length; index < length; index++) {
          const item = textLine[index];
          // 计算文本坐标
          let bx = rect.x + (size / 2 - item.width / 2);
          let by = rect.y;
          // 计算文本对齐
          switch (align) {
            case BaseFont.ALIGN.left:
              bx += alignPadding;
              break;
            case BaseFont.ALIGN.center:
              bx += width / 2 - textWidth / 2;
              break;
            case BaseFont.ALIGN.right:
              bx += width - textWidth - alignPadding;
              break;
          }
          switch (verticalAlign) {
            case BaseFont.VERTICAL_ALIGN.top:
              by += verticalAlignPadding;
              break;
            case BaseFont.VERTICAL_ALIGN.center:
              by += height / 2 - lineHeight / 2;
              break;
            case BaseFont.VERTICAL_ALIGN.bottom:
              by += height - lineHeight - verticalAlignPadding;
              break;
          }
          // 绘制文本
          const tx = item.tx + bx;
          const ty = item.ty + by;
          draw.fillText(item.text, tx, ty + item.ascent);
          if (underline) {
            this.drawingLine('underline', tx, ty, item.width, item.height, align, verticalAlign);
          }
          if (strikethrough) {
            this.drawingLine('strike', tx, ty, item.width, item.height, align, verticalAlign);
          }
        }
      }
    }
    return new DrawResult();
  }

}

export {
  VerticalDraw,
};
