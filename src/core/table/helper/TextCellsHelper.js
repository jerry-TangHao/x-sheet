import { BaseCellsHelper } from './BaseCellsHelper';
import { Rect } from '../../../canvas/Rect';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RectRange } from '../tablebase/RectRange';
import { ColsIterator } from '../iterator/ColsIterator';
import { RowsIterator } from '../iterator/RowsIterator';

const TEXT_BREAK_LOOP = {
  CONTINUE: 3,
  ROW: 1,
  RETURN: 2,
};

class TextCellsHelper extends BaseCellsHelper {

  constructor(table) {
    super();
    this.table = table;
  }

  getXTableAreaView() {
    return this.table.xTableAreaView;
  }

  getRows() {
    return this.table.rows;
  }

  getStyleTable() {
    return this.table;
  }

  getCols() {
    return this.table.cols;
  }

  getMerges() {
    return this.table.merges;
  }

  getCells() {
    return this.table.cells;
  }

  getCellByViewRange({
    reverseRows = false,
    reverseCols = false,
    startX = 0,
    startY = 0,
    newRow = () => {},
    newCol = () => {},
    view = new RectRange(0, 0, 0, 0, 0, 0),
    cellsINCallback = () => {},
    mergeCallback = () => {},
  }) {
    const rows = this.getRows();
    const cols = this.getCols();
    const cells = this.getCells();
    const merges = this.getMerges();
    const { sri, eri, sci, eci } = view;
    const filter = [];
    if (reverseRows && reverseCols) {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(eri)
        .setEnd(sri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          y -= height;
          newRow(row);
          ColsIterator.getInstance()
            .setBegin(eci)
            .setEnd(sci)
            .setLoop((col) => {
              const merge = merges.getFirstIncludes(row, col);
              const width = cols.getWidth(col);
              newCol(col);
              x -= width;
              if (merge) {
                const find = filter.find(i => i === merge);
                if (PlainUtils.isUnDef(find)) {
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
                  const cellsINInfo = this.cellsINInfo({
                    x, y, width, height, row, col, cell,
                  });
                  const { rect, overflow } = cellsINInfo;
                  result = cellsINCallback(row, col, cell, rect, overflow);
                }
              }
              switch (result) {
                case TEXT_BREAK_LOOP.RETURN:
                case TEXT_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          switch (result) {
            case TEXT_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    } else if (reverseRows) {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(eri)
        .setEnd(sri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          newRow(row);
          y -= height;
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((col) => {
              const merge = merges.getFirstIncludes(row, col);
              const width = cols.getWidth(col);
              newCol(col);
              if (merge) {
                const find = filter.find(i => i === merge);
                if (PlainUtils.isUnDef(find)) {
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
                  const cellsINInfo = this.cellsINInfo({
                    x, y, width, height, row, col, cell,
                  });
                  const { rect, overflow } = cellsINInfo;
                  result = cellsINCallback(row, col, cell, rect, overflow);
                }
              }
              x += width;
              switch (result) {
                case TEXT_BREAK_LOOP.RETURN:
                case TEXT_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          switch (result) {
            case TEXT_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    } else if (reverseCols) {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          newRow(row);
          ColsIterator.getInstance()
            .setBegin(eci)
            .setEnd(sci)
            .setLoop((col) => {
              const merge = merges.getFirstIncludes(row, col);
              const width = cols.getWidth(col);
              newCol(col);
              x -= width;
              if (merge) {
                const find = filter.find(i => i === merge);
                if (PlainUtils.isUnDef(find)) {
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
                  const cellsINInfo = this.cellsINInfo({
                    x, y, width, height, row, col, cell,
                  });
                  const { rect, overflow } = cellsINInfo;
                  result = cellsINCallback(row, col, cell, rect, overflow);
                }
              }
              switch (result) {
                case TEXT_BREAK_LOOP.RETURN:
                case TEXT_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          y += height;
          switch (result) {
            case TEXT_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    } else {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((row) => {
          const height = rows.getHeight(row);
          let result = null;
          let x = startX;
          newRow(row);
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((col) => {
              const merge = merges.getFirstIncludes(row, col);
              const width = cols.getWidth(col);
              newCol(col);
              if (merge) {
                const find = filter.find(i => i === merge);
                if (PlainUtils.isUnDef(find)) {
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
                  const cellsINInfo = this.cellsINInfo({
                    x, y, width, height, row, col, cell,
                  });
                  const { rect, overflow } = cellsINInfo;
                  result = cellsINCallback(row, col, cell, rect, overflow);
                }
              }
              x += width;
              switch (result) {
                case TEXT_BREAK_LOOP.RETURN:
                case TEXT_BREAK_LOOP.ROW:
                  return false;
                default: return true;
              }
            })
            .execute();
          y += height;
          switch (result) {
            case TEXT_BREAK_LOOP.RETURN:
              return false;
            default: return true;
          }
        })
        .execute();
    }
  }

  mergeInfo({
    view, merge,
  }) {
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
    const cell = cells.getCell(merge.sri, merge.sci);
    const rect = new Rect({ x, y, width, height });
    return { rect, cell, merge };
  }

  cellsINInfo({
    width, height, col, row, x, y, cell,
  }) {
    const rect = new Rect({ x, y, width, height });
    const overflow = this.getCellOverFlow(row, col, rect, cell);
    return { rect, overflow };
  }

}

export {
  TextCellsHelper, TEXT_BREAK_LOOP,
};
