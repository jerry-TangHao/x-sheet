import { XTableDataItem } from './XTableDataItem';
import { PlainUtils } from '../../utils/PlainUtils';
import { Cell } from './tablecell/Cell';

class XTableDataItems {

  constructor(items = []) {
    this.items = items;
  }

  wrap(line, ci) {
    const ele = line[ci];
    if (ele instanceof XTableDataItem) {
      return ele;
    }
    const item = new XTableDataItem();
    if (PlainUtils.isString(ele)) {
      item.setCell(new Cell({ text: ele }));
    } else {
      item.setCell(new Cell(ele));
    }
    line[ci] = item;
    return item;
  }

  set(ri, ci, item) {
    const line = this.items[ri] || [];
    line[ci] = item;
    this.items[ri] = line;
  }

  getItems() {
    return this.items;
  }

  get(ri, ci) {
    const line = this.items[ri];
    return line && line[ci]
      ? this.wrap(line, ci)
      : undefined;
  }

  setOrNew(ri, ci, item) {
    const line = this.items[ri];
    if (line) {
      line[ci] = item;
    }
  }

  getOrNew(ri, ci) {
    const find = this.get(ri, ci);
    if (find) {
      return find;
    }
    const item = new XTableDataItem();
    this.set(ri, ci, item);
    return item;
  }

}

export {
  XTableDataItems,
};
