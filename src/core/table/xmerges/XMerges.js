import { XMergesIndex } from './XMergesIndex';
import { XMergesNoRow } from './XMergesNoRow';
import { XMergesItems } from './XMergesItems';
import { XMergesNoCol } from './XMergesNoCol';
import { XMergesRange } from './XMergesRange';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RectRange } from '../tablebase/RectRange';

class XMerges {

  constructor({
    merges = [],
    xTableData,
  }) {
    this.xMergesNoRow = new XMergesNoRow();
    this.xMergesNoCol = new XMergesNoCol();
    this.xMergesIndex = new XMergesIndex(xTableData);
    this.xMergesItems = new XMergesItems();
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  getFirstIncludes(ri, ci) {
    const point = this.xMergesIndex.get(ri, ci);
    return PlainUtils.isNotUnDef(point)
      ? this.xMergesItems.get(point).getView()
      : PlainUtils.Undef;
  }

  getIncludes(view, notify) {
    view.each((ri, ci) => {
      const view = this.getFirstIncludes(ri, ci);
      if (view) {
        notify(view);
      }
    });
  }

  union(view) {
    const { top, right, left, bottom } = view.brink();
    let find = null;
    // 上边扫描
    top.each((ri, ci) => {
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
    // 右边扫描
    right.each((ri, ci) => {
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
    // 左边扫描
    left.each((ri, ci) => {
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
    // 底边扫描
    bottom.each((ri, ci) => {
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
    return view;
  }

  add(view) {
    const sri = this.xMergesNoRow.getNo(view.sri);
    const sci = this.xMergesNoCol.getNo(view.sci);
    const eri = this.xMergesNoRow.getNo(view.eri);
    const eci = this.xMergesNoCol.getNo(view.eci);
    const point = this.xMergesItems.add(new XMergesRange(sri, sci, eri, eci, view));
    view.each((ri, ci) => {
      this.xMergesIndex.set(ri, ci, point);
    });
  }

  delete(view) {
    const point = this.getFirstIncludes(view.sri, view.sci);
    view.each((ri, ci) => {
      this.xMergesIndex.clear(ri, ci);
    });
    this.xMergesItems.clear(point);
  }

  getData() {
    const data = [];
    this.xMergesItems.getItems().forEach((item) => {
      if (item) {
        data.push(item.getView().toString());
      }
    });
    return data;
  }

}

export {
  XMerges,
};
