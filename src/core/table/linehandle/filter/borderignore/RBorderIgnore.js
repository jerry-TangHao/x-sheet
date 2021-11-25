import { LineIteratorFilter } from '../../LineIteratorFilter';

class RBorderIgnore {

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
        ? LineIteratorFilter.RETURN_TYPE.JUMP
        : LineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  RBorderIgnore,
};
