import { SheetUtils } from '../../../utils/SheetUtils';
import { ScaleAdapter } from '../tablebase/Scale';
import { RectRange } from '../tablebase/RectRange';
import { Col } from './Col';
import { CacheWidth } from './CacheWidth';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';
import { Snapshot } from '../snapshot/Snapshot';
import { Listen } from '../../../lib/Listen';

class Cols {

  constructor({
    xIteratorBuilder = new XIteratorBuilder(),
    snapshot = new Snapshot(),
    scaleAdapter = new ScaleAdapter(),
    len = 10,
    data = [],
    width = 110,
  } = {}) {
    this.xIteratorBuilder = xIteratorBuilder;
    this.snapshot = snapshot;
    this.scaleAdapter = scaleAdapter;
    this.cacheWidth = new CacheWidth();
    this.listen = new Listen();
    this.min = 5;
    this.len = len;
    this.data = data;
    this.width = SheetUtils.minIf(width, this.min);
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

  getOriginDefaultWidth() {
    return this.width;
  }

  clearCache() {
    this.cacheWidth.clear();
  }

  setWidth(ci, width) {
    let { listen, scaleAdapter, snapshot } = this;
    let col = this.getOrNew(ci);
    let oldValue = col.width;
    let action = {
      undo: () => {
        col.width = oldValue;
        listen.execute('changeWidth', col);
      },
      redo: () => {
        col.width = scaleAdapter.back(SheetUtils.minIf(width, this.min));
        listen.execute('changeWidth', col);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColAfter(ci) {
    let { listen, data, snapshot } = this;
    let action = {
      undo: () => {
        if (SheetUtils.isNotUnDef(ci)) {
          if (ci <= data.length) {
            data.splice(ci + 1, 1);
          }
        }
        this.len--;
        listen.execute('insertColAfter', ci);
      },
      redo: () => {
        if (SheetUtils.isNotUnDef(ci)) {
          if (ci <= data.length) {
            data.splice(ci + 1, 0, {});
          }
        }
        this.len++;
        listen.execute('insertColAfter', ci);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColBefore(ci) {
    let { listen, data, snapshot } = this;
    let action = {
      undo: () => {
        if (SheetUtils.isNotUnDef(ci)) {
          if (ci <= data.length) {
            data.splice(ci, 1);
          }
        }
        this.len--;
        listen.execute('insertColBefore', ci);
      },
      redo: () => {
        if (SheetUtils.isNotUnDef(ci)) {
          if (ci <= data.length) {
            data.splice(ci, 0, {});
          }
        }
        this.len++;
        listen.execute('insertColBefore', ci);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  removeCol(ci) {
    let { listen, data, snapshot } = this;
    let oldValue;
    let action = {
      undo: () => {
        if (SheetUtils.isNotUnDef(ci)) {
          if (ci <= data.length || oldValue) {
            data.splice(ci, 0, oldValue);
          }
        }
        this.len++;
        listen.execute('removeCol', ci);
      },
      redo: () => {
        if (SheetUtils.isNotUnDef(ci)) {
          if (ci <= data.length) {
            oldValue = data.splice(ci, 1);
          }
        }
        this.len--;
        listen.execute('removeCol', ci);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  sectionSumWidth(sci, eci) {
    let total = 0;
    if (sci > eci) {
      return total;
    }
    const val = this.cacheWidth.get(sci, eci);
    if (val) {
      return val;
    }
    const items = this.cacheWidth.getItems(sci);
    if (items) {
      if (items.min < eci) {
        this.xIteratorBuilder.getColIterator()
          .setBegin(eci)
          .setEnd(sci)
          .setLoop((i) => {
            const val = items.get(i);
            if (val) {
              total += val;
              return false;
            }
            total += this.getWidth(i);
            return true;
          })
          .execute();
        this.cacheWidth.add(sci, eci, total);
        return total;
      }
    }
    this.xIteratorBuilder.getColIterator()
      .setBegin(sci)
      .setEnd(eci)
      .setLoop((i) => {
        total += this.getWidth(i);
      })
      .execute();
    this.cacheWidth.add(sci, eci, total);
    return total;
  }

  rectRangeSumWidth(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumWidth(rectRange.sci, rectRange.eci);
    }
    return 0;
  }

  get(ci) {
    let col = this.data[ci];
    if (col) {
      if (col instanceof Col) {
        return col;
      }
      col = new Col(ci, col);
      this.data[ci] = col;
    }
    return col;
  }

  getOrNew(ci) {
    const col = this.get(ci);
    if (col) {
      return col;
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    this.data[ci] = new Col(ci, {
      width: this.width,
    });
    return this.data[ci];
  }

  getMinWidth() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.min);
  }

  getWidth(ci) {
    if (ci < 0) {
      return 0;
    }
    const { scaleAdapter } = this;
    const col = this.data[ci];
    if (col && col.width) {
      return scaleAdapter.goto(col.width);
    }
    return scaleAdapter.goto(this.width);
  }

  getDefaultWidth() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.width);
  }

  getOriginWidth(ci) {
    if (ci < 0) {
      return 0;
    }
    const col = this.data[ci];
    if (col && col.width) {
      return col.width;
    }
    return this.width;
  }

  eachWidth(ci, ei, cb, sx = 0) {
    let x = sx;
    this.xIteratorBuilder.getColIterator()
      .setBegin(ci)
      .setEnd(ei)
      .setLoop((i) => {
        const colWidth = this.getWidth(i);
        cb(i, colWidth, x);
        x += colWidth;
      })
      .execute();
  }

  getData() {
    return {
      min: this.min,
      len: this.len,
      data: this.data,
      width: this.width,
    };
  }

}

export { Cols };
