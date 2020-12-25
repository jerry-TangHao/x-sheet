import { BaseFont } from '../BaseFont';
import { RTCosKit, RTSinKit } from '../../RTFunction';
import { Crop } from '../../Crop';
import { Angle } from '../../Angle';
import { Rect } from '../../Rect';
import { DrawResult } from '../DrawResult';

class AngleBoxDraw extends BaseFont {

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

  drawingLine(type, tx, ty, textWidth) {
    const { draw, attr } = this;
    const { size } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      s[0] = tx;
      e[0] = tx + textWidth;
      s[1] = ty + size / 2;
      e[1] = ty + size / 2;
    }
    if (type === 'underline') {
      s[0] = tx;
      e[0] = tx + textWidth;
      s[1] = ty + size;
      e[1] = ty + size;
    }
    draw.line(s, e);
  }

  truncateDraw() {
    return this.overflowDraw();
  }

  overflowDraw() {
    const { draw, ruler, attr } = this;
    const { rect, overflow } = this;
    const { x, y, width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
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
    } = ruler;
    // 文本块大小
    const trigonometricWidth = Math.max(RTCosKit.nearby({
      tilt: textWidth,
      angle,
    }), size);
    const trigonometricHeight = RTSinKit.inverse({
      tilt: textWidth,
      angle,
    });
    const limitHeight = trigonometricHeight - height;
    // 计算文本绘制位置旋转中心
    let rtx = x;
    let rty = y;
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2 - trigonometricWidth / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - trigonometricWidth - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rty += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rty += height / 2 - trigonometricHeight / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rty += height - trigonometricHeight - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = trigonometricHeight + verticalAlignPadding > overflow.height;
    const outboundsWidth = trigonometricWidth + alignPadding > overflow.width;
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
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      crop.open();
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
      draw.fillText(text, tx, ty);
      if (underline) {
        this.drawingLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawingLine('strike', tx, ty, textWidth);
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
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
      draw.fillText(text, tx, ty);
      if (underline) {
        this.drawingLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawingLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
    }
    // 文本宽度
    let textHaveWidth = trigonometricWidth;
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
    const { draw, ruler, attr } = this;
    const { rect, lineHeight } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
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
    if (angle > 0) {
      // 折行文本计算
      ruler.textWrapRuler();
      const {
        textWrapTextArray: textArray,
        textWrapMaxLen: maxLen,
      } = ruler;
      const textArrayLen = textArray.length;
      // 多行文本
      if (textArrayLen > 1) {
        // 文本间隙
        const spacing = RTSinKit.tilt({
          inverse: size + lineHeight,
          angle,
        });
        // 文本宽高
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: maxLen,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: maxLen,
          angle,
        });
        // 总宽度
        const totalWidth = textWidth + ((textArrayLen - 1) * spacing);
        // 文本坐标
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case BaseFont.ALIGN.left:
            bx += alignPadding;
            break;
          case BaseFont.ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case BaseFont.ALIGN.right:
            bx += width - totalWidth - alignPadding;
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
        // 渲染文本
        let jj = 0;
        while (jj < textArrayLen) {
          // 计算文本的绘制位置旋转中心
          const item = textArray[jj];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case BaseFont.ALIGN.left: {
              const tilt = item.len / 2;
              const tw = Math.max(RTCosKit.nearby({
                tilt,
                angle,
              }), size);
              const th = RTSinKit.inverse({
                tilt,
                angle,
              });
              ax += rx + tw;
              ay += ry + textHeight - th;
              break;
            }
            case BaseFont.ALIGN.center: {
              ax = rx + textWidth / 2;
              ay = ry + textHeight / 2;
              break;
            }
            case BaseFont.ALIGN.right: {
              const tilt = item.len / 2;
              const tw = Math.max(RTCosKit.nearby({
                tilt,
                angle,
              }), size);
              const th = RTSinKit.inverse({
                tilt,
                angle,
              });
              ax += rx + textWidth - tw;
              ay += ry + th;
              break;
            }
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;
          // 旋转并且绘制文本
          const dwAngle = new Angle({
            draw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
            }),
          });
          dwAngle.rotate();
          draw.fillText(item.text, tx, ty);
          if (underline) {
            this.drawingLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawingLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
          jj += 1;
        }
        return new DrawResult({
          width: totalWidth + alignPadding,
        });
      }
      // 文本大小
      const {
        textWrapText: text,
        textWrapTextWidth: textWidth,
      } = ruler;
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });
      // 文本坐标
      let rtx = rect.x;
      let rty = rect.y;
      switch (align) {
        case BaseFont.ALIGN.left:
          rtx += alignPadding;
          break;
        case BaseFont.ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - trigonometricWidth - alignPadding;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          rty += verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - verticalAlignPadding;
          break;
      }
      // 渲染文本
      const dwAngle = new Angle({
        draw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
      draw.fillText(text, tx, ty);
      if (underline) {
        this.drawingLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawingLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
      return new DrawResult({
        width: trigonometricWidth + alignPadding,
      });
    }
    // 折行文本计算
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapMaxLen: maxLen,
    } = ruler;
    const textArrayLen = textArray.length;
    // 多行文本
    if (textArrayLen > 1) {
      // 计算文本块之间的间隙
      const spacing = RTSinKit.tilt({
        inverse: size + lineHeight,
        angle,
      });
      // 计算每个文本块宽度和高度
      const textWidth = Math.max(RTCosKit.nearby({
        tilt: maxLen,
        angle,
      }), size);
      const textHeight = RTSinKit.inverse({
        tilt: maxLen,
        angle,
      });
      // 文本总宽度
      const totalWidth = textWidth + ((textArrayLen - 1) * spacing);
      // 文本坐标
      let bx = rect.x;
      let by = rect.y;
      switch (align) {
        case BaseFont.ALIGN.left:
          bx += alignPadding;
          break;
        case BaseFont.ALIGN.center:
          bx += width / 2 - totalWidth / 2;
          break;
        case BaseFont.ALIGN.right:
          bx += width - totalWidth - alignPadding;
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
      // 渲染文本
      let jj = 0;
      while (jj < textArrayLen) {
        // 计算文本的绘制位置旋转中心
        const item = textArray[jj];
        const rx = item.tx + bx;
        const ry = item.ty + by;
        let ax = 0;
        let ay = 0;
        switch (align) {
          case BaseFont.ALIGN.left: {
            const tilt = item.len / 2;
            const tw = Math.max(RTCosKit.nearby({
              tilt,
              angle,
            }), size);
            const th = RTSinKit.inverse({
              tilt,
              angle,
            });
            ax += rx + tw;
            ay += ry + th;
            break;
          }
          case BaseFont.ALIGN.center: {
            ax = rx + textWidth / 2;
            ay = ry + textHeight / 2;
            break;
          }
          case BaseFont.ALIGN.right: {
            const tilt = item.len / 2;
            const tw = Math.max(RTCosKit.nearby({
              tilt,
              angle,
            }), size);
            const th = RTSinKit.inverse({
              tilt,
              angle,
            });
            ax += rx + textWidth - tw;
            ay += ry + textHeight - th;
            break;
          }
        }
        const tx = ax - item.len / 2;
        const ty = ay - size / 2;
        // 旋转并且绘制文本
        const dwAngle = new Angle({
          draw,
          angle,
          rect: new Rect({
            x: tx,
            y: ty,
            width: item.len,
            height: size,
          }),
        });
        dwAngle.rotate();
        draw.fillText(item.text, tx, ty);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.len);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.len);
        }
        dwAngle.revert();
        jj += 1;
      }
      return new DrawResult({
        width: totalWidth + alignPadding,
      });
    }
    // 计算文本块大小
    const {
      textWrapText: text,
      textWrapTextWidth: textWidth,
    } = ruler;
    const trigonometricWidth = Math.max(RTCosKit.nearby({
      tilt: textWidth,
      angle,
    }), size);
    const trigonometricHeight = RTSinKit.inverse({
      tilt: textWidth,
      angle,
    });
    // 计算文本绘制位置旋转中心
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2 - trigonometricWidth / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - trigonometricWidth - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rty += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rty += height / 2 - trigonometricHeight / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rty += height - trigonometricHeight - verticalAlignPadding;
        break;
    }
    // 渲染文本
    const dwAngle = new Angle({
      draw,
      angle,
      rect: new Rect({
        x: rtx,
        y: rty,
        width: trigonometricWidth,
        height: trigonometricHeight,
      }),
    });
    dwAngle.rotate();
    const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
    const ty = rty + (trigonometricHeight / 2 - size / 2);
    draw.fillText(text, tx, ty);
    if (underline) {
      this.drawingLine('underline', tx, ty, textWidth);
    }
    if (strikethrough) {
      this.drawingLine('strike', tx, ty, textWidth);
    }
    dwAngle.revert();
    return new DrawResult({
      width: trigonometricWidth + alignPadding,
    });
  }

}

export {
  AngleBoxDraw,
};
