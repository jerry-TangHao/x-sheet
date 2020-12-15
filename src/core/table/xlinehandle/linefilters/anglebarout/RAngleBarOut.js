import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class RAngleBarOut {

  constructor(table) {
    this.table = table;
    this.maxWidth = 0;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cols } = table;
    const width = cols.getWidth(col);
    this.maxWidth += width;
    if (!table.isAngleBarCell(row, col)) {
      return XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    const { cells } = table;
    const cell = cells.getCell(row, col);
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    if (angle > 0) {
      return XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    const size = table.getCellContentBoundOutWidth(row, col);
    if (size === 0 || size > this.maxWidth) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return XLineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  RAngleBarOut,
};
