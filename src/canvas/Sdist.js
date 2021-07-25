import { RTCosKit, RTSinKit } from './RTFunction';

class Sdist {

  constructor({
    rect,
    angle = 0,
  }) {
    this.rect = rect;
    this.angle = angle;
  }

  getLeft() {
    const { angle, rect } = this;
    if (angle > 0) {
      const { height } = rect;
      const tilt = RTSinKit.tilt({
        inverse: height,
        angle,
      });
      return RTCosKit.nearby({
        tilt,
        angle,
      });
    }
    return 0;
  }

  getRight() {
    const { angle, rect } = this;
    if (angle < 0) {
      const { height } = rect;
      const tilt = RTSinKit.tilt({
        inverse: height,
        angle,
      });
      return RTCosKit.nearby({
        tilt,
        angle,
      });
    }
    return 0;
  }

}

export {
  Sdist,
};
