import { PlainUtils } from '../../../utils/PlainUtils';
import { Rect } from '../../../canvas/Rect';
import { RTCosKit, RTSinKit } from '../../../canvas/RTFunction';
import { BaseFont } from '../../../canvas/font/BaseFont';

class BaseCellsHelper {

  getXTableAreaView() {
    throw new TypeError('child impl');
  }

  getRows() {
    throw new TypeError('child impl');
  }

  getStyleTable() {
    throw new TypeError('child impl');
  }

  getCols() {
    throw new TypeError('child impl');
  }

  getMerges() {
    throw new TypeError('child impl');
  }

  getCells() {
    throw new TypeError('child impl');
  }

  getXIteratorBuilder() {
    throw new TypeError('child impl');
  }

  getAngleBarWrapWidth(ri, ci, cell, rect) {
    const xTableAreaView = this.getXTableAreaView();
    const merges = this.getMerges();
    const cols = this.getCols();
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    const scrollView = xTableAreaView.getScrollView();
    const { eci } = scrollView;
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    let width = 0;
    let offset = 0;
    if (angle > 0) {
      width = cols.sectionSumWidth(ci, eci);
    } else {
      width = cols.sectionSumWidth(0, ci - 1) + rect.width;
      offset = -(width - rect.width);
    }
    return { width, offset };
  }

  getHorizontalMaxWidth(ri, ci, cell) {
    const merges = this.getMerges();
    const cols = this.getCols();
    const cells = this.getCells();
    const { fontAttr } = cell;
    const { align } = fontAttr;
    const xIteratorBuilder = this.getXIteratorBuilder();
    let width = 0;
    let offset = 0;
    switch (align) {
      case BaseFont.ALIGN.left: {
        // 计算当前单元格右边
        // 空白的单元格的总宽度
        xIteratorBuilder.getColIterator()
          .setBegin(ci)
          .setEnd(cols.len)
          .setLoop((i) => {
            const merge = merges.getFirstIncludes(ri, i);
            const cell = cells.getCell(ri, i);
            const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
            if (i === ci) {
              width += cols.getWidth(i);
              return true;
            }
            if (blank && PlainUtils.isUnDef(merge)) {
              width += cols.getWidth(i);
              return true;
            }
            return false;
          })
          .execute();
        break;
      }
      case BaseFont.ALIGN.center: {
        let rightWidth = 0;
        let leftWidth = 0;
        // 右边
        xIteratorBuilder.getColIterator()
          .setBegin(ci + 1)
          .setEnd(cols.len)
          .setLoop((i) => {
            const merge = merges.getFirstIncludes(ri, i);
            const cell = cells.getCell(ri, i);
            const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
            if (blank && PlainUtils.isUnDef(merge)) {
              rightWidth += cols.getWidth(i);
              return true;
            }
            return false;
          })
          .execute();
        // 左边
        xIteratorBuilder.getColIterator()
          .setBegin(ci - 1)
          .setEnd(0)
          .setLoop((i) => {
            const merge = merges.getFirstIncludes(ri, i);
            const cell = cells.getCell(ri, i);
            const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
            if (blank && PlainUtils.isUnDef(merge)) {
              const tmp = cols.getWidth(i);
              leftWidth += tmp;
              offset -= tmp;
              return true;
            }
            return false;
          })
          .execute();
        // 统计
        width = cols.getWidth(ci) + leftWidth + rightWidth;
        break;
      }
      case BaseFont.ALIGN.right: {
        // 计算当前单元格左边
        // 空白的单元格的总宽度
        xIteratorBuilder.getColIterator()
          .setBegin(ci)
          .setEnd(0)
          .setLoop((i) => {
            const merge = merges.getFirstIncludes(ri, i);
            const cell = cells.getCell(ri, i);
            const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
            if (i === ci) {
              width += cols.getWidth(i);
              return true;
            }
            if (blank && PlainUtils.isUnDef(merge)) {
              const tmp = cols.getWidth(i);
              width += tmp;
              offset -= tmp;
              return true;
            }
            return false;
          })
          .execute();
        break;
      }
    }
    return { width, offset };
  }

  getAngleMaxWidth(ri, ci, cell, rect) {
    const merges = this.getMerges();
    const cols = this.getCols();
    const rows = this.getRows();
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    const xIteratorBuilder = this.getXIteratorBuilder();
    const { fontAttr } = cell;
    const { angle, align, padding } = fontAttr;
    const rowHeight = rows.getHeight(ri);
    const tilt = RTSinKit.tilt({
      inverse: rowHeight,
      angle,
    });
    let haveWidth = RTCosKit.nearby({ tilt, angle });
    let width = 0;
    let offset = 0;
    switch (align) {
      case BaseFont.ALIGN.left: {
        haveWidth += padding;
        xIteratorBuilder.getColIterator()
          .setBegin(ci)
          .setEnd(cols.len)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            width += colWidth;
            return haveWidth > width;
          })
          .execute();
        break;
      }
      case BaseFont.ALIGN.center: {
        const target = haveWidth - rect.width;
        const half = target / 2;
        let leftWidth = 0;
        xIteratorBuilder.getColIterator()
          .setBegin(ci)
          .setEnd(cols.len)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            leftWidth += colWidth;
            return half + rect.width > leftWidth;
          })
          .execute();
        let rightWidth = 0;
        xIteratorBuilder.getColIterator()
          .setBegin(ci)
          .setEnd(0)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            rightWidth += colWidth;
            return half + rect.width > rightWidth;
          })
          .execute();
        width = leftWidth + rightWidth - rect.width;
        offset = -(width / 2 - rect.width / 2);
        break;
      }
      case BaseFont.ALIGN.right: {
        haveWidth += padding;
        xIteratorBuilder.getColIterator()
          .setBegin(ci)
          .setEnd(0)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            width += colWidth;
            return haveWidth > width;
          })
          .execute();
        offset = -(width - rect.width);
        break;
      }
    }
    return {
      width, offset,
    };
  }

  getAngleBarMaxWidth(ri, ci, cell, rect) {
    const merges = this.getMerges();
    const rows = this.getRows();
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    const rowHeight = rows.getHeight(ri);
    const tilt = RTSinKit.tilt({
      inverse: rowHeight,
      angle,
    });
    let width = RTCosKit.nearby({ tilt, angle });
    let offset = 0;
    if (angle < 0) {
      width = RTCosKit.nearby({ tilt, angle }) + rect.width;
      offset = -width;
    }
    return { width, offset };
  }

  getCellOverFlow(ri, ci, rect, cell) {
    const styleTable = this.getStyleTable();
    const { x, y, height, width } = rect;
    const { fontAttr, contentWidth, ruler } = cell;
    const { direction } = fontAttr;
    const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
    switch (direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL: {
        if (blank === false) {
          const { textWrap } = fontAttr;
          if (textWrap === BaseFont.TEXT_WRAP.OVER_FLOW) {
            if (contentWidth === 0 || contentWidth > width || (ruler === null || ruler.rect.width !== width)) {
              const maxWidth = this.getHorizontalMaxWidth(ri, ci, cell);
              return new Rect({
                x: x + maxWidth.offset, y, width: maxWidth.width, height,
              });
            }
          }
        }
        return rect;
      }
      case BaseFont.TEXT_DIRECTION.ANGLE: {
        if (blank === false) {
          const { textWrap } = fontAttr;
          if (styleTable.isAngleBarCell(ri, ci)) {
            switch (textWrap) {
              case BaseFont.TEXT_WRAP.OVER_FLOW:
              case BaseFont.TEXT_WRAP.TRUNCATE: {
                const maxWidth = this.getAngleBarMaxWidth(ri, ci, cell, rect);
                return new Rect({
                  x: x + maxWidth.offset, y, width: maxWidth.width, height,
                });
              }
              case BaseFont.TEXT_WRAP.WORD_WRAP: {
                const maxWidth = this.getAngleBarWrapWidth(ri, ci, cell, rect);
                return new Rect({
                  x: x + maxWidth.offset, y, width: maxWidth.width, height,
                });
              }
            }
          } else {
            switch (textWrap) {
              case BaseFont.TEXT_WRAP.OVER_FLOW:
              case BaseFont.TEXT_WRAP.TRUNCATE: {
                const max = this.getAngleMaxWidth(ri, ci, cell, rect);
                return new Rect({
                  x: x + max.offset, y, width: max.width, height,
                });
              }
            }
          }
        }
        return rect;
      }
    }
    return null;
  }

}

export {
  BaseCellsHelper,
};
