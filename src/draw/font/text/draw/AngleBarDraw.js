import { BaseFont } from '../../BaseFont';
import { RTCosKit, RTSinKit } from '../../../RTFunction';
import { Rect } from '../../../Rect';
import { Crop } from '../../../Crop';
import { Angle } from '../../../Angle';
import { DrawResult } from '../../DrawResult';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { BaseText } from '../BaseText';
import { BaseRuler } from '../../BaseRuler';

class AngleBarDraw extends BaseText {

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
      ruler.setUsedType(BaseRuler.USED.EMPTY_TEXT);
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
    const { rect } = this;
    const { x, y, width, height } = rect;
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
    // 斜边的大小
    const tilt = RTSinKit.tilt({
      inverse: height,
      angle,
    });
    const tiltWidth = RTCosKit.nearby({
      tilt,
      angle,
    });
    // 文本长度
    ruler.overflowRuler();
    const {
      overflowText: text,
      overflowTextWidth: textWidth,
      overflowTextHeight: textHeight,
      overflowTextAscent: textAscent,
      overflowBlockWidth: blockWidth,
      overflowBlockHeight: blockHeight,
      overflowTextCenterX: textCenterX,
    } = ruler;
    // 文本的仰角范围
    if (angle > 0) {
      // 可溢出区域
      const overflow = new Rect({
        x, y, width: tiltWidth + width, height,
      });
      // 计算文本绘制位置
      let rtx = x;
      let rty = y;
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top: {
          rty += verticalAlignPadding;
          rtx += tiltWidth - blockWidth - verticalAlignPadding;
          break;
        }
        case BaseFont.VERTICAL_ALIGN.center: {
          rty += height / 2 - blockHeight / 2;
          rtx += tiltWidth / 2 - blockWidth / 2;
          break;
        }
        case BaseFont.VERTICAL_ALIGN.bottom: {
          rty += (height - blockHeight) - verticalAlignPadding;
          rtx += verticalAlignPadding;
          break;
        }
      }
      switch (align) {
        case BaseFont.ALIGN.left: {
          const hat = RTSinKit.tilt({
            inverse: textHeight / 2,
            angle,
          });
          rtx = rtx + alignPadding + hat;
          break;
        }
        case BaseFont.ALIGN.center: {
          const offset = rtx + width / 2;
          const center = offset + blockWidth / 2;
          rtx = center - textCenterX;
          break;
        }
        case BaseFont.ALIGN.right: {
          const hat = RTSinKit.tilt({
            inverse: textHeight / 2,
            angle,
          });
          const offset = rtx + width;
          const right = offset + blockWidth;
          rtx = right - blockWidth - alignPadding - hat;
          break;
        }
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
      return new DrawResult({
        width: tiltWidth + width,
        rightSdist: 0,
        leftSdist: tiltWidth,
      });
    }
    // 可溢出区域
    const overflow = new Rect({
      x: x - tiltWidth, y, width: tiltWidth + width, height,
    });
      // 相对偏移量
    let rtx = x;
    let rty = y;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rty += verticalAlignPadding;
        rtx -= tiltWidth - verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rty += height / 2 - blockHeight / 2;
        rtx -= tiltWidth / 2 + blockWidth / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rty += (height - blockHeight) - verticalAlignPadding;
        rtx -= blockWidth + verticalAlignPadding;
        break;
    }
    switch (align) {
      case BaseFont.ALIGN.left: {
        const hat = RTSinKit.tilt({
          inverse: textHeight / 2,
          angle,
        });
        rtx = rtx + alignPadding + hat;
        break;
      }
      case BaseFont.ALIGN.center: {
        const offset = rtx + width / 2;
        const center = offset + blockWidth / 2;
        rtx = center - textCenterX;
        break;
      }
      case BaseFont.ALIGN.right: {
        const hat = RTSinKit.tilt({
          inverse: textHeight / 2,
          angle,
        });
        const offset = rtx + width;
        const right = offset + blockWidth;
        rtx = right - blockWidth - alignPadding - hat;
        break;
      }
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
    return new DrawResult({
      width: tiltWidth + width,
      leftSdist: 0,
      rightSdist: tiltWidth,
    });
  }

  textWrapDraw() {
    const { rect, overflow, draw, ruler, attr } = this;
    const { x, y, width, height } = rect;
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
    // 文本测量
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapTextWidth: textWidth,
      textWrapTextCenterX: textCenterX,
      textWrapTextHeight: textHeight,
    } = ruler;
    // 斜边的大小
    const tilt = RTSinKit.tilt({
      inverse: height,
      angle,
    });
    const tiltWidth = RTCosKit.nearby({
      tilt,
      angle,
    });
    // 文本的仰角范围
    if (angle > 0) {
      // 相对偏移量
      const head = SheetUtils.arrayHead(textArray);
      const last = SheetUtils.arrayLast(textArray);
      let rtx = x;
      let rty = y;
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top: {
          rty += verticalAlignPadding;
          // 减去y填充的影响
          rtx += tiltWidth - head.blockWidth - verticalAlignPadding;
          break;
        }
        case BaseFont.VERTICAL_ALIGN.center: {
          rty += height / 2 - textHeight / 2;
          rtx += tiltWidth / 2 - head.blockWidth / 2;
          break;
        }
        case BaseFont.VERTICAL_ALIGN.bottom: {
          rty += (height - textHeight) - verticalAlignPadding;
          rtx += verticalAlignPadding;
          break;
        }
      }
      switch (align) {
        case BaseFont.ALIGN.left: {
          const hat = RTSinKit.tilt({
            inverse: head.height / 2,
            angle,
          });
          rtx = rtx + alignPadding + hat;
          break;
        }
        case BaseFont.ALIGN.center: {
          const offset = rtx + width / 2;
          const center = offset + head.blockWidth / 2;
          rtx = center - textCenterX;
          break;
        }
        case BaseFont.ALIGN.right: {
          const hat = RTSinKit.tilt({
            inverse: last.height / 2,
            angle,
          });
          const offset = rtx + width;
          const right = offset + head.blockWidth;
          rtx = right - textWidth - alignPadding - hat;
          break;
        }
      }
      // 边界检查
      let outbounds = false;
      switch (align) {
        case BaseFont.ALIGN.left: {
          outbounds = overflow.x + overflow.width < rtx + textWidth;
          break;
        }
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.right: {
          outbounds = rtx < overflow.x;
          break;
        }
      }
      if (outbounds) {
        const crop = new Crop({
          rect: overflow,
          draw,
        });
        crop.open();
        // 绘制文本
        for (let index = 0, length = textArray.length; index < length; index++) {
          const item = textArray[index];
          const ax = rtx + item.tx;
          const ay = rty + item.ty;
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
        crop.close();
      } else {
        // 绘制文本
        for (let index = 0, length = textArray.length; index < length; index++) {
          const item = textArray[index];
          const ax = rtx + item.tx;
          const ay = rty + item.ty;
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
      }
      // 实际宽度
      const maxWidth = tiltWidth + width;
      const textX = rtx + textWidth;
      const rectX = x + maxWidth;
      const diffX = textX - rectX;
      return new DrawResult({
        width: diffX > 0 ? maxWidth + diffX + alignPadding : maxWidth,
        rightSdist: 0,
        leftSdist: tiltWidth,
      });
    }
    // 相对偏移量
    const head = SheetUtils.arrayHead(textArray);
    const last = SheetUtils.arrayLast(textArray);
    let rtx = x;
    let rty = y;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top: {
        rty += verticalAlignPadding;
        rtx -= tiltWidth - verticalAlignPadding;
        break;
      }
      case BaseFont.VERTICAL_ALIGN.center: {
        rty += height / 2 - textHeight / 2;
        rtx -= tiltWidth / 2 + head.blockWidth / 2;
        break;
      }
      case BaseFont.VERTICAL_ALIGN.bottom: {
        rty += (height - textHeight) - verticalAlignPadding;
        rtx -= head.blockWidth + verticalAlignPadding;
        break;
      }
    }
    switch (align) {
      case BaseFont.ALIGN.left: {
        const hat = RTSinKit.tilt({
          inverse: head.height / 2,
          angle,
        });
        rtx = rtx + alignPadding + hat;
        break;
      }
      case BaseFont.ALIGN.center: {
        const offset = rtx + width / 2;
        const center = offset + head.blockWidth / 2;
        rtx = center - textCenterX;
        break;
      }
      case BaseFont.ALIGN.right: {
        const hat = RTSinKit.tilt({
          inverse: last.height / 2,
          angle,
        });
        const offset = rtx + width;
        const right = offset + head.blockWidth;
        rtx = right - textWidth - alignPadding - hat;
        break;
      }
    }
    // 边界检查
    let outbounds = false;
    switch (align) {
      case BaseFont.ALIGN.center:
      case BaseFont.ALIGN.left: {
        outbounds = overflow.x + overflow.width < rtx + textWidth;
        break;
      }
      case BaseFont.ALIGN.right: {
        outbounds = rtx < overflow.x;
        break;
      }
    }
    if (outbounds) {
      const crop = new Crop({
        rect: overflow,
        draw,
      });
      crop.open();
      // 绘制文本
      for (let index = 0, length = textArray.length; index < length; index++) {
        const item = textArray[index];
        const ax = rtx + item.tx;
        const ay = rty + item.ty;
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
      crop.close();
    } else {
      // 绘制文本
      for (let index = 0, length = textArray.length; index < length; index++) {
        const item = textArray[index];
        const ax = rtx + item.tx;
        const ay = rty + item.ty;
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
    }
    // 实际宽度
    const maxWidth = tiltWidth + width;
    const textX = rtx;
    const rectX = x - maxWidth;
    const diffX = textX - rectX;
    return new DrawResult({
      width: diffX > 0 ? Math.abs(maxWidth) : maxWidth + Math.abs(diffX) + alignPadding,
      leftSdist: 0,
      rightSdist: tiltWidth,
    });
  }

}

export {
  AngleBarDraw,
};
