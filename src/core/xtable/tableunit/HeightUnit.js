import FindDpi from '../../../libs/finddpi/FindDpi';
import { PlainUtils } from '../../../utils/PlainUtils';

/**
 * 高度单位
 */
class HeightUnit {

  /**
   * HeightUnit
   * @param dpi
   */
  constructor({
    dpi,
  } = {}) {
    if (PlainUtils.isNotUnDef(dpi)) {
      this.dpi = dpi;
    } else {
      this.dpi = FindDpi();
    }
  }

  /**
   * 获取DPI
   * @returns {*}
   */
  getDpi() {
    return this.dpi;
  }

  /**
   * 磅转像素
   */
  getPixel(pt) {
    return pt * this.dpi / 72;
  }

  /**
   * 像素转磅
   */
  getPoint(px) {
    return 72 * px / this.dpi;
  }

}

export {
  HeightUnit,
};
