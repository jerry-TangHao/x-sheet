import { LineIteratorFilter } from '../../LineIteratorFilter';

class RBorderRequire {

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
      const { right } = cell.borderAttr;
      return right.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  RBorderRequire,
};
