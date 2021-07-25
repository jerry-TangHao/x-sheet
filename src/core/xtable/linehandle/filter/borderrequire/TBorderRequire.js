import { LineIteratorFilter } from '../../LineIteratorFilter';

class TBorderRequire {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getCell(row, col);
    if (cell) {
      const { top } = cell.borderAttr;
      return top.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }


}

export {
  TBorderRequire,
};
