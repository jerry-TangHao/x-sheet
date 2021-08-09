import { BaseRuler } from '../../BaseRuler';
import { RTCosKit, RTSinKit } from '../../../RTFunction';
import { TextRuler } from '../TextRuler';
import { BaseFont } from '../../BaseFont';
import { SheetUtils } from '../../../../utils/SheetUtils';

class AngleBoxRuler extends TextRuler {

  constructor({
    draw, text, rect, overflow,
    size, angle, align, verticalAlign, textWrap, padding,
    lineHeight = 8,
  }) {
    super({
      draw, text,
    });

    this.size = size;
    this.angle = angle;
    this.rect = rect;
    this.overflow = overflow;
    this.align = align;
    this.textWrap = textWrap;
    this.padding = padding;
    this.lineHeight = lineHeight;
    this.verticalAlign = verticalAlign;

    this.overflowText = '';
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;
    this.overflowTextAscent = 0;
    this.overflowBlockWidth = 0;
    this.overflowBlockHeight = 0;

    this.textWrapTextArray = [];
    this.textWrapTextWidth = 0;
    this.textWrapTextHeight = 0;
  }

  truncateRuler() {
    this.overflowRuler();
  }

  overflowRuler() {
    if (this.used) { return; }
    const { angle, text } = this;
    const { width, height, ascent } = this.textSize(text);
    const blockWidth = Math.max(RTCosKit.nearby({
      tilt: width,
      angle,
    }), height);
    const blockHeight = RTSinKit.inverse({
      tilt: width,
      angle,
    });
    this.overflowText = text;
    this.overflowTextWidth = width;
    this.overflowTextHeight = height;
    this.overflowTextAscent = ascent;
    this.overflowBlockWidth = blockWidth;
    this.overflowBlockHeight = blockHeight;
    this.setUsedType(BaseRuler.USED.OVER_FLOW);
  }

  textWrapRuler() {
    if (this.used) { return; }
    const { angle, rect, align, lineHeight, padding } = this;
    const { height } = rect;
    const textHypotenuseWidth = RTSinKit.tilt({
      inverse: height - (padding * 2),
      angle,
    });
    if (angle > 0) {
      const breakArray = this.textBreak();
      const textArray = [];
      const breakLength = breakArray.length;
      // 折行文本计算
      let breakIndex = 0;
      while (breakIndex < breakLength) {
        const text = breakArray[breakIndex];
        const textLength = text.length;
        const line = {
          text: '',
          width: 0,
          height: 0,
          ascent: 0,
        };
        let innerIndex = 0;
        while (innerIndex < textLength) {
          const measureText = line.text + text.charAt(innerIndex);
          const measure = this.textSize(measureText);
          if (measure.width > textHypotenuseWidth) {
            if (line.width === 0) {
              const blockWidth = Math.max(RTCosKit.nearby({
                tilt: measure.width,
                angle,
              }), measure.height);
              const blockHeight = RTSinKit.inverse({
                tilt: measure.width,
                angle,
              });
              textArray.push({
                tx: 0,
                ty: 0,
                blockWidth,
                blockHeight,
                text: measureText,
                ascent: measure.ascent,
                width: measure.width,
                height: measure.height,
              });
              innerIndex += 1;
            } else {
              const blockWidth = Math.max(RTCosKit.nearby({
                tilt: line.width,
                angle,
              }), line.height);
              const blockHeight = RTSinKit.inverse({
                tilt: line.width,
                angle,
              });
              textArray.push({
                tx: 0,
                ty: 0,
                blockWidth,
                blockHeight,
                text: line.text,
                ascent: line.ascent,
                width: line.width,
                height: line.height,
              });
            }
            line.text = '';
            line.width = 0;
            line.height = 0;
            line.ascent = 0;
          } else {
            line.text = measureText;
            line.width = measure.width;
            line.height = measure.height;
            line.ascent = measure.ascent;
            innerIndex += 1;
          }
        }
        if (line.width > 0) {
          const blockWidth = Math.max(RTCosKit.nearby({
            tilt: line.width,
            angle,
          }), line.height);
          const blockHeight = RTSinKit.inverse({
            tilt: line.width,
            angle,
          });
          textArray.push({
            tx: 0,
            ty: 0,
            blockWidth,
            blockHeight,
            text: line.text,
            height: line.height,
            width: line.width,
            ascent: line.ascent,
          });
        }
        breakIndex += 1;
      }
      // x坐标偏移量
      const textArrayLength = textArray.length;
      let maxTextHeight = textArrayLength > 0 ? textArray[0].blockHeight : 0;
      let maxTextWidth = textArrayLength > 0 ? textArray[0].blockWidth : 0;
      let innerIndex = 1;
      while (innerIndex < textArrayLength) {
        const last = textArray[innerIndex - 1];
        const item = textArray[innerIndex];
        // 将文本偏移到上一个文本的指定位置
        item.tx = last.tx;
        item.ty = last.ty;
        switch (align) {
          case BaseFont.ALIGN.left:
            item.ty += (last.blockHeight - item.blockHeight);
            break;
          case BaseFont.ALIGN.center:
            item.tx += (last.blockWidth / 2 - item.blockWidth / 2);
            item.ty += (last.blockHeight / 2 - item.blockHeight / 2);
            break;
          case BaseFont.ALIGN.right:
            item.tx += (last.blockWidth - item.blockWidth);
            break;
        }
        // 偏移上一个文本的行宽
        const spacing = RTSinKit.tilt({
          inverse: last.height + lineHeight,
          angle,
        });
        item.tx += spacing;
        // 统计文本块的总宽度
        const widthOffset = item.tx + item.blockWidth;
        if (widthOffset > maxTextWidth) {
          maxTextWidth = widthOffset;
        }
        // 统计文本块的最大高度
        if (item.blockHeight > maxTextHeight) {
          maxTextHeight = item.blockHeight;
        }
        innerIndex += 1;
      }
      // 折行文本信息
      this.textWrapTextArray = textArray;
      this.textWrapTextWidth = maxTextWidth;
      this.textWrapTextHeight = maxTextHeight;
    } else {
      const breakArray = this.textBreak();
      const textArray = [];
      const breakLen = breakArray.length;
      // 折行文本计算
      let breakIndex = 0;
      while (breakIndex < breakLen) {
        const text = breakArray[breakIndex];
        const textLength = text.length;
        const line = {
          text: '',
          width: 0,
          height: 0,
          ascent: 0,
        };
        let innerIndex = 0;
        while (innerIndex < textLength) {
          const measureText = line.text + text.charAt(innerIndex);
          const measure = this.textSize(measureText);
          if (measure.width > textHypotenuseWidth) {
            if (line.width === 0) {
              const blockWidth = Math.max(RTCosKit.nearby({
                tilt: measure.width,
                angle,
              }), measure.height);
              const blockHeight = RTSinKit.inverse({
                tilt: measure.width,
                angle,
              });
              textArray.push({
                tx: 0,
                ty: 0,
                blockWidth,
                blockHeight,
                text: measureText,
                ascent: measure.ascent,
                width: measure.width,
                height: measure.height,
              });
              innerIndex += 1;
            } else {
              const blockWidth = Math.max(RTCosKit.nearby({
                tilt: line.width,
                angle,
              }), line.height);
              const blockHeight = RTSinKit.inverse({
                tilt: line.width,
                angle,
              });
              textArray.push({
                tx: 0,
                ty: 0,
                blockWidth,
                blockHeight,
                text: line.text,
                ascent: line.ascent,
                width: line.width,
                height: line.height,
              });
            }
            line.text = '';
            line.width = 0;
            line.height = 0;
            line.ascent = 0;
          } else {
            line.text = measureText;
            line.width = measure.width;
            line.height = measure.height;
            line.ascent = measure.ascent;
            innerIndex += 1;
          }
        }
        if (line.width > 0) {
          const blockWidth = Math.max(RTCosKit.nearby({
            tilt: line.width,
            angle,
          }), line.height);
          const blockHeight = RTSinKit.inverse({
            tilt: line.width,
            angle,
          });
          textArray.push({
            tx: 0,
            ty: 0,
            blockWidth,
            blockHeight,
            text: line.text,
            ascent: line.ascent,
            width: line.width,
            height: line.height,
          });
        }
        breakIndex += 1;
      }
      // x坐标偏移量
      const textArrayLength = textArray.length;
      let innerIndex = 1;
      while (innerIndex < textArrayLength) {
        const last = textArray[innerIndex - 1];
        const item = textArray[innerIndex];
        // 将文本偏移到下一个文本的指定位置
        item.tx = last.tx;
        item.ty = last.ty;
        switch (align) {
          case BaseFont.ALIGN.left:
            break;
          case BaseFont.ALIGN.center:
            item.tx += (last.blockWidth / 2 - item.blockWidth / 2);
            item.ty += (last.blockHeight / 2 - item.blockHeight / 2);
            break;
          case BaseFont.ALIGN.right:
            item.tx += (last.blockWidth - item.blockWidth);
            item.ty += (last.blockHeight - item.blockHeight);
            break;
        }
        // 偏移下一个文本的行宽
        const spacing = RTSinKit.tilt({
          inverse: last.height + lineHeight,
          angle,
        });
        item.tx -= spacing;
        innerIndex += 1;
      }
      // 坐标偏移到起始处
      const last = textArray[textArrayLength - 1];
      const offsetX = textArrayLength > 0 && last.tx < 0 ? -last.tx : 0;
      const offsetY = textArrayLength > 0 && last.ty < 0 ? -last.ty : 0;
      let maxTextHeight = textArrayLength > 0 ? last.blockHeight : 0;
      let maxTextWidth = textArrayLength > 0 ? last.blockWidth : 0;
      innerIndex = textArrayLength - 1;
      while (innerIndex >= 0) {
        // 偏移到起始位置
        const item = textArray[innerIndex];
        item.tx += offsetX;
        item.ty += offsetY;
        // 统计文本块的总宽度
        const widthOffset = item.tx + item.blockWidth;
        if (widthOffset > maxTextWidth) {
          maxTextWidth = widthOffset;
        }
        // 统计文本块的最大高度
        if (item.blockHeight > maxTextHeight) {
          maxTextHeight = item.blockHeight;
        }
        innerIndex -= 1;
      }
      // 折行文本信息
      this.textWrapTextArray = textArray;
      this.textWrapTextWidth = maxTextWidth;
      this.textWrapTextHeight = maxTextHeight;
    }
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.constructor !== AngleBoxRuler) {
      return false;
    }
    if (other.text !== this.text) {
      return false;
    }
    if (other.size !== this.size) {
      return false;
    }
    if (other.angle !== this.angle) {
      return false;
    }
    if (other.align !== this.align) {
      return false;
    }
    if (other.verticalAlign !== this.verticalAlign) {
      return false;
    }
    if (other.textWrap !== this.textWrap) {
      return false;
    }
    if (other.padding !== this.padding) {
      return false;
    }
    const diffWidth = other.overflow.width !== this.overflow.width;
    const diffHeight = other.overflow.height !== this.overflow.height;
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
  AngleBoxRuler,
};
