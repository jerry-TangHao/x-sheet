import { RectRange } from '../core/table/tablebase/RectRange';

class RtreeUtils {

  static bboxToRange(bbox) {
    return new RectRange(bbox.minY, bbox.minX, bbox.maxY, bbox.maxX);
  }

  static rangeToBbox(range) {
    return {
      minX: range.sci,
      minY: range.sri,
      maxX: range.eci,
      maxY: range.eri,
    };
  }

}

export {
  RtreeUtils,
};
