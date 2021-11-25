import { SheetUtils } from '../../../utils/SheetUtils';
import { ScaleAdapter } from '../tablebase/Scale';
import { RectRange } from '../tablebase/RectRange';
import { Row } from './Row';
import { CacheHeight } from './CacheHeight';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';
import { Snapshot } from '../snapshot/Snapshot';
import { Listen } from '../../../lib/Listen';

class Rows {

  constructor({
    xIteratorBuilder = new XIteratorBuilder(),
    snapshot = new Snapshot(),
    scaleAdapter = new ScaleAdapter(),
    len = 10,
    data = [],
    height = 30,
  } = {}) {
    this.xIteratorBuilder = xIteratorBuilder;
    this.snapshot = snapshot;
    this.scaleAdapter = scaleAdapter;
    this.cacheHeight = new CacheHeight();
    this.listen = new Listen();
    this.min = 5;
    this.len = len;
    this.data = data;
    this.height = SheetUtils.minIf(height, this.min);
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

  getOriginDefaultHeight() {
    return this.height;
  }

  clearCache() {
    this.cacheHeight.clear();
  }

  setHeight(ri, height) {
    let { listen, scaleAdapter, snapshot } = this;
    let row = this.getOrNew(ri);
    let oldValue = row.height;
    let action = {
      undo: () => {
        row.height = oldValue;
        listen.execute('changeHeight', row);
      },
      redo: () => {
        row.height = scaleAdapter.back(SheetUtils.minIf(height, this.min));
        listen.execute('changeHeight', row);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowAfter(ri) {
    let { listen, data, snapshot } = this;
    let action = {
      undo: () => {
        if (SheetUtils.isDef(ri)) {
          if (ri <= data.length) {
            data.splice(ri + 1, 1);
          }
        }
        this.len--;
        listen.execute('insertRowAfter', ri);
      },
      redo: () => {
        if (SheetUtils.isDef(ri)) {
          if (ri <= data.length) {
            data.splice(ri + 1, 0, {});
          }
        }
        this.len++;
        listen.execute('insertRowAfter', ri);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowBefore(ri) {
    let { listen, data, snapshot } = this;
    let action = {
      undo: () => {
        if (SheetUtils.isDef(ri)) {
          if (ri <= data.length) {
            data.splice(ri, 1);
          }
        }
        this.len--;
        listen.execute('insertRowBefore', ri);
      },
      redo: () => {
        if (SheetUtils.isDef(ri)) {
          if (ri <= data.length) {
            data.splice(ri, 0, {});
          }
        }
        this.len++;
        listen.execute('insertRowBefore', ri);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  removeRow(ri) {
    let { listen, data, snapshot } = this;
    let oldValue;
    let action = {
      undo: () => {
        if (SheetUtils.isDef(ri)) {
          if (oldValue) {
            data.splice(ri, 0, oldValue);
          }
        }
        this.len++;
        listen.execute('removeRow', ri);
      },
      redo: () => {
        oldValue = SheetUtils.Undef;
        if (SheetUtils.isDef(ri)) {
          if (ri <= data.length) {
            oldValue = data.splice(ri, 1)[0];
          }
        }
        this.len--;
        listen.execute('removeRow', ri);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  rectRangeSumHeight(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumHeight(rectRange.sri, rectRange.eri);
    }
    return 0;
  }

  sectionSumHeight(sri, eri) {
    let total = 0;
    if (sri > eri) {
      return total;
    }
    const val = this.cacheHeight.get(sri, eri);
    if (val) {
      return val;
    }
    const items = this.cacheHeight.getItems(sri);
    if (items) {
      if (items.min < eri) {
        this.xIteratorBuilder.getRowIterator()
          .setBegin(eri)
          .setEnd(sri)
          .setLoop((i) => {
            const val = items.get(i);
            if (val) {
              total += val;
              return false;
            }
            total += this.getHeight(i);
            return true;
          })
          .execute();
        this.cacheHeight.add(sri, eri, total);
        return total;
      }
    }
    this.xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        total += this.getHeight(i);
      })
      .execute();
    this.cacheHeight.add(sri, eri, total);
    return total;
  }

  get(ri) {
    let row = this.data[ri];
    if (row) {
      if (row instanceof Row) {
        return row;
      }
      row = new Row(ri, row);
      this.data[ri] = row;
    }
    return row;
  }

  getOrNew(ri) {
    const row = this.get(ri);
    if (row) {
      return row;
    }
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    this.data[ri] = new Row(ri, {
      height: this.height,
    });
    return this.data[ri];
  }

  getMinHeight() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.min);
  }

  getHeight(ri) {
    if (ri < 0) {
      return 0;
    }
    const { scaleAdapter } = this;
    const row = this.get(ri);
    if (row && row.height) {
      return scaleAdapter.goto(row.height);
    }
    return scaleAdapter.goto(this.height);
  }

  getDefaultHeight() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.height);
  }

  getOriginHeight(ri) {
    if (ri < 0) {
      return 0;
    }
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  eachHeight(ri, ei, cb, sy = 0) {
    let y = sy;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(ri)
      .setEnd(ei)
      .setLoop((i) => {
        const rowHeight = this.getHeight(i);
        cb(i, rowHeight, y);
        y += rowHeight;
      })
      .execute();
  }

  getData() {
    return {
      min: this.min,
      len: this.len,
      data: this.data,
      height: this.height,
    };
  }

  syncRowsLen(rows) {
    if (rows) {
      this.len = rows.len;
    }
  }

}

export { Rows };
