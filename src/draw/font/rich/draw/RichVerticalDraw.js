import { BaseRich } from '../BaseRich';
import { DrawResult } from '../../DrawResult';
import { BaseFont } from '../../BaseFont';
import { BaseRuler } from '../../BaseRuler';
import { Crop } from '../../../Crop';
import { SheetUtils } from '../../../../utils/SheetUtils';

class RichVerticalDraw extends BaseRich {

  constructor({
    draw, ruler, rect, attr,
  }) {
    super({ draw, ruler, attr });
    this.rect = rect;
  }

  drawingFont() {
    const { ruler } = this;
    if (ruler.isBlank()) {
      ruler.setUsedType(BaseRuler.USED.EMPTY_TEXT);
      return new DrawResult();
    }
    if (ruler.richHasBreak()) {
      return this.textWrapDraw();
    }
    const { attr } = this;
    const { textWrap } = attr;
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
    const { size, align } = attr;
    const { verticalAlign } = attr;
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    ruler.truncateRuler();
    const {
      truncateTextArray: textArray,
      truncateTextHeight: textHeight,
    } = ruler;
    const outboundsHeight = textHeight + verticalAlignPadding > height;
    if (textHeight > outboundsHeight) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      for (let index = 0, length = textArray.length; index < length; index++) {
        const item = textArray[index];
        const style = SheetUtils.extends({}, attr, item.style);
        const { strikethrough } = style;
        const { underline } = style;
        const fontSize = `${style.size}px`;
        const fontName = `${style.name}`;
        const fontItalic = `${style.italic ? 'italic' : ''}`;
        const fontBold = `${style.bold ? 'bold' : ''}`;
        const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
        draw.attr({
          font: fontStyle.trim(),
          fillStyle: style.color,
          strokeStyle: style.color,
        });
        let bx = rect.x + (size / 2 - item.width / 2);
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
            by += height / 2 - textHeight / 2;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - verticalAlignPadding;
            break;
        }
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
      draw.save();
      for (let index = 0, length = textArray.length; index < length; index++) {
        const item = textArray[index];
        const style = SheetUtils.extends({}, attr, item.style);
        const { strikethrough } = style;
        const { underline } = style;
        const fontSize = `${style.size}px`;
        const fontName = `${style.name}`;
        const fontItalic = `${style.italic ? 'italic' : ''}`;
        const fontBold = `${style.bold ? 'bold' : ''}`;
        const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
        draw.attr({
          font: fontStyle.trim(),
          fillStyle: style.color,
          strokeStyle: style.color,
        });
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
      draw.restore();
    }
    return new DrawResult();
  }

  overflowDraw() {
    return this.truncateDraw();
  }

  textWrapDraw() {
    let { draw, ruler, attr } = this;
    let { rect } = this;
    let { width, height } = rect;
    let { size, align } = attr;
    let { verticalAlign } = attr;
    let verticalAlignPadding = this.getVerticalAlignPadding();
    let alignPadding = this.getAlignPadding();
    ruler.textWrapRuler();
    let {
      textWrapTextArray: textArray,
      textWrapTextWidth: textWidth,
      textWrapHeightArray: heightArray,
    } = ruler;
    let outboundsWidth = textWidth + alignPadding > width;
    if (outboundsWidth) {
      let crop = new Crop({
        draw, rect,
      });
      crop.open();
      for (let index = 0, length = textArray.length; index < length; index++) {
        let currentText = textArray[index];
        let currentHeight = heightArray[index];
        let { items } = currentText;
        for (let index = 0, length = items.length; index < length; index++) {
          let current = items[index];
          let style = SheetUtils.extends({}, attr, current.style);
          let fontSize = `${style.size}px`;
          let fontName = `${style.name}`;
          let fontItalic = `${style.italic ? 'italic' : ''}`;
          let fontBold = `${style.bold ? 'bold' : ''}`;
          let fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
          draw.attr({
            font: fontStyle.trim(),
            fillStyle: style.color,
            strokeStyle: style.color,
          });
          let { text } = current;
          let { strikethrough, underline } = style;
          for (let index = 0, length = text.length; index < length; index++) {
            let item = text[index];
            let bx = rect.x + (size / 2 - item.width / 2);
            let by = rect.y;
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
                by += height / 2 - currentHeight / 2;
                break;
              case BaseFont.VERTICAL_ALIGN.bottom:
                by += height - currentHeight - verticalAlignPadding;
                break;
            }
            let tx = item.tx + bx;
            let ty = item.ty + by;
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
      crop.close();
    } else {
      draw.save();
      for (let index = 0, length = textArray.length; index < length; index++) {
        let currentText = textArray[index];
        let currentHeight = heightArray[index];
        let { items } = currentText;
        for (let index = 0, length = items.length; index < length; index++) {
          let current = items[index];
          let style = SheetUtils.extends({}, attr, current.style);
          let fontSize = `${style.size}px`;
          let fontName = `${style.name}`;
          let fontItalic = `${style.italic ? 'italic' : ''}`;
          let fontBold = `${style.bold ? 'bold' : ''}`;
          let fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
          draw.attr({
            font: fontStyle.trim(),
            fillStyle: style.color,
            strokeStyle: style.color,
          });
          let { text } = current;
          let { strikethrough, underline } = style;
          for (let index = 0, length = text.length; index < length; index++) {
            let item = text[index];
            let bx = rect.x + (size / 2 - item.width / 2);
            let by = rect.y;
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
                by += height / 2 - currentHeight / 2;
                break;
              case BaseFont.VERTICAL_ALIGN.bottom:
                by += height - currentHeight - verticalAlignPadding;
                break;
            }
            let tx = item.tx + bx;
            let ty = item.ty + by;
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
      draw.restore();
    }
    return new DrawResult();
  }

}

export {
  RichVerticalDraw,
};
