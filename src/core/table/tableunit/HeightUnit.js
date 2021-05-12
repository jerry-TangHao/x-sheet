import FindDpi from '../../../libs/finddpi/FindDpi';

const DPI = FindDpi();

/**
 * 高度单位
 */
class HeightUnit {

  /**
   * 像素转磅
   */
  getPoint(px) {
    return 72 * px / DPI;
  }

  /**
   * 磅转像素
   */
  getPixel(pt) {
    return pt * DPI / 72;
  }

}

export {
  HeightUnit,
};
