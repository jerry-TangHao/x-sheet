import { XTableDataItem } from './XTableDataItem';
import { Snapshot } from './snapshot/Snapshot';

class XTableDataItems {

  constructor({
    snapshot = new Snapshot(),
    items = [],
  } = {}) {
    this.items = items;
    this.snapshot = snapshot;
  }

  split(sri, eri, sci, eci) {
    const rows = this.items.slice(sri, eri + 1);
    return rows.map((row) => {
      if (row) {
        return row.slice(sci, eci + 1);
      }
      return row;
    });
  }

  set(ri, ci, item) {
    const line = this.items[ri] || [];
    line[ci] = item;
    this.items[ri] = line;
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

  getItems() {
    return this.items;
  }

  get(ri, ci) {
    const line = this.items[ri];
    return line && line[ci]
      ? this.wrap(line, ci)
      : undefined;
  }

  wrap(line, ci) {
    let item = line[ci];
    if (item) {
      item = item instanceof XTableDataItem
        ? item : new XTableDataItem(item);
      line[ci] = item;
      return item;
    }
    return item;
  }

  removeRow(ri) {
    let { snapshot } = this;
    let orderValue;
    let action = {
      undo: () => {
        if (orderValue) {
          this.items.splice(ri, 0, orderValue);
        }
      },
      redo: () => {
        orderValue = this.items.splice(ri, 1);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  removeCol(ci) {
    let { snapshot } = this;
    let orderValue = [];
    let action = {
      undo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            subItems.splice(ci, 0, orderValue[i]);
          }
        }
      },
      redo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            const item = subItems.splice(ci, 1);
            orderValue.push(item);
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowAfter(ri) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        this.items.splice(ri + 1, 1);
      },
      redo: () => {
        const subItems = this.items[ri];
        if (subItems) {
          const newSubItems = [];
          for (let i = 0, len = subItems.length; i < len; i++) {
            const item = subItems[i];
            if (item) {
              const { mergeId } = item;
              newSubItems[i] = { mergeId };
            }
          }
          this.items.splice(ri + 1, 0, newSubItems);
        } else {
          this.items.splice(ri + 1, 0, []);
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColAfter(ci) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            subItems.splice(ci + 1, 1);
          }
        }
      },
      redo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            const item = subItems[ci];
            if (item) {
              const { mergeId } = item;
              subItems.splice(ci + 1, 0, { mergeId });
            } else {
              subItems.splice(ci + 1, 0, {});
            }
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowBefore(ri) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        this.items.splice(ri, 1);
      },
      redo: () => {
        const subItems = this.items[ri];
        if (subItems) {
          const newSubItems = [];
          for (let i = 0, len = subItems.length; i < len; i++) {
            const item = subItems[i];
            if (item) {
              const { mergeId } = item;
              newSubItems[i] = { mergeId };
            }
          }
          this.items.splice(ri, 0, newSubItems);
        } else {
          this.items.splice(ri, 0, []);
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColBefore(ci) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            subItems.splice(ci, 1);
          }
        }
      },
      redo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            const item = subItems[ci];
            if (item) {
              const { mergeId } = item;
              subItems.splice(ci, 0, { mergeId });
            } else {
              subItems.splice(ci, 0, {});
            }
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

}

export {
  XTableDataItems,
};
