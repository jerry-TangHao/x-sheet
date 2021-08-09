import { SheetUtils } from '../utils/SheetUtils';
import { XDraw } from './XDraw';

const LINE_TYPE = {
  SOLID_LINE: 0,
  DOTTED_LINE: 1,
  POINT_LINE: 2,
  DOUBLE_LINE: 3,
};

class SolidLine {

  constructor(draw, attr) {
    this.draw = draw;
    SheetUtils.copy(this, {
      color: 'rgb(0,0,0)',
      widthType: XDraw.LINE_WIDTH_TYPE.low,
    }, attr);
  }

  setWidthType(widthType) {
    this.widthType = widthType;
  }

  setColor(color) {
    this.color = color;
  }

  horizonLine(sx, sy, ex, ey) {
    const { draw } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash([]);
    draw.horizonLine([sx, sy], [ex, ey]);
  }

  verticalLine(sx, sy, ex, ey) {
    const { draw } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash([]);
    draw.verticalLine([sx, sy], [ex, ey]);
  }

  tiltingLine(sx, sy, ex, ey) {
    const { draw } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash([]);
    draw.corsLine([sx, sy], [ex, ey]);
  }

}

class DottedLine {

  constructor(draw, attr) {
    this.draw = draw;
    SheetUtils.copy(this, {
      color: 'rgb(0,0,0)',
      widthType: XDraw.LINE_WIDTH_TYPE.low,
      dash: [5],
    }, attr);
  }

  setWidthType(widthType) {
    this.widthType = widthType;
  }

  setColor(color) {
    this.color = color;
  }

  horizonLine(sx, sy, ex, ey) {
    const { draw, dash } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash(dash);
    draw.horizonLine([sx, sy], [ex, ey]);
  }

  verticalLine(sx, sy, ex, ey) {
    const { draw, dash } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash(dash);
    draw.verticalLine([sx, sy], [ex, ey]);
  }

  tiltingLine(sx, sy, ex, ey) {
    const { draw, dash } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash(dash);
    draw.corsLine([sx, sy], [ex, ey]);
  }

}

class DoubleLine {

  constructor(draw, attr) {
    this.draw = draw;
    SheetUtils.copy(this, {
      color: 'rgb(0,0,0)',
      widthType: XDraw.LINE_WIDTH_TYPE.low,
      padding: 1,
      spacing: DoubleLine.spacing,
      leftShow: () => false,
      topShow: () => false,
      rightShow: () => false,
      bottomShow: () => false,
      iFMerge: () => false,
      iFMergeFirstRow: () => false,
      iFMergeLastRow: () => false,
      iFMergeFirstCol: () => false,
      iFMergeLastCol: () => false,
    }, attr);
  }

  setWidthType(widthType) {
    this.widthType = widthType;
  }

  setColor(color) {
    this.color = color;
  }

  handleExternal(sx, sy, ex, ey, row, col, pos) {
    const external = {};
    const { leftShow, topShow, rightShow, bottomShow } = this;
    const { iFMerge, iFMergeFirstRow, iFMergeLastRow, iFMergeFirstCol, iFMergeLastCol } = this;
    const { spacing } = this;
    let ifMerge = null;
    let firstRow = null;
    let lastRow = null;
    let firstCol = null;
    let lastCol = null;
    switch (pos) {
      case 'left':
        ifMerge = iFMerge(row, col - 1);
        if (ifMerge) {
          firstRow = iFMergeFirstRow(row, col - 1);
          lastRow = iFMergeLastRow(row, col - 1);
          firstCol = iFMergeFirstCol(row, col - 1);
          lastCol = iFMergeLastCol(row, col - 1);
        }
        break;
      case 'top':
        ifMerge = iFMerge(row - 1, col);
        if (ifMerge) {
          firstRow = iFMergeFirstRow(row - 1, col);
          lastRow = iFMergeLastRow(row - 1, col);
          firstCol = iFMergeFirstCol(row - 1, col);
          lastCol = iFMergeLastCol(row - 1, col);
        }
        break;
      case 'right':
        ifMerge = iFMerge(row, col + 1);
        if (ifMerge) {
          firstRow = iFMergeFirstRow(row, col + 1);
          lastRow = iFMergeLastRow(row, col + 1);
          firstCol = iFMergeFirstCol(row, col + 1);
          lastCol = iFMergeLastCol(row, col + 1);
        }
        break;
      case 'bottom':
        ifMerge = iFMerge(row + 1, col);
        if (ifMerge) {
          firstRow = iFMergeFirstRow(row + 1, col);
          lastRow = iFMergeLastRow(row + 1, col);
          firstCol = iFMergeFirstCol(row + 1, col);
          lastCol = iFMergeLastCol(row + 1, col);
        }
        break;
      default: break;
    }
    if (ifMerge) {
      switch (pos) {
        case 'left': {
          external.sx = sx - spacing;
          external.ex = ex - spacing;
          // 检查顶边和上底边及左上角底边及左顶边
          const sTopLeftCorner = bottomShow(row - 1, col - 1) || topShow(row, col - 1);
          const sTop = topShow(row, col);
          const sBottom = bottomShow(row - 1, col);
          external.sy = sy;
          if (sTop || sBottom) external.sy = sy - spacing;
          if (sTopLeftCorner && firstRow) external.sy = sy + spacing;
          // 检查底边和下顶边及左下角顶边和左底边
          const eBottomLeftCorner = topShow(row + 1, col - 1) || bottomShow(row, col - 1);
          const eBottom = bottomShow(row, col);
          const eTop = topShow(row + 1, col);
          external.ey = ey;
          if (eBottom || eTop) external.ey = ey + spacing;
          if (eBottomLeftCorner && lastRow) external.ey = ey - spacing;
          break;
        }
        case 'top': {
          external.sy = sy - spacing;
          external.ey = ey - spacing;
          // 检查左边和左右边及左上角右边及上左边
          const sTopLeftCorner = rightShow(row - 1, col - 1) || leftShow(row - 1, col);
          const sLeft = leftShow(row, col);
          const sRight = rightShow(row, col - 1);
          external.sx = sx;
          if (sLeft || sRight) external.sx = sx - spacing;
          if (sTopLeftCorner && firstCol) external.sx = sx + spacing;
          // 检查右边和右左边及右上角左边及上右边
          const eTopRightCorner = leftShow(row - 1, col + 1) || rightShow(row - 1, col);
          const eRight = rightShow(row, col);
          const eLeft = leftShow(row, col + 1);
          external.ex = ex;
          if (eRight || eLeft) external.ex = ex + spacing;
          if (eTopRightCorner && lastCol) external.ex = ex - spacing;
          break;
        }
        case 'right': {
          external.sx = sx + spacing;
          external.ex = ex + spacing;
          // 检查顶边和上底边及右上角底边及右顶边
          const sTopRightCorner = bottomShow(row - 1, col + 1) || topShow(row, col + 1);
          const sTop = topShow(row, col);
          const sBottom = bottomShow(row - 1, col);
          external.sy = sy;
          if (sTop || sBottom) external.sy = sy - spacing;
          if (sTopRightCorner && firstRow) external.sy = sy + spacing;
          // 检查底边和下顶边及右下角顶边及右底边
          const eBottomRightCorner = topShow(row + 1, col + 1) || bottomShow(row, col + 1);
          const eBottom = bottomShow(row, col);
          const eTop = topShow(row + 1, col);
          external.ey = ey;
          if (eBottom || eTop) external.ey = ey + spacing;
          if (eBottomRightCorner && lastRow) external.ey = ey - spacing;
          break;
        }
        case 'bottom': {
          external.sy = sy + spacing;
          external.ey = ey + spacing;
          // 检查左边和左右边及左下角右边及下左边
          const sBottomLeftCorner = rightShow(row + 1, col - 1) || leftShow(row + 1, col);
          const sLeft = leftShow(row, col);
          const sRight = rightShow(row, col - 1);
          external.sx = sx;
          if (sLeft || sRight) external.sx = sx - spacing;
          if (sBottomLeftCorner && firstCol) external.sx = sx + spacing;
          // 检查右边和右左边及右下角左边及下右边
          const eBottomRightCorner = leftShow(row + 1, col + 1) || rightShow(row + 1, col);
          const eRight = rightShow(row, col);
          const eLeft = leftShow(row, col + 1);
          external.ex = ex;
          if (eRight || eLeft) external.ex = ex + spacing;
          if (eBottomRightCorner && lastCol) external.ex = ex - spacing;
          break;
        }
        default: break;
      }
      return external;
    }
    switch (pos) {
      case 'left': {
        external.sx = sx - spacing;
        external.ex = ex - spacing;
        // 检查顶边和上底边及左上角底边及左顶边
        const sTopLeftCorner = bottomShow(row - 1, col - 1) || topShow(row, col - 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        external.sy = sy;
        if (sTop || sBottom) external.sy = sy - spacing;
        if (sTopLeftCorner) external.sy = sy + spacing;
        // 检查底边和下顶边及左下角顶边和左底边
        const eBottomLeftCorner = topShow(row + 1, col - 1) || bottomShow(row, col - 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        external.ey = ey;
        if (eBottom || eTop) external.ey = ey + spacing;
        if (eBottomLeftCorner) external.ey = ey - spacing;
        break;
      }
      case 'top': {
        external.sy = sy - spacing;
        external.ey = ey - spacing;
        // 检查左边和左右边及左上角右边及上左边
        const sTopLeftCorner = rightShow(row - 1, col - 1) || leftShow(row - 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        external.sx = sx;
        if (sLeft || sRight) external.sx = sx - spacing;
        if (sTopLeftCorner) external.sx = sx + spacing;
        // 检查右边和右左边及右上角左边及上右边
        const eTopRightCorner = leftShow(row - 1, col + 1) || rightShow(row - 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        external.ex = ex;
        if (eRight || eLeft) external.ex = ex + spacing;
        if (eTopRightCorner) external.ex = ex - spacing;
        break;
      }
      case 'right': {
        external.sx = sx + spacing;
        external.ex = ex + spacing;
        // 检查顶边和上底边及右上角底边及右顶边
        const sTopRightCorner = bottomShow(row - 1, col + 1) || topShow(row, col + 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        external.sy = sy;
        if (sTop || sBottom) external.sy = sy - spacing;
        if (sTopRightCorner) external.sy = sy + spacing;
        // 检查底边和下顶边及右下角顶边及右底边
        const eBottomRightCorner = topShow(row + 1, col + 1) || bottomShow(row, col + 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        external.ey = ey;
        if (eBottom || eTop) external.ey = ey + spacing;
        if (eBottomRightCorner) external.ey = ey - spacing;
        break;
      }
      case 'bottom': {
        external.sy = sy + spacing;
        external.ey = ey + spacing;
        // 检查左边和左右边及左下角右边及下左边
        const sBottomLeftCorner = rightShow(row + 1, col - 1) || leftShow(row + 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        external.sx = sx;
        if (sLeft || sRight) external.sx = sx - spacing;
        if (sBottomLeftCorner) external.sx = sx + spacing;
        // 检查右边和右左边及右下角左边及下右边
        const eBottomRightCorner = leftShow(row + 1, col + 1) || rightShow(row + 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        external.ex = ex;
        if (eRight || eLeft) external.ex = ex + spacing;
        if (eBottomRightCorner) external.ex = ex - spacing;
        break;
      }
      default: break;
    }
    return external;
  }

  handleInternal(sx, sy, ex, ey, row, col, pos) {
    const internal = {};
    const { leftShow, topShow, rightShow, bottomShow } = this;
    const { iFMerge, iFMergeFirstRow, iFMergeLastRow, iFMergeFirstCol, iFMergeLastCol } = this;
    const { spacing } = this;
    const ifMerge = iFMerge(row, col);
    // merge
    if (ifMerge) {
      const firstRow = iFMergeFirstRow(row, col);
      const lastRow = iFMergeLastRow(row, col);
      const firstCol = iFMergeFirstCol(row, col);
      const lastCol = iFMergeLastCol(row, col);
      switch (pos) {
        case 'left': {
          internal.sx = sx + spacing;
          internal.ex = ex + spacing;
          // 检查顶边和上底边及左上角底边及左顶边
          const sTopLeftCorner = bottomShow(row - 1, col - 1) || topShow(row, col - 1);
          const sTop = topShow(row, col);
          const sBottom = bottomShow(row - 1, col);
          internal.sy = sy;
          if (sTopLeftCorner) internal.sy = sy - spacing;
          if ((sTop || sBottom) && firstRow) internal.sy = sy + spacing;
          // 检查底边和下顶边及左下角顶边和左底边
          const eBottomLeftCorner = topShow(row + 1, col - 1) || bottomShow(row, col - 1);
          const eBottom = bottomShow(row, col);
          const eTop = topShow(row + 1, col);
          internal.ey = ey;
          if (eBottomLeftCorner) internal.ey = ey + spacing;
          if ((eBottom || eTop) && lastRow) internal.ey = ey - spacing;
          break;
        }
        case 'top': {
          internal.sy = sy + spacing;
          internal.ey = ey + spacing;
          // 检查左边和左右边及左上角右边及上左边
          const sTopLeftCorner = rightShow(row - 1, col - 1) || leftShow(row - 1, col);
          const sLeft = leftShow(row, col);
          const sRight = rightShow(row, col - 1);
          internal.sx = sx;
          if (sTopLeftCorner) internal.sx = sx - spacing;
          if ((sLeft || sRight) && firstCol) internal.sx = sx + spacing;
          // 检查右边和右左边及右上角左边及上右边
          const eTopRightCorner = leftShow(row - 1, col + 1) || rightShow(row - 1, col);
          const eRight = rightShow(row, col);
          const eLeft = leftShow(row, col + 1);
          internal.ex = ex;
          if (eTopRightCorner) internal.ex = ex + spacing;
          if ((eRight || eLeft) && lastCol) internal.ex = ex - spacing;
          break;
        }
        case 'right': {
          internal.sx = sx - spacing;
          internal.ex = ex - spacing;
          // 检查顶边和上底边及右上角底边及右上边
          const sTopRightCorner = bottomShow(row - 1, col + 1) || topShow(row, col + 1);
          const sTop = topShow(row, col);
          const sBottom = bottomShow(row - 1, col);
          internal.sy = sy;
          if (sTopRightCorner) internal.sy = sy - spacing;
          if ((sTop || sBottom) && firstRow) internal.sy = sy + spacing;
          // 检查底边和下顶边右下角顶边及右下边
          const eBottomRightCorner = topShow(row + 1, col + 1) || bottomShow(row, col + 1);
          const eBottom = bottomShow(row, col);
          const eTop = topShow(row + 1, col);
          internal.ey = ey;
          if (eBottomRightCorner) internal.ey = ey + spacing;
          if ((eBottom || eTop) && lastRow) internal.ey = ey - spacing;
          break;
        }
        case 'bottom': {
          internal.sy = sy - spacing;
          internal.ey = ey - spacing;
          // 检查左边和左右边及左下角右边及下左边
          const sBottomLeftCorner = rightShow(row + 1, col - 1) || leftShow(row + 1, col);
          const sLeft = leftShow(row, col);
          const sRight = rightShow(row, col - 1);
          internal.sx = sx;
          if (sBottomLeftCorner) internal.sx = sx - spacing;
          if ((sLeft || sRight) && firstCol) internal.sx = sx + spacing;
          // 检查右边和右左边及右下角左边及下右边
          const eBottomRightCorner = leftShow(row + 1, col + 1) || rightShow(row + 1, col);
          const eRight = rightShow(row, col);
          const eLeft = leftShow(row, col + 1);
          internal.ex = ex;
          if (eBottomRightCorner) internal.ex = ex + spacing;
          if ((eRight || eLeft) && lastCol) internal.ex = ex - spacing;
          break;
        }
        default: break;
      }
      return internal;
    }
    switch (pos) {
      case 'left': {
        internal.sx = sx + spacing;
        internal.ex = ex + spacing;
        // 检查顶边和上底边及左上角底边及左顶边
        const sTopLeftCorner = bottomShow(row - 1, col - 1) || topShow(row, col - 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        internal.sy = sy;
        if (sTopLeftCorner) internal.sy = sy - spacing;
        if (sTop || sBottom) internal.sy = sy + spacing;
        // 检查底边和下顶边及左下角顶边和左底边
        const eBottomLeftCorner = topShow(row + 1, col - 1) || bottomShow(row, col - 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        internal.ey = ey;
        if (eBottomLeftCorner) internal.ey = ey + spacing;
        if (eBottom || eTop) internal.ey = ey - spacing;
        break;
      }
      case 'top': {
        internal.sy = sy + spacing;
        internal.ey = ey + spacing;
        // 检查左边和左右边及左上角右边及上左边
        const sTopLeftCorner = rightShow(row - 1, col - 1) || leftShow(row - 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        internal.sx = sx;
        if (sTopLeftCorner) internal.sx = sx - spacing;
        if (sLeft || sRight) internal.sx = sx + spacing;
        // 检查右边和右左边及右上角左边及上右边
        const eTopRightCorner = leftShow(row - 1, col + 1) || rightShow(row - 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        internal.ex = ex;
        if (eTopRightCorner) internal.ex = ex + spacing;
        if (eRight || eLeft) internal.ex = ex - spacing;
        break;
      }
      case 'right': {
        internal.sx = sx - spacing;
        internal.ex = ex - spacing;
        // 检查顶边和上底边及右上角底边及右上边
        const sTopRightCorner = bottomShow(row - 1, col + 1) || topShow(row, col + 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        internal.sy = sy;
        if (sTopRightCorner) internal.sy = sy - spacing;
        if (sTop || sBottom) internal.sy = sy + spacing;
        // 检查底边和下顶边右下角顶边及右下边
        const eBottomRightCorner = topShow(row + 1, col + 1) || bottomShow(row, col + 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        internal.ey = ey;
        if (eBottomRightCorner) internal.ey = ey + spacing;
        if (eBottom || eTop) internal.ey = ey - spacing;
        break;
      }
      case 'bottom': {
        internal.sy = sy - spacing;
        internal.ey = ey - spacing;
        // 检查左边和左右边及左下角右边及下左边
        const sBottomLeftCorner = rightShow(row + 1, col - 1) || leftShow(row + 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        internal.sx = sx;
        if (sBottomLeftCorner) internal.sx = sx - spacing;
        if (sLeft || sRight) internal.sx = sx + spacing;
        // 检查右边和右左边及右下角左边及下右边
        const eBottomRightCorner = leftShow(row + 1, col + 1) || rightShow(row + 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        internal.ex = ex;
        if (eBottomRightCorner) internal.ex = ex + spacing;
        if (eRight || eLeft) internal.ex = ex - spacing;
        break;
      }
      default: break;
    }
    return internal;
  }

  horizonLine(sx, sy, ex, ey, row, col, pos) {
    const { draw } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash([]);
    const external = this.handleExternal(sx, sy, ex, ey, row, col, pos);
    const internal = this.handleInternal(sx, sy, ex, ey, row, col, pos);
    if (!SheetUtils.isEmptyObject(internal)) {
      draw.horizonLine([internal.sx, internal.sy], [internal.ex, internal.ey]);
    }
    if (!SheetUtils.isEmptyObject(external)) {
      draw.horizonLine([external.sx, external.sy], [external.ex, external.ey]);
    }
  }

  verticalLine(sx, sy, ex, ey, row, col, pos) {
    const { draw } = this;
    const {
      widthType, color,
    } = this;
    draw.setLineColor(color);
    draw.setLineWidthType(widthType);
    draw.setLineDash([]);
    const external = this.handleExternal(sx, sy, ex, ey, row, col, pos);
    const internal = this.handleInternal(sx, sy, ex, ey, row, col, pos);
    if (!SheetUtils.isEmptyObject(internal)) {
      draw.verticalLine([internal.sx, internal.sy], [internal.ex, internal.ey]);
    }
    if (!SheetUtils.isEmptyObject(external)) {
      draw.verticalLine([external.sx, external.sy], [external.ex, external.ey]);
    }
  }

  // eslint-disable-next-line no-unused-vars
  tiltingLine(sx, sy, ex, ey, row, col, pos) {
    // TODO ..
    // ...
  }

}
DoubleLine.spacing = XDraw.dpr() >= 2 ? 3 : 2;

class Line {

  constructor(draw, attr = {}) {
    this.widthType = XDraw.LINE_WIDTH_TYPE.low;
    this.type = LINE_TYPE.SOLID_LINE;
    this.solidLine = new SolidLine(draw, SheetUtils.copy({}, attr));
    this.dottedLine = new DottedLine(draw, SheetUtils.copy({
      dash: [5],
    }, attr));
    this.pointLine = new DottedLine(draw, SheetUtils.copy({
      dash: [2, 2],
    }, attr));
    this.doubleLine = new DoubleLine(draw, SheetUtils.copy({}, attr));
  }

  setWidthType(widthType) {
    if (widthType) {
      if (this.type === LINE_TYPE.SOLID_LINE) {
        this.solidLine.setWidthType(widthType);
      }
    }
  }

  setColor(color) {
    if (color) {
      this.solidLine.setColor(color);
      this.dottedLine.setColor(color);
      this.pointLine.setColor(color);
      this.doubleLine.setColor(color);
    }
  }

  setType(type) {
    this.type = type;
  }

  horizonLine(sx, sy, ex, ey, row, col, pos) {
    const {
      type,
      solidLine,
      dottedLine,
      pointLine,
      doubleLine,
    } = this;
    switch (type) {
      case LINE_TYPE.SOLID_LINE:
        solidLine.horizonLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOTTED_LINE:
        dottedLine.horizonLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.POINT_LINE:
        pointLine.horizonLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOUBLE_LINE:
        doubleLine.horizonLine(sx, sy, ex, ey, row, col, pos);
        break;
    }
  }

  verticalLine(sx, sy, ex, ey, row, col, pos) {
    const {
      type,
      solidLine,
      dottedLine,
      pointLine,
      doubleLine,
    } = this;
    switch (type) {
      case LINE_TYPE.SOLID_LINE:
        solidLine.verticalLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOTTED_LINE:
        dottedLine.verticalLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.POINT_LINE:
        pointLine.verticalLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOUBLE_LINE:
        doubleLine.verticalLine(sx, sy, ex, ey, row, col, pos);
        break;
    }
  }

  tiltingLine(sx, sy, ex, ey, row, col, pos) {
    const {
      type,
      solidLine,
      dottedLine,
      pointLine,
      doubleLine,
    } = this;
    switch (type) {
      case LINE_TYPE.SOLID_LINE:
        solidLine.tiltingLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOTTED_LINE:
        dottedLine.tiltingLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.POINT_LINE:
        pointLine.tiltingLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOUBLE_LINE:
        doubleLine.tiltingLine(sx, sy, ex, ey, row, col, pos);
        break;
    }
  }

}

export {
  Line, LINE_TYPE, SolidLine,
};
