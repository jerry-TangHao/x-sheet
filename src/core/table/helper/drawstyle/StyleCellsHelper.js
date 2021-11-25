import { BaseCellsHelper } from '../base/BaseCellsHelper';
import { Rect } from '../../../../draw/Rect';
import { SheetUtils } from '../../../../utils/SheetUtils';

const STYLE_BREAK_LOOP = {
  CONTINUE: 3,
  ROW: 1,
  RETURN: 2,
};

class StyleCellsHelper extends BaseCellsHelper {

  constructor(table) {
    super();
    this.table = table;
  }

  mergeInfo({
    view,
    merge,
  } = {}) {
    const rows = this.getRows();
    const cols = this.getCols();
    const cells = this.getCells();
    // 计算坐标
    const minSri = Math.min(view.sri, merge.sri);
    const minSci = Math.min(view.sci, merge.sci);
    let maxSri = Math.max(view.sri, merge.sri);
    let maxSci = Math.max(view.sci, merge.sci);
    maxSri -= 1;
    maxSci -= 1;
    let x = cols.sectionSumWidth(minSci, maxSci);
    let y = rows.sectionSumHeight(minSri, maxSri);
    x = view.sci > merge.sci ? x * -1 : x;
    y = view.sri > merge.sri ? y * -1 : y;
    // 计算尺寸
    const height = rows.sectionSumHeight(merge.sri, merge.eri);
    const width = cols.sectionSumWidth(merge.sci, merge.eci);
    const cell = cells.getCellOrNew(merge.sri, merge.sci);
    const rect = new Rect({ x, y, width, height });
    return { rect, cell };
  }

  getXTableAreaView() {
    return this.table.xTableAreaView;
  }

  getMerges() {
    return this.table.merges;
  }

  getStyleTable() {
    return this.table;
  }

  getRows() {
    return this.table.rows;
  }

  getCols() {
    return this.table.cols;
  }

  getCells() {
    return this.table.cells;
  }

  getXIteratorBuilder() {
    return this.table.xIteratorBuilder;
  }

  getCellByViewRange({
    view,
    reverseRows = false,
    reverseCols = false,
    startX = 0,
    startY = 0,
    newRow = () => {},
    newCol = () => {},
    cellsINCallback = () => {},
    mergeCallback = () => {},
    loopINCallback = () => {},
  } = {}) {
    const { table } = this;
    const { xIteratorBuilder } = table;
    const rows = this.getRows();
    const cols = this.getCols();
    const cells = this.getCells();
    const merges = this.getMerges();
    const { sri, eri, sci, eci } = view;
    const filter = [];
    let y = startY;
    if (reverseRows && reverseCols) {
      let y = startY;
      xIteratorBuilder.getRowIterator()
        .setBegin(eri)
        .setEnd(sri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          y -= height;
          newRow(row);
          xIteratorBuilder.getColIterator()
            .setBegin(eci)
            .setEnd(sci)
            .setLoop((col) => {
              const merge = merges.getFirstInclude(row, col);
              const width = cols.getWidth(col);
              x -= width;
              const rect = new Rect({ x, y, width, height });
              newCol(col);
              loopINCallback(row, col, rect);
              if (merge) {
                const find = filter.find(i => i.equals(merge));
                if (SheetUtils.isUnDef(find)) {
                  filter.push(merge);
                  const mergeInfo = this.mergeInfo({
                    view, merge,
                  });
                  const { rect, cell } = mergeInfo;
                  result = mergeCallback(row, col, cell, rect, merge);
                }
              } else {
                const cell = cells.getCell(row, col);
                if (cell) {
                  result = cellsINCallback(row, col, cell, rect);
                }
              }
              switch (result) {
                case STYLE_BREAK_LOOP.RETURN:
                case STYLE_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          switch (result) {
            case STYLE_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    } else if (reverseRows) {
      let y = startY;
      xIteratorBuilder.getRowIterator()
        .setBegin(eri)
        .setEnd(sri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          newRow(row);
          y -= height;
          xIteratorBuilder.getColIterator()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((col) => {
              const merge = merges.getFirstInclude(row, col);
              const width = cols.getWidth(col);
              const rect = new Rect({ x, y, width, height });
              newCol(col);
              loopINCallback(row, col, rect);
              if (merge) {
                const find = filter.find(i => i.equals(merge));
                if (SheetUtils.isUnDef(find)) {
                  filter.push(merge);
                  const mergeInfo = this.mergeInfo({
                    view, merge,
                  });
                  const { rect, cell } = mergeInfo;
                  result = mergeCallback(row, col, cell, rect, merge);
                }
              } else {
                const cell = cells.getCell(row, col);
                if (cell) {
                  result = cellsINCallback(row, col, cell, rect);
                }
              }
              x += width;
              switch (result) {
                case STYLE_BREAK_LOOP.RETURN:
                case STYLE_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          switch (result) {
            case STYLE_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    } else if (reverseCols) {
      let y = startY;
      xIteratorBuilder.getRowIterator()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          newRow(row);
          xIteratorBuilder.getColIterator()
            .setBegin(eci)
            .setEnd(sci)
            .setLoop((col) => {
              const merge = merges.getFirstInclude(row, col);
              const width = cols.getWidth(col);
              x -= width;
              const rect = new Rect({ x, y, width, height });
              newCol(col);
              loopINCallback(row, col, rect);
              if (merge) {
                const find = filter.find(i => i.equals(merge));
                if (SheetUtils.isUnDef(find)) {
                  filter.push(merge);
                  const mergeInfo = this.mergeInfo({
                    view, merge,
                  });
                  const { rect, cell } = mergeInfo;
                  result = mergeCallback(row, col, cell, rect, merge);
                }
              } else {
                const cell = cells.getCell(row, col);
                if (cell) {
                  result = cellsINCallback(row, col, cell, rect);
                }
              }
              switch (result) {
                case STYLE_BREAK_LOOP.RETURN:
                case STYLE_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          y += height;
          switch (result) {
            case STYLE_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    } else {
      xIteratorBuilder.getRowIterator()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          newRow(row);
          xIteratorBuilder.getColIterator()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((col) => {
              const merge = merges.getFirstInclude(row, col);
              const width = cols.getWidth(col);
              const rect = new Rect({ x, y, width, height });
              newCol(col);
              loopINCallback(row, col, rect);
              if (merge) {
                const find = filter.find(i => i.equals(merge));
                if (SheetUtils.isUnDef(find)) {
                  filter.push(merge);
                  const mergeInfo = this.mergeInfo({
                    view, merge,
                  });
                  const { rect, cell } = mergeInfo;
                  result = mergeCallback(row, col, cell, rect, merge);
                }
              } else {
                const cell = cells.getCell(row, col);
                if (cell) {
                  result = cellsINCallback(row, col, cell, rect);
                }
              }
              x += width;
              switch (result) {
                case STYLE_BREAK_LOOP.RETURN:
                case STYLE_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          y += height;
          switch (result) {
            case STYLE_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    }
  }
}

export {
  StyleCellsHelper, STYLE_BREAK_LOOP,
};
