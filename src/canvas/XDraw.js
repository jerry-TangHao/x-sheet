/* global window */

let DPR = window.devicePixelRatio || 1;
let LINE_WIDTH_LOW = Math.round(DPR);
let LINE_WIDTH_MEDIUM = LINE_WIDTH_LOW + 2;
let LINE_WIDTH_HIGH = LINE_WIDTH_MEDIUM + 2;
let LINE_PIXEL_OFFSET = LINE_WIDTH_LOW / 2;

class Base {

  static srcPx(px) {
    return px / this.dpr();
  }

  static cssPx(px) {
    return this.srcPx(this.stylePx(px));
  }

  static stylePx(px) {
    return this.round(px * this.dpr());
  }

  static round(val) {
    return Math.round(val);
  }

  static trunc(val) {
    return Math.trunc(val);
  }

  static radian(angle) {
    return -angle * (Math.PI / 180);
  }

  static dpr() {
    return DPR;
  }

  static refresh() {
    DPR = window.devicePixelRatio || 1;
    LINE_WIDTH_LOW = Math.round(DPR);
    LINE_WIDTH_MEDIUM = LINE_WIDTH_LOW + 2;
    LINE_WIDTH_HIGH = LINE_WIDTH_MEDIUM + 2;
    LINE_PIXEL_OFFSET = LINE_WIDTH_LOW / 2;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  attr(options) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(key)) {
        let value = options[key];
        if (typeof value === 'string' || value instanceof String) {
          value = value.trim();
        }
        if (this.ctx[key] !== value) {
          this.ctx[key] = value;
        }
      }
    }
    return this;
  }

  resize(width, height) {
    const { canvas } = this;
    canvas.width = Base.stylePx(width);
    canvas.height = Base.stylePx(height);
    canvas.style.width = `${canvas.width / Base.dpr()}px`;
    canvas.style.height = `${canvas.height / Base.dpr()}px`;
    return this;
  }

}

class Wrapping extends Base {

  constructor(canvas) {
    super(canvas);
    this.dash = [];
  }

  beginPath() {
    const { ctx } = this;
    ctx.beginPath();
    return this;
  }

  measureText(text) {
    const { ctx } = this;
    return ctx.measureText(text);
  }

  save() {
    const { ctx } = this;
    ctx.save();
    return this;
  }

  restore() {
    const { ctx } = this;
    ctx.restore();
    return this;
  }

  fill() {
    const { ctx } = this;
    ctx.fill();
    return this;
  }

  clip() {
    const { ctx } = this;
    ctx.clip();
    return this;
  }

  setLineDash(dash = []) {
    const { ctx } = this;
    this.dash = dash;
    ctx.setLineDash(dash);
    return this;
  }

  scale(x, y) {
    const { ctx } = this;
    ctx.scale(x, y);
    return this;
  }

  translate(x, y) {
    const { ctx } = this;
    ctx.translate(x, y);
    return this;
  }

  rotate(deg) {
    const { ctx } = this;
    ctx.rotate(deg);
    return this;
  }

}

class Extends extends Wrapping {

  polyStroke(interpolation = xys => xys, ...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      const [x, y] = interpolation(xys[0]);
      ctx.moveTo(x, y);
      for (let i = 1, len = xys.length; i < len; i += 1) {
        const [x, y] = interpolation(xys[i]);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  polyInFill(interpolation = xys => xys, ...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      const [x, y] = interpolation(xys[0]);
      ctx.moveTo(x, y);
      for (let i = 1, len = xys.length; i < len; i += 1) {
        const [x, y] = interpolation(xys[i]);
        ctx.lineTo(x, y);
      }
      ctx.fill();
    }
  }

  fullRect() {
    const { canvas } = this;
    const { width, height } = canvas;
    this.ctx.fillRect(0, 0, width, height);
    return this;
  }

  rotate(angle) {
    super.rotate(Base.radian(angle));
    return this;
  }

}

class Position extends Extends {

  constructor(canvas) {
    super(canvas);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  offset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getOffsetY() {
    return this.offsetY;
  }

  fillText() {
    throw TypeError('child impl');
  }

  fillRect() {
    throw TypeError('child impl');
  }

  rect() {
    throw TypeError('child impl');
  }

  drawImage() {
    throw TypeError('child impl');
  }

}

class BaseLine extends Position {

  line(...xys) {
    this.polyStroke((xys) => {
      const [x, y] = xys;
      return [this.transformLinePx(Base.round(x + this.getOffsetX())),
        this.transformLinePx(Base.round(y + this.getOffsetY()))];
    }, ...xys);
    return this;
  }

  transformLinePx(pixel) {
    const { ctx } = this;
    const {
      lineWidth,
    } = ctx;
    return lineWidth % 2 === 0
      ? pixel : pixel - 0.5;
  }

}

class CorsLine extends BaseLine {

  static offsetToLineInside(val) {
    return LINE_WIDTH_LOW > 1
      ? val - LINE_PIXEL_OFFSET
      : val - LINE_WIDTH_LOW;
  }

  static getLineWidthTypePx(type) {
    switch (type) {
      case CorsLine.LINE_WIDTH_TYPE.medium:
        return LINE_WIDTH_MEDIUM;
      case CorsLine.LINE_WIDTH_TYPE.low:
        return LINE_WIDTH_LOW;
      case CorsLine.LINE_WIDTH_TYPE.high:
        return LINE_WIDTH_HIGH;
    }
    return 0;
  }

  constructor(canvas) {
    super(canvas);
    this.lineWidthType = CorsLine.LINE_WIDTH_TYPE.low;
    this.lineColor = 'rgb(0,0,0)';
  }

  corsLine([sx, sy], [ex, ey]) {
    const {
      lineWidthType, lineColor,
    } = this;
    let lineWidth = LINE_WIDTH_LOW;
    switch (lineWidthType) {
      case CorsLine.LINE_WIDTH_TYPE.medium:
        lineWidth = LINE_WIDTH_MEDIUM;
        break;
      case CorsLine.LINE_WIDTH_TYPE.low:
        lineWidth = LINE_WIDTH_LOW;
        break;
      case CorsLine.LINE_WIDTH_TYPE.high:
        lineWidth = LINE_WIDTH_HIGH;
        break;
    }
    this.attr({
      strokeStyle: lineColor,
      lineWidth,
    });
    this.polyStroke((xys) => {
      const [x, y] = xys;
      return [
        Base.round(x + this.getOffsetX()) - LINE_PIXEL_OFFSET,
        Base.round(y + this.getOffsetY()) - LINE_PIXEL_OFFSET,
      ];
    }, [sx, sy], [ex, ey]);
  }

  setLineColor(color) {
    this.lineColor = color;
  }

  setLineWidthType(type) {
    this.lineWidthType = type;
  }

  horizonLine([sx, sy], [ex, ey]) {
    if (sy !== ey) {
      throw new TypeError('Error Horizon Line');
    }
    this.corsLine([sx, sy], [ex, ey]);
  }

  verticalLine([sx, sy], [ex, ey]) {
    if (sx !== ex) {
      throw new TypeError('Error Vertical Line');
    }
    this.corsLine([sx, sy], [ex, ey]);
  }

}
CorsLine.LINE_WIDTH_TYPE = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

class XDraw extends CorsLine {

  fillText(text, x, y) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillText(text, XDraw.round(x), XDraw.round(y));
    return this;
  }

  fillPath(path) {
    this.polyInFill((xys) => {
      const { x, y } = xys;
      return [Base.round(x + this.getOffsetX()), Base.round(y + this.getOffsetY())];
    }, ...path.points);
    return this;
  }

  fillRect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillRect(XDraw.round(x), XDraw.round(y),
      XDraw.round(w), XDraw.round(h));
    return this;
  }

  rect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.rect(XDraw.round(x), XDraw.round(y),
      XDraw.round(w), XDraw.round(h));
    return this;
  }

  copyImage(sx, sy, sw, sh, tx, ty, tw, th) {
    const { ctx } = this;
    tx += this.getOffsetX();
    sx += this.getOffsetX();
    ty += this.getOffsetY();
    sy += this.getOffsetY();
    ctx.drawImage(this.canvas,
      XDraw.round(sx), XDraw.round(sy),
      XDraw.round(sw), XDraw.round(sh),
      XDraw.round(tx), XDraw.round(ty),
      XDraw.round(tw), XDraw.round(th));
    return this;
  }

  drawImage(el, sx, sy, sw, sh, tx, ty, tw, th) {
    const { ctx } = this;
    tx += this.getOffsetX();
    ty += this.getOffsetY();
    ctx.drawImage(el,
      XDraw.round(sx), XDraw.round(sy),
      XDraw.round(sw), XDraw.round(sh),
      XDraw.round(tx), XDraw.round(ty),
      XDraw.round(tw), XDraw.round(th));
    return this;
  }

}

export {
  XDraw,
};
