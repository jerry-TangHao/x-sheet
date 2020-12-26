import { RowsIterator } from '../iterator/RowsIterator';
import { ColsIterator } from '../iterator/ColsIterator';
import { XLineIteratorFilter } from './XLineIteratorFilter';
import { RectRange } from '../tablebase/RectRange';

class XLineIteratorLoop {

  constructor({
    foldOnOff = true,
    items = [],
    bx = 0,
    by = 0,
    table,
    filter = XLineIteratorFilter.EMPTY,
    view = RectRange.EMPTY,
  }) {
    this.foldOnOff = foldOnOff;
    this.bx = bx;
    this.by = by;
    this.items = items;
    this.table = table;
    this.filter = filter;
    this.view = view;
  }

  run() {
    const { view, table } = this;
    const { rows, cols } = table;
    const { filter, foldOnOff } = this;
    const { bx, by } = this;
    const { sri, eri, sci, eci } = view;
    let y = by;
    let firstRow = true;
    let lastRow = false;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((row) => {
        const height = rows.getHeight(row);
        const result = filter.run({ row });
        switch (result) {
          case XLineIteratorFilter.RETURN_TYPE.EXEC: {
            this.runNewRow(row, y);
            lastRow = row === eri;
            let x = bx;
            ColsIterator.getInstance()
              .setBegin(sci)
              .setEnd(eci)
              .setLoop((col) => {
                const width = cols.getWidth(col);
                if (firstRow) {
                  this.runNewCol(col, x);
                }
                this.runFilter(row, col, x, y);
                if (lastRow) {
                  this.runEndCol(col);
                }
                x += width;
              })
              .execute();
            firstRow = false;
            this.runEndRow(row);
            break;
          }
          case XLineIteratorFilter.RETURN_TYPE.JUMP: {
            break;
          }
        }
        y += height;
      })
      .foldOnOff(foldOnOff)
      .execute();
    this.runComplete();
  }

  runNewRow(row, y) {
    const { items } = this;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      item.newRow({ row, y });
    }
  }

  runNewCol(col, x) {
    const { items } = this;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      item.newCol({ col, x });
    }
  }

  runEndRow(row) {
    const { items } = this;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      item.endRow({ row });
    }
  }

  runEndCol(col) {
    const { items } = this;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      item.endCol({ col });
    }
  }

  runFilter(row, col, x, y) {
    const { items } = this;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const result = item.filter.run({ row, col });
      switch (result) {
        case XLineIteratorFilter.RETURN_TYPE.EXEC:
          item.exec({ row, col, x, y });
          break;
        case XLineIteratorFilter.RETURN_TYPE.JUMP:
          item.jump({ row, col, x, y });
          break;
      }
    }
  }

  runComplete() {
    const { items } = this;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      item.complete();
    }
  }

}

export {
  XLineIteratorLoop,
};
