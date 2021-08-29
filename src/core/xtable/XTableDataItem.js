import { SheetUtils } from '../../utils/SheetUtils';
import { Cell } from './tablecell/Cell';

class XTableDataItem {

  constructor(options) {
    if (options) {
      const { cell } = options;
      this.cell = SheetUtils.safeValue(cell, options);
    } else {
      this.cell = undefined;
    }
  }

  getCell() {
    const { cell } = this;
    if (cell instanceof Cell) {
      return cell;
    }
    if (SheetUtils.isString(cell)) {
      this.cell = new Cell({
        text: cell,
      });
    } else {
      this.cell = new Cell(cell);
    }
    return this.cell;
  }

  setCell(cell) {
    this.cell = cell;
    return this;
  }

  clone() {
    return new XTableDataItem({
      mergeId: this.mergeId,
      cell: this.cell,
    });
  }

}

export {
  XTableDataItem,
};
