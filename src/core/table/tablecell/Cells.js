import { Cell } from './Cell';
import { PlainUtils } from '../../../utils/PlainUtils';

/**
 * Cells
 * @author jerry
 */
class Cells {

  constructor({
    onChange = () => {},
    table,
    xTableData,
    xIteratorBuilder,
  }) {
    this.table = table;
    this.xTableData = xTableData;
    this.onChange = onChange;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  emptyRectRange(rectRange) {
    let empty = true;
    rectRange.each(this.xIteratorBuilder, (ri, ci) => {
      const cell = this.getCell(ri, ci);
      if (PlainUtils.isNotEmptyObject(cell) && !PlainUtils.isBlank(cell.text)) {
        empty = false;
        return false;
      }
      return true;
    });
    return empty;
  }

  setCell(ri, ci, cell) {
    const item = this.xTableData.get(ri, ci);
    if (item) {
      item.setCell(cell);
      this.onChange(ri, ci);
    }
  }

  setCellOrNew(ri, ci, cell) {
    const item = this.xTableData.getOrNew(ri, ci);
    item.setCell(cell);
    this.onChange(ri, ci);
  }

  getCellOrNew(ri, ci) {
    const item = this.xTableData.getOrNew(ri, ci);
    const find = item.getCell();
    if (find) {
      return find;
    }
    const cell = new Cell({ text: PlainUtils.EMPTY });
    item.setCell(cell);
    return cell;
  }

  getCellOrMergeCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  getCell(ri, ci) {
    const item = this.xTableData.get(ri, ci);
    if (item) {
      return item.getCell();
    }
    return null;
  }

  getData() {
    this.xTableData.wrapAll();
    return this.xTableData.getItems().map(rows => rows.map((item) => {
      if (item) {
        return item.getCell();
      }
      return null;
    }));
  }

}

export {
  Cells,
};
