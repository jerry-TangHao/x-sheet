import { XDraw } from './XDraw';

/**
 * RTSinKit
 */
class RTSinKit {

  /**
   * 计算对边
   * @see http://math001.com/trigonometric_function/
   * @param tilt 斜边
   * @param angle 角度
   */
  static inverse({ tilt, angle }) {
    return Math.abs(tilt * Math.sin(XDraw.radian(angle)));
  }

  /**
   * 计算斜边
   * @see http://math001.com/trigonometric_function/
   * @param inverse 对边
   * @param angle 角度
   */
  static tilt({ inverse, angle }) {
    return Math.abs(inverse / Math.sin(XDraw.radian(angle)));
  }

}

/**
 * RTCosKit
 */
class RTCosKit {

  /**
   * 计算邻边
   * @see http://math001.com/trigonometric_function/
   * @param tilt
   * @param angle
   */
  static nearby({ tilt, angle }) {
    return Math.abs(tilt * Math.cos(XDraw.radian((angle))));
  }

  /**
   * 计算斜边
   * @see http://math001.com/trigonometric_function/
   * @param nearby 领边
   * @param angle 角度
   */
  static tilt({ nearby, angle }) {
    return Math.abs(nearby / Math.cos(XDraw.radian((angle))));
  }

}

export {
  RTSinKit, RTCosKit,
};
