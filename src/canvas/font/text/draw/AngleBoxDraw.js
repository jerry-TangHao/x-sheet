import { BaseFont } from '../../BaseFont';
import { RTCosKit, RTSinKit } from '../../../RTFunction';
import { Crop } from '../../../Crop';
import { Angle } from '../../../Angle';
import { Rect } from '../../../Rect';
import { DrawResult } from '../../DrawResult';
import { BaseText } from '../BaseText';

class AngleBoxDraw extends BaseText {

  constructor({
    draw, ruler, rect, overflow, lineHeight = 4, attr,
  }) {
    super({
      draw, ruler, attr,
    });
    this.rect = rect;
    this.overflow = overflow;
    this.lineHeight = lineHeight;
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

  drawingLine(type, tx, ty, textWidth, textHeight) {
    const { draw, attr } = this;
    const { verticalAlign, align } = attr;
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
    return this.overflowDraw();
  }

  overflowDraw() {
    const { draw, ruler, attr } = this;
    const { rect, overflow } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 角度边界
    let { angle } = attr;
    if (angle < -90) {
      angle = -90;
    }
    if (angle > 90) {
      angle = 90;
    }
    if (angle === 0) {
      throw new TypeError('文字的角度必须是在90<0或者0>90之间!');
    }
    // 文本长度
    ruler.overflowRuler();
    const {
      overflowText: text,
      overflowTextWidth: textWidth,
      overflowTextHeight: textHeight,
      overflowTextAscent: textAscent,
      overflowBlockWidth: blockWidth,
      overflowBlockHeight: blockHeight,
    } = ruler;
    const limitHeight = blockHeight - height;
    // 相对偏移量
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2 - blockWidth / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - blockWidth - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rty += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rty += height / 2 - blockHeight / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rty += height - blockHeight - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = blockHeight + verticalAlignPadding > overflow.height;
    const outboundsWidth = blockWidth + alignPadding > overflow.width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw,
        rect: overflow,
      });
      const dwAngle = new Angle({
        draw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: blockWidth,
          height: blockHeight,
        }),
      });
      crop.open();
      dwAngle.rotate();
      const tx = rtx + (blockWidth / 2 - textWidth / 2);
      const ty = rty + (blockHeight / 2 - textHeight / 2);
      draw.fillText(text, tx, ty + textAscent);
      if (underline) {
        this.drawingLine('underline', tx, ty, textWidth, textHeight);
      }
      if (strikethrough) {
        this.drawingLine('strike', tx, ty, textWidth, textHeight);
      }
      dwAngle.revert();
      crop.close();
    } else {
      const dwAngle = new Angle({
        draw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: blockWidth,
          height: blockHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (blockWidth / 2 - textWidth / 2);
      const ty = rty + (blockHeight / 2 - textHeight / 2);
      draw.fillText(text, tx, ty + textAscent);
      if (underline) {
        this.drawingLine('underline', tx, ty, textWidth, textHeight);
      }
      if (strikethrough) {
        this.drawingLine('strike', tx, ty, textWidth, textHeight);
      }
      dwAngle.revert();
    }
    // 文本宽度
    let textHaveWidth = blockWidth;
    if (limitHeight > 0) {
      const tilt = RTSinKit.tilt({
        inverse: height,
        angle,
      });
      textHaveWidth = RTCosKit.nearby({
        tilt, angle,
      });
    }
    return new DrawResult({
      width: textHaveWidth + alignPadding,
    });
  }

  textWrapDraw() {
    const { draw, rect, ruler, attr } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 角度边界
    let { angle } = attr;
    if (angle < -90) {
      angle = -90;
    }
    if (angle > 90) {
      angle = 90;
    }
    if (angle === 0) {
      throw new TypeError('文字的角度必须是在90<0或者0>90之间!');
    }
    // 绘制文本
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapTextWidth: textWidth,
      textWrapTextHeight: textHeight,
    } = ruler;
    // 相对偏移量
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2 - textWidth / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - textWidth - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rty += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rty += height / 2 - textHeight / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rty += height - textHeight - verticalAlignPadding;
        break;
    }
    // 绘制文本
    for (let index = 0, length = textArray.length; index < length; index++) {
      const item = textArray[index];
      const ax = item.tx + rtx;
      const ay = item.ty + rty;
      const dwAngle = new Angle({
        draw,
        angle,
        rect: new Rect({
          x: ax,
          y: ay,
          width: item.blockWidth,
          height: item.blockHeight,
        }),
      });
      dwAngle.rotate();
      const tx = ax + (item.blockWidth / 2 - item.width / 2);
      const ty = ay + (item.blockHeight / 2 - item.height / 2);
      draw.fillText(item.text, tx, ty + item.ascent);
      if (underline) {
        this.drawingLine('underline', tx, ty, item.width, item.height);
      }
      if (strikethrough) {
        this.drawingLine('strike', tx, ty, item.width, item.height);
      }
      dwAngle.revert();
    }
    // 文本宽度
    return new DrawResult({
      width: textWidth + alignPadding,
    });
  }

}

export {
  AngleBoxDraw,
};
