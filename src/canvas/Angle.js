import { Rect } from './Rect';

const ANGLE_ORIGIN = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  MIDDLE_LEFT: 'middle-left',
  MIDDLE_CENTER: 'middle-center',
  MIDDLE_RIGHT: 'middle-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
};

class Angle {

  constructor({
    angle,
    draw,
    origin = ANGLE_ORIGIN.MIDDLE_CENTER,
    rect = new Rect({ x: 0, y: 0, width: 0, height: 0 }),
  }) {
    this.draw = draw;
    this.origin = origin;
    this.rect = rect;
    this.angle = angle;
  }

  rotate() {
    const { origin, draw, rect, angle } = this;
    const { x, y, width, height } = rect;
    draw.save();
    let tx = 0;
    let ty = 0;
    switch (origin) {
      case ANGLE_ORIGIN.TOP_LEFT:
        tx = x;
        ty = y;
        break;
      case ANGLE_ORIGIN.TOP_CENTER:
        tx = x + width / 2;
        ty = y;
        break;
      case ANGLE_ORIGIN.TOP_RIGHT:
        tx = x + width;
        ty = y;
        break;
      case ANGLE_ORIGIN.MIDDLE_LEFT:
        tx = x;
        ty = y + height / 2;
        break;
      case ANGLE_ORIGIN.MIDDLE_CENTER:
        tx = x + width / 2;
        ty = y + height / 2;
        break;
      case ANGLE_ORIGIN.MIDDLE_RIGHT:
        tx = x + width;
        ty = y + height / 2;
        break;
      case ANGLE_ORIGIN.BOTTOM_LEFT:
        tx = x;
        ty = y + height;
        break;
      case ANGLE_ORIGIN.BOTTOM_CENTER:
        tx = x + width / 2;
        ty = y + height;
        break;
      case ANGLE_ORIGIN.BOTTOM_RIGHT:
        tx = x + width;
        ty = y + height;
        break;
      default: break;
    }
    const offsetX = draw.getOffsetX();
    const offsetY = draw.getOffsetY();
    draw.translate(tx + offsetX, ty + offsetY)
      .rotate(angle)
      .translate(-(tx + offsetX), -(ty + offsetY));
    return this;
  }

  revert() {
    const { draw } = this;
    draw.restore();
    return this;
  }

}

export {
  Angle,
  ANGLE_ORIGIN,
};
