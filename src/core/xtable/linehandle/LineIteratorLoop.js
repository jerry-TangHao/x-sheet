import { RectRange } from '../tablebase/RectRange';
import { LineIteratorFilter } from './LineIteratorFilter';

class LineIteratorLoop {

  constructor({
    foldOnOff = true,
    view = RectRange.EMPTY,
    bx = 0,
    by = 0,
    table = null,
    items = [],
    filter = LineIteratorFilter.EMPTY,
  }) {
    this.foldOnOff = foldOnOff;
    this.bx = bx;
    this.by = by;
    this.table = table;
    this.items = items;
    this.view = view;
    this.filter = filter;
  }

  run() {
    const { view, table } = this;
    const { rows, cols, xIteratorBuilder } = table;
    const { filter, foldOnOff } = this;
    const { bx, by } = this;
    const { sri, eri, sci, eci } = view;
    let y = by;
    let firstRow = true;
    let lastRow = false;
    xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((row) => {
        const height = rows.getHeight(row);
        const result = filter.run({ row });
        switch (result) {
          case LineIteratorFilter.RETURN_TYPE.EXEC: {
            this.runNewRow(row, y);
            lastRow = row === eri;
            let x = bx;
            xIteratorBuilder.getColIterator()
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
          case LineIteratorFilter.RETURN_TYPE.JUMP: {
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
      const result = item.filter.run({ row, col, x, y });
      switch (result) {
        case LineIteratorFilter.RETURN_TYPE.EXEC:
          item.exec({ row, col, x, y });
          break;
        case LineIteratorFilter.RETURN_TYPE.JUMP:
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
  LineIteratorLoop,
};
