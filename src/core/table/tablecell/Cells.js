import { Cell } from './Cell';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Listen } from '../../../lib/Listen';
import { Merges } from '../merges/Merges';
import { Snapshot } from '../snapshot/Snapshot';

class Items {

  constructor({ data = [] }) {
    this.data = data;
  }

  getItems(ri) {
    let { data } = this;
    return data[ri];
  }

  clear(rectRange, { ignoreCorner = false } = {}) {
    let { sri, eri } = rectRange;
    let { sci, eci } = rectRange;
    let { data } = this;
    let { snapshot } = this;
    let { length } = data;
    let oldItems = [];
    let effRiLength = eri - sri + 1;
    let effCiLength = eci - sci + 1;
    let action = {
      undo: () => {
        for (let ri = sri; ri <= eri; ri++) {
          if (ri >= length) {
            break;
          }
          let oldRowItem = oldItems[ri];
          let rowItem = data[ri];
          if (rowItem) {
            for (let ci = sci; ci <= eci; ci++) {
              if (ci >= length) {
                break;
              }
              if (ignoreCorner) {
                let firstRi = ri === sri;
                let firstCi = ci === sci;
                if (firstRi && firstCi) {
                  continue;
                }
                rowItem[ci] = oldRowItem[ci];
              } else {
                rowItem[ci] = oldRowItem[ci];
              }
            }
          }
        }
      },
      redo: () => {
        oldItems = new Array(effRiLength);
        for (let ri = sri; ri <= eri; ri++) {
          if (ri >= length) {
            break;
          }
          let rowItem = data[ri];
          if (rowItem) {
            let oldRowItem = new Array(effCiLength);
            let { length } = rowItem;
            for (let ci = sci; ci <= eci; ci++) {
              if (ci >= length) {
                break;
              }
              if (ignoreCorner) {
                let firstRi = ri === sri;
                let firstCi = ci === sci;
                if (firstRi && firstCi) {
                  continue;
                }
                oldRowItem[ci] = rowItem[ci];
                rowItem[ci] = undefined;
              } else {
                oldRowItem[ci] = rowItem[ci];
                rowItem[ci] = undefined;
              }
            }
            oldItems[ri] = oldRowItem;
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  shift() {
    return this.data.shift();
  }

  slice(sri, sci, eri, eci) {
    const rows = this.data.slice(sri, eri + 1);
    return rows.map((row) => {
      if (row) {
        return row.slice(sci, eci + 1);
      }
      return row;
    });
  }

  getData() {
    return this.data;
  }

  getLength() {
    return this.data.length;
  }

  hasItems(ri) {
    return SheetUtils.isDef(this.getItems(ri));
  }

  getItemsOrNew(ri) {
    let { data } = this;
    let items = data[ri];
    if (SheetUtils.isUnDef(items)) {
      items = [];
      data[ri] = items;
    }
    return items;
  }

}

class Cells extends Items {

  static wrapCell(item) {
    if (item instanceof Cell) {
      return item;
    }

    if (SheetUtils.isString(item)) {
      let config = { text: item };
      return new Cell(config);
    } else {
      if (SheetUtils.isDef(item)) {
        let config = item.cell ? item.cell : item;
        return new Cell(config);
      }
    }

    return item;
  }

  constructor({
    snapshot = new Snapshot(),
    data = [],
    merges = new Merges(),
  } = {}) {
    super({ data });
    this.snapshot = snapshot;
    this.merges = merges;
    this.listen = new Listen();
  }

  getCellOrNew(ri, ci) {
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    let cell = this.getCell(ri, ci);
    if (SheetUtils.isUnDef(cell)) {
      let items = this.getItemsOrNew(ri);
      cell = new Cell();
      items[ci] = cell;
    }
    return cell;
  }

  getCell(ri, ci) {
    let { data } = this;
    let items = data[ri];
    if (items) {
      const wrap = Cells.wrapCell(items[ci]);
      items[ci] = wrap;
      return wrap;
    }
    return SheetUtils.Undef;
  }

  each(callback) {
    const { data } = this;
    for (let i = 0, len = data.length; i < len; i++) {
      let items = data[i];
      if (items) {
        for (let j = 0, len = items.length; j < len; j++) {
          let cell = this.getCell(i, j);
          callback(cell);
        }
      }
    }
  }

  getCellOrMergeCell(ri, ci) {
    const { merges } = this;
    const merge = merges.getFirstInclude(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  hasCell(ri, ci) {
    return SheetUtils.isDef(this.getCell(ri, ci));
  }

  setCell(ri, ci, cell) {
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    let { listen, snapshot } = this;
    let oldValue = this.getCell(ri, ci);
    if (oldValue) {
      let action = {
        undo: () => {
          const items = this.getItems(ri);
          items[ci] = oldValue;
          listen.execute('change', {
            ri, ci, oldValue,
          });
        },
        redo: () => {
          const items = this.getItemsOrNew(ri);
          items[ci] = cell;
          listen.execute('change', {
            ri, ci, oldValue,
          });
        },
      };
      snapshot.addAction(action);
      action.redo();
    }
  }

  setCellOrNew(ri, ci, cell) {
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    let { listen, snapshot } = this;
    let hasCell = this.hasCell(ri, ci);
    let hasItems = this.hasItems(ri);
    let oldValue = this.getCell(ri, ci);
    let action = {
      undo: () => {
        if (hasItems) {
          const items = this.getItems(ri);
          if (hasCell) {
            items[ci] = oldValue;
          } else {
            items.splice(ci, 1);
          }
          listen.execute('change', {
            ri, ci, oldValue,
          });
        } else {
          const data = this.getData();
          data.splice(ri, 1);
          listen.execute('change', {
            ri, ci, oldValue,
          });
        }
      },
      redo: () => {
        if (hasItems) {
          const items = this.getItems(ri);
          items[ci] = cell;
          listen.execute('change', {
            ri, ci, oldValue,
          });
        } else {
          const items = this.getItemsOrNew(ri);
          items[ci] = cell;
          listen.execute('change', {
            ri, ci, oldValue,
          });
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  removeRow(ri) {
    let { snapshot } = this;
    let orderValue;
    let action = {
      undo: () => {
        if (orderValue) {
          this.data.splice(ri, 0, orderValue);
        }
      },
      redo: () => {
        orderValue = this.data.splice(ri, 1)[0];
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
        let { length } = orderValue;
        for (let i = 0; i < length; i++) {
          const value = orderValue[i];
          const { ri, item } = value;
          const items = this.data[ri];
          items.splice(ci, 0, item);
        }
      },
      redo: () => {
        let { length } = this.data;
        orderValue = [];
        for (let ri = 0; ri < length; ri++) {
          const items = this.data[ri];
          if (items) {
            const item = items.splice(ci, 1)[0];
            orderValue.push({ ri, item });
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  copyRowStyle(ri) {
    let row = this.data[ri];
    let copy = [];
    if (row) {
      for (let i = 0, len = row.length; i < len; i++) {
        let cell = row[i];
        if (cell) {
          copy[i] = this.getCell(ri, i).cloneStyle();
        }
      }
    }
    return copy;
  }

  insertRowAfter(ri) {
    let { snapshot } = this;
    let master = ri + 1;
    let action = {
      undo: () => {
        this.data.splice(master, 1);
      },
      redo: () => {
        const copy = this.copyRowStyle(master);
        this.data.splice(master, 0, copy);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColAfter(ci) {
    let { snapshot } = this;
    let master = ci + 1;
    let action = {
      undo: () => {
        for (let i = 0, len = this.data.length; i < len; i++) {
          const items = this.data[i];
          if (items) {
            items.splice(master, 1);
          }
        }
      },
      redo: () => {
        for (let i = 0, len = this.data.length; i < len; i++) {
          const items = this.data[i];
          if (items) {
            const cell = this.getCell(i, master);
            const copy = cell ? cell.cloneStyle() : undefined;
            items.splice(master, 0, copy);
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowBefore(ri) {
    let { snapshot } = this;
    let master = ri;
    let action = {
      undo: () => {
        this.data.splice(master, 1);
      },
      redo: () => {
        const copy = this.copyRowStyle(master);
        this.data.splice(master, 0, copy);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColBefore(ci) {
    let { snapshot } = this;
    let master = ci;
    let action = {
      undo: () => {
        for (let i = 0, len = this.data.length; i < len; i++) {
          const items = this.data[i];
          if (items) {
            items.splice(master, 1);
          }
        }
      },
      redo: () => {
        for (let i = 0, len = this.data.length; i < len; i++) {
          const items = this.data[i];
          if (items) {
            const cell = this.getCell(i, master);
            const copy = cell ? cell.cloneStyle() : undefined;
            items.splice(master, 0, copy);
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

}

export {
  Cells,
};
