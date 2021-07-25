import { LineIteratorFilter } from '../../LineIteratorFilter';

class BBorderIgnore {

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
      const { bottom } = cell.borderAttr;
      return bottom.display
        ? LineIteratorFilter.RETURN_TYPE.JUMP
        : LineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  BBorderIgnore,
};
