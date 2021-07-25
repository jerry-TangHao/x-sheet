import { XMergesIndex } from './XMergesIndex';
import { XMergesNoRow } from './XMergesNoRow';
import { XMergesItems } from './XMergesItems';
import { XMergesNoCol } from './XMergesNoCol';
import { XMergesRange } from './XMergesRange';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RectRange } from '../tablebase/RectRange';
import { XTableDataItems } from '../XTableDataItems';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';
import { Snapshot } from '../snapshot/Snapshot';
import { Listen } from '../../../libs/Listen';

class XMerges {

  constructor({
    xTableData = new XTableDataItems(),
    snapshot = new Snapshot(),
    xIteratorBuilder = new XIteratorBuilder(),
    merges = [],
  } = {}) {
    this.xMergesNoRow = new XMergesNoRow({
      snapshot,
    });
    this.xMergesNoCol = new XMergesNoCol({
      snapshot,
    });
    this.xMergesItems = new XMergesItems();
    this.xMergesIndex = new XMergesIndex(xTableData);
    this.snapshot = snapshot;
    this.listen = new Listen();
    this.xIteratorBuilder = xIteratorBuilder;
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  getIncludes(view, cb) {
    view.each(this.xIteratorBuilder, (ri, ci) => {
      const view = this.getFirstIncludes(ri, ci);
      if (view) {
        cb(view);
      }
    });
  }

  getFirstIncludes(ri, ci) {
    const point = this.xMergesIndex.get(ri, ci);
    if (PlainUtils.isNotUnDef(point)) {
      const view = this.xMergesItems.get(point);
      if (PlainUtils.isNotUnDef(view)) {
        return view.getView();
      }
    }
    return PlainUtils.Undef;
  }

  push(view) {
    let { xMergesItems, xIteratorBuilder, xMergesIndex } = this;
    let { xMergesNoRow, xMergesNoCol } = this;
    let sri = xMergesNoRow.getNo(view.sri);
    let sci = xMergesNoCol.getNo(view.sci);
    let eri = xMergesNoRow.getNo(view.eri);
    let eci = xMergesNoCol.getNo(view.eci);
    let range = new XMergesRange(sri, sci, eri, eci, view);
    let point = xMergesItems.add(range);
    view.each(xIteratorBuilder, (ri, ci) => {
      xMergesIndex.set(ri, ci, point);
    });
  }

  shift(view) {
    const point = this.xMergesIndex.get(view.sri, view.sci);
    if (PlainUtils.isNotUnDef(point)) {
      const full = this.xMergesItems.get(point);
      if (PlainUtils.isNotUnDef(view)) {
        const fullView = full.getView();
        fullView.each(this.xIteratorBuilder, (ri, ci) => { this.xMergesIndex.clear(ri, ci); });
        this.xMergesItems.clear(point);
      }
    }
  }

  add(view) {
    let { listen, snapshot } = this;
    let action = {
      undo: () => {
        this.shift(view);
        listen.execute('add', view);
      },
      redo: () => {
        this.push(view);
        listen.execute('add', view);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  delete(view) {
    let { listen, snapshot } = this;
    let action = {
      undo: () => {
        this.push(view);
        listen.execute('delete', view);
      },
      redo: () => {
        this.shift(view);
        listen.execute('delete', view);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  getAll() {
    const data = [];
    this.xMergesItems.getItems().forEach((item) => {
      if (item) {
        data.push(item.getView());
      }
    });
    return data;
  }

  union(view) {
    let { xMergesItems } = this;
    let sizer = xMergesItems.getSizeOf();
    let span = view.eri - view.sri;
    let find;
    if (span > 50000 && sizer < 1000) {
      let items = this.getAll();
      for (let i = 0, len = items.length; i <= len; i++) {
        const item = items[i];
        if (item) {
          if (item.intersects(view)) {
            if (!view.contains(item)) {
              find = item;
              break;
            }
          }
        }
      }
      if (find) {
        return this.union(find.union(view));
      }
    } else {
      const { top, right, left, bottom } = view.brink();
      top.each(this.xIteratorBuilder, (ri, ci) => {
        const item = this.getFirstIncludes(ri, ci);
        if (PlainUtils.isUnDef(item)) {
          return true;
        }
        if (view.contains(item)) {
          return true;
        }
        find = item;
        return false;
      });
      if (find) {
        return this.union(find.union(view));
      }
      right.each(this.xIteratorBuilder, (ri, ci) => {
        const item = this.getFirstIncludes(ri, ci);
        if (PlainUtils.isUnDef(item)) {
          return true;
        }
        if (view.contains(item)) {
          return true;
        }
        find = item;
        return false;
      });
      if (find) {
        return this.union(find.union(view));
      }
      left.each(this.xIteratorBuilder, (ri, ci) => {
        const item = this.getFirstIncludes(ri, ci);
        if (PlainUtils.isUnDef(item)) {
          return true;
        }
        if (view.contains(item)) {
          return true;
        }
        find = item;
        return false;
      });
      if (find) {
        return this.union(find.union(view));
      }
      bottom.each(this.xIteratorBuilder, (ri, ci) => {
        const item = this.getFirstIncludes(ri, ci);
        if (PlainUtils.isUnDef(item)) {
          return true;
        }
        if (view.contains(item)) {
          return true;
        }
        find = item;
        return false;
      });
      if (find) {
        return this.union(find.union(view));
      }
    }
    return view;
  }

  getData() {
    const data = [];
    this.getAll().forEach((item) => {
      data.push(item.toString());
    });
    return {
      merges: data,
    };
  }

}

export {
  XMerges,
};
