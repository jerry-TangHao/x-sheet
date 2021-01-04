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
    xIteratorBuilder,
  }) {
    this.xMergesNoRow = new XMergesNoRow();
    this.xMergesNoCol = new XMergesNoCol();
    this.xMergesIndex = new XMergesIndex(xTableData);
    this.xMergesItems = new XMergesItems();
    this.xIteratorBuilder = xIteratorBuilder;
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  getIncludes(view, notify) {
    view.each(this.xIteratorBuilder, (ri, ci) => {
      const view = this.getFirstIncludes(ri, ci);
      if (view) {
        notify(view);
      }
    });
  }

  getFirstIncludes(ri, ci) {
    const point = this.xMergesIndex.get(ri, ci);
    if (PlainUtils.isUnDef(point)) {
      return PlainUtils.Undef;
    }
    const view = this.xMergesItems.get(point);
    if (PlainUtils.isUnDef(view)) {
      return PlainUtils.Undef;
    }
    return this.xMergesItems.get(point).getView();
  }

  add(view) {
    const sri = this.xMergesNoRow.getNo(view.sri);
    const sci = this.xMergesNoCol.getNo(view.sci);
    const eri = this.xMergesNoRow.getNo(view.eri);
    const eci = this.xMergesNoCol.getNo(view.eci);
    const point = this.xMergesItems.add(new XMergesRange(sri, sci, eri, eci, view));
    view.each(this.xIteratorBuilder, (ri, ci) => {
      this.xMergesIndex.set(ri, ci, point);
    });
  }

  union(view) {
    const { top, right, left, bottom } = view.brink();
    let find = null;
    // 上边扫描
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
    // 右边扫描
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
    // 左边扫描
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
    // 底边扫描
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
    return view;
  }

  delete(view) {
    const point = this.xMergesIndex.get(view.sri, view.sci);
    view.each(this.xIteratorBuilder, (ri, ci) => {
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
