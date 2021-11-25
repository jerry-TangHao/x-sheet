import { BaseCellsHelper } from '../base/BaseCellsHelper';
import { Rect } from '../../../../draw/Rect';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { RectRange } from '../../tablebase/RectRange';

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

  getXIteratorBuilder() {
    return this.table.xIteratorBuilder;
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
    const { table } = this;
    const { xIteratorBuilder } = table;
    const { sri, eri, sci, eci } = view;
    const filter = [];
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
              newCol(col);
              x -= width;
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
              newCol(col);
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
              newCol(col);
              x -= width;
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
              newCol(col);
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
    view,
    merge,
  }) {
    const rows = this.getRows();
    const cols = this.getCols();
    const cells = this.getCells();
    // 计算坐标
    const minSri = Math.min(view.sri, merge.sri);
    const minSci = Math.min(view.sci, merge.sci);
    const maxSri = Math.max(view.sri, merge.sri) - 1;
    const maxSci = Math.max(view.sci, merge.sci) - 1;
    let x = cols.sectionSumWidth(minSci, maxSci);
    let y = rows.sectionSumHeight(minSri, maxSri);
    x = view.sci > merge.sci ? -x : x;
    y = view.sri > merge.sri ? -y : y;
    // 计算尺寸
    const height = rows.sectionSumHeight(merge.sri, merge.eri);
    const width = cols.sectionSumWidth(merge.sci, merge.eci);
    const cell = cells.getCell(merge.sri, merge.sci);
    const rect = new Rect({ x, y, width, height });
    return { rect, cell, merge };
  }

  cellsINInfo({
    width,
    height,
    col,
    row,
    x, y,
    cell,
  }) {
    const rect = new Rect({ x, y, width, height });
    const overflow = this.getCellOverFlow(row, col, rect, cell);
    return { rect, overflow };
  }
}

export {
  TextCellsHelper,
  TEXT_BREAK_LOOP,
};
