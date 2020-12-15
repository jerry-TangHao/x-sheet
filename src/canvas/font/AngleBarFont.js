import { RTCosKit, RTSinKit } from '../RTFunction';
import { BaseFont } from './BaseFont';
import { FontDrawResult } from './FontDrawResult';
import { PlainUtils } from '../../utils/PlainUtils';
import { Crop } from '../Crop';
import { Rect } from '../Rect';
import { Angle } from '../Angle';

class AngleBarFont extends BaseFont {

  constructor({
    text, rect, dw, attr, overflow,
  }) {
    super({
      text, rect, dw, attr,
    });
    this.attr = PlainUtils.mergeDeep({
      lineHeight: 4,
    }, this.attr);
    this.overflow = overflow;
  }

  drawLine(type, tx, ty, textWidth) {
    const { dw, attr } = this;
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
    return this.overflowFont();
  }

  overflowFont() {
    const { text, dw, attr, rect } = this;
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
    // 斜边的大小
    const trigonometricTilt = RTSinKit.tilt({
      inverse: height,
      angle,
    });
    const trigonometricTiltWidth = RTCosKit.nearby({
      tilt: trigonometricTilt,
      angle,
    });
    // 文本长度
    const textWidth = this.textWidth(text);
    // 文本块大小
    const trigonometricWidth = Math.max(RTCosKit.nearby({
      tilt: textWidth,
      angle,
    }), size);
    const trigonometricHeight = RTSinKit.inverse({
      tilt: textWidth,
      angle,
    });
    if (angle > 0) {
      // 可溢出区域
      const overflow = new Rect({
        x, y, width: trigonometricTiltWidth + width, height,
      });
      // 计算文本绘制位置
      let rtx = 0;
      let rty = 0;
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          rtx = x + (trigonometricTiltWidth - trigonometricWidth) - verticalAlignPadding;
          rty = y + verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          rtx = x + (trigonometricTiltWidth / 2 - trigonometricWidth / 2) - verticalAlignPadding;
          rty = y + (height / 2 - trigonometricHeight / 2) + verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rtx = x + verticalAlignPadding;
          rty = y + (height - trigonometricHeight) - verticalAlignPadding;
          break;
      }
      switch (align) {
        case BaseFont.ALIGN.left:
          rtx += size / 2 + alignPadding;
          break;
        case BaseFont.ALIGN.center:
          rtx += width / 2;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - size / 2 - alignPadding;
          break;
      }
      // 边界检查
      const outboundsHeight = trigonometricHeight + verticalAlignPadding > overflow.height;
      const outboundsWidth = trigonometricWidth + alignPadding > overflow.width;
      if (outboundsHeight || outboundsWidth) {
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        const dwAngle = new Angle({
          dw,
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
        dw.fillText(text, tx, ty);
        if (underline) {
          this.drawLine('underline', tx, ty, textWidth);
        }
        if (strikethrough) {
          this.drawLine('strike', tx, ty, textWidth);
        }
        dwAngle.revert();
        crop.close();
      } else {
        const dwAngle = new Angle({
          dw,
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
        dw.fillText(text, tx, ty);
        if (underline) {
          this.drawLine('underline', tx, ty, textWidth);
        }
        if (strikethrough) {
          this.drawLine('strike', tx, ty, textWidth);
        }
        dwAngle.revert();
      }
      // 文本宽度
      const haveWidth = trigonometricTiltWidth + width;
      return new FontDrawResult(haveWidth, trigonometricTiltWidth, 0);
    }
    // 可溢出区域
    const overflow = new Rect({
      x: x - trigonometricTiltWidth, y, width: trigonometricTiltWidth + width, height,
    });
    // 计算文本绘制位置
    let rtx = 0;
    let rty = 0;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rtx = x - trigonometricTiltWidth + verticalAlignPadding;
        rty = y + verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rtx = x - (trigonometricTiltWidth / 2 + trigonometricWidth / 2) + verticalAlignPadding;
        rty = y + (height / 2 - trigonometricHeight / 2) + verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rtx = x - trigonometricWidth - verticalAlignPadding;
        rty = y + (height - trigonometricHeight) - verticalAlignPadding;
        break;
    }
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += size / 2 + alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - size / 2 - alignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = trigonometricHeight + verticalAlignPadding > overflow.height;
    const outboundsWidth = trigonometricWidth + alignPadding > overflow.width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw: dw,
        rect: overflow,
      });
      const dwAngle = new Angle({
        dw,
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
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
      crop.close();
    } else {
      const dwAngle = new Angle({
        dw,
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
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
    }
    // 文本宽度
    const haveWidth = trigonometricTiltWidth + width;
    return new FontDrawResult(haveWidth, 0, trigonometricTiltWidth);
  }

  wrapTextFont() {
    const { text, dw, attr, rect, overflow } = this;
    const { x, y, width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size, lineHeight } = attr;
    // 填充宽度
    const { padding } = attr;
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
    const trigonometricTilt = RTSinKit.tilt({
      inverse: height,
      angle,
    });
    const trigonometricTiltWidth = RTCosKit.nearby({
      tilt: trigonometricTilt,
      angle,
    });
    // 绘制文本
    if (angle > 0) {
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - (padding * 2),
        angle,
      });
      // 折行文本计算
      const breakArray = this.textBreak(text);
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textLen = text.length;
        const line = {
          str: '',
          len: 0,
          start: 0,
        };
        let ii = 0;
        while (ii < textLen) {
          const str = line.str + text.charAt(ii);
          const len = this.textWidth(str);
          if (len > textHypotenuseWidth) {
            if (line.len === 0) {
              textArray.push({
                text: str,
                len,
                tx: 0,
                ty: 0,
              });
              if (len > maxLen) {
                maxLen = len;
              }
              ii += 1;
            } else {
              textArray.push({
                text: line.str,
                len: line.len,
                tx: 0,
                ty: 0,
              });
              if (line.len > maxLen) {
                maxLen = line.len;
              }
            }
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
            ty: 0,
          });
        }
        if (line.len > maxLen) {
          maxLen = line.len;
        }
        bi += 1;
      }
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
        // x坐标偏移量
        let wOffset = 0;
        let ii = 0;
        while (ii < textArrayLen) {
          const item = textArray[ii];
          item.tx = wOffset;
          wOffset += spacing;
          ii += 1;
        }
        // 计算文本绘制位置
        let bx = 0;
        let by = 0;
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.top:
            bx = x + (trigonometricTiltWidth - textWidth) - verticalAlignPadding;
            by = y + verticalAlignPadding;
            break;
          case BaseFont.VERTICAL_ALIGN.center:
            bx = x + (trigonometricTiltWidth / 2 - textWidth / 2) - verticalAlignPadding;
            by = y + (height / 2 - textHeight / 2) + verticalAlignPadding;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            bx = x + verticalAlignPadding;
            by = y + (height - textHeight) - verticalAlignPadding;
            break;
        }
        switch (align) {
          case BaseFont.ALIGN.left:
            bx += size / 2 + alignPadding;
            break;
          case BaseFont.ALIGN.center:
            bx += (textWidth / 2 + width / 2) - totalWidth / 2;
            break;
          case BaseFont.ALIGN.right:
            bx += (textWidth / 2 + width) - (totalWidth - textWidth / 2) - size / 2 - alignPadding;
            break;
        }
        // 边界检查
        let pointOffset = false;
        if (align === BaseFont.ALIGN.center) {
          if (overflow.x > bx) {
            pointOffset = true;
          }
        }
        const outboundsHeight = totalWidth + verticalAlignPadding > overflow.height;
        const outboundsWidth = totalWidth + alignPadding > overflow.width;
        if (outboundsHeight || outboundsWidth || pointOffset) {
          const crop = new Crop({
            draw: dw,
            rect: overflow,
          });
          crop.open();
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
              dw,
              angle,
              rect: new Rect({
                x: tx,
                y: ty,
                width: item.len,
                height: size,
              }),
            });
            dwAngle.rotate();
            dw.fillText(item.text, tx, ty);
            if (underline) {
              this.drawLine('underline', tx, ty, item.len);
            }
            if (strikethrough) {
              this.drawLine('strike', tx, ty, item.len);
            }
            dwAngle.revert();
            jj += 1;
          }
          crop.close();
        } else {
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
              dw,
              angle,
              rect: new Rect({
                x: tx,
                y: ty,
                width: item.len,
                height: size,
              }),
            });
            dwAngle.rotate();
            dw.fillText(item.text, tx, ty);
            if (underline) {
              this.drawLine('underline', tx, ty, item.len);
            }
            if (strikethrough) {
              this.drawLine('strike', tx, ty, item.len);
            }
            dwAngle.revert();
            jj += 1;
          }
        }
        // 文本宽度
        let haveWidth = 0;
        switch (align) {
          case BaseFont.ALIGN.left: {
            haveWidth = totalWidth + trigonometricTiltWidth / 2 + alignPadding;
            break;
          }
          case BaseFont.ALIGN.center: {
            haveWidth = totalWidth / 2 + trigonometricTiltWidth / 2 + width / 2;
            break;
          }
          case BaseFont.ALIGN.right: {
            haveWidth = trigonometricTiltWidth + width;
            break;
          }
        }
        haveWidth = Math.max(haveWidth, trigonometricTiltWidth + width);
        return new FontDrawResult(haveWidth, trigonometricTiltWidth, 0);
      }
      // 文本长度
      const textWidth = this.textWidth(text);
      // 文本块大小
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });
      // 计算文本绘制位置
      let rtx = 0;
      let rty = 0;
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          rtx = x + (trigonometricTiltWidth - trigonometricWidth) - verticalAlignPadding;
          rty = y + verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          rtx = x + (trigonometricTiltWidth / 2 - trigonometricWidth / 2) - verticalAlignPadding;
          rty = y + (height / 2 - trigonometricHeight / 2) + verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rtx = x + verticalAlignPadding;
          rty = y + (height - trigonometricHeight) - verticalAlignPadding;
          break;
      }
      switch (align) {
        case BaseFont.ALIGN.left:
          rtx += size / 2 + alignPadding;
          break;
        case BaseFont.ALIGN.center:
          rtx += width / 2;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - size / 2 - alignPadding;
          break;
      }
      // 绘制文本
      const dwAngle = new Angle({
        dw,
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
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
      // 文本宽度
      const haveWidth = trigonometricTiltWidth + width;
      return new FontDrawResult(haveWidth, trigonometricTiltWidth, 0);
    }
    const textHypotenuseWidth = RTSinKit.tilt({
      inverse: height - (padding * 2),
      angle,
    });
    // 折行文本计算
    const breakArray = this.textBreak(text);
    const textArray = [];
    const breakLen = breakArray.length;
    let bi = 0;
    let maxLen = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const textLen = text.length;
      const line = {
        str: '',
        len: 0,
        start: 0,
      };
      let ii = 0;
      while (ii < textLen) {
        const str = line.str + text.charAt(ii);
        const len = this.textWidth(str);
        if (len > textHypotenuseWidth) {
          if (line.len === 0) {
            textArray.push({
              text: str,
              len,
              tx: 0,
              ty: 0,
            });
            if (len > maxLen) {
              maxLen = len;
            }
            ii += 1;
          } else {
            textArray.push({
              text: line.str,
              len: line.len,
              tx: 0,
              ty: 0,
            });
            if (line.len > maxLen) {
              maxLen = line.len;
            }
          }
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
          ty: 0,
        });
      }
      if (line.len > maxLen) {
        maxLen = line.len;
      }
      bi += 1;
    }
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
      // 计算x坐标偏移量
      let wOffset = 0;
      let ii = textArrayLen - 1;
      while (ii >= 0) {
        const item = textArray[ii];
        item.tx = wOffset;
        wOffset += spacing;
        ii -= 1;
      }
      // 文本坐标
      let bx = rect.x;
      let by = rect.y;
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          bx = x - trigonometricTiltWidth + verticalAlignPadding;
          by = y + verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          bx = x - (trigonometricTiltWidth / 2 + textWidth / 2) + verticalAlignPadding;
          by = y + (height / 2 - textHeight / 2) + verticalAlignPadding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          bx = x - textWidth - verticalAlignPadding;
          by = y + (height - textHeight) - verticalAlignPadding;
          break;
      }
      switch (align) {
        case BaseFont.ALIGN.left:
          bx += size / 2 + alignPadding;
          break;
        case BaseFont.ALIGN.center:
          bx += (textWidth / 2 + width / 2) - totalWidth / 2;
          break;
        case BaseFont.ALIGN.right:
          bx += (textWidth / 2 + width) - (totalWidth - textWidth / 2) - size / 2 - alignPadding;
          break;
      }
      // 边界检查
      let pointOffset = false;
      if (align === BaseFont.ALIGN.center) {
        if (overflow.x + overflow.width > bx + totalWidth) {
          pointOffset = true;
        }
      }
      const outboundsHeight = totalWidth + verticalAlignPadding > overflow.height;
      const outboundsWidth = totalWidth + alignPadding > overflow.width;
      if (outboundsHeight || outboundsWidth || pointOffset) {
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        crop.open();
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
            dw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
            }),
          });
          dwAngle.rotate();
          dw.fillText(item.text, tx, ty);
          if (underline) {
            this.drawLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
          jj += 1;
        }
        crop.close();
      } else {
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
            dw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
            }),
          });
          dwAngle.rotate();
          dw.fillText(item.text, tx, ty);
          if (underline) {
            this.drawLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
          jj += 1;
        }
      }
      // 文本宽度
      let haveWidth = 0;
      switch (align) {
        case BaseFont.ALIGN.left: {
          haveWidth = trigonometricTiltWidth + width;
          break;
        }
        case BaseFont.ALIGN.center: {
          haveWidth = totalWidth / 2 + trigonometricTiltWidth / 2 + width / 2;
          break;
        }
        case BaseFont.ALIGN.right: {
          haveWidth = totalWidth + trigonometricTiltWidth / 2 + alignPadding;
          break;
        }
      }
      haveWidth = Math.max(haveWidth, trigonometricTiltWidth + width);
      return new FontDrawResult(haveWidth, 0, trigonometricTiltWidth);
    }
    // 文本长度
    const textWidth = this.textWidth(text);
    // 文本块大小
    const trigonometricWidth = Math.max(RTCosKit.nearby({
      tilt: textWidth,
      angle,
    }), size);
    const trigonometricHeight = RTSinKit.inverse({
      tilt: textWidth,
      angle,
    });
    // 计算文本绘制位置
    let rtx = 0;
    let rty = 0;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rtx = x - trigonometricTiltWidth + verticalAlignPadding;
        rty = y + verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rtx = x - (trigonometricTiltWidth / 2 + trigonometricWidth / 2) + verticalAlignPadding;
        rty = y + (height / 2 - trigonometricHeight / 2) + verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rtx = x - trigonometricWidth - verticalAlignPadding;
        rty = y + (height - trigonometricHeight) - verticalAlignPadding;
        break;
    }
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += size / 2 + alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - size / 2 - alignPadding;
        break;
    }
    // 绘制文本
    const dwAngle = new Angle({
      dw,
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
    dw.fillText(text, tx, ty);
    if (underline) {
      this.drawLine('underline', tx, ty, textWidth);
    }
    if (strikethrough) {
      this.drawLine('strike', tx, ty, textWidth);
    }
    dwAngle.revert();
    // 文本宽度
    const haveWidth = trigonometricTiltWidth + width;
    return new FontDrawResult(haveWidth, 0, trigonometricTiltWidth);
  }

}

export {
  AngleBarFont,
};
