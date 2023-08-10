import { LineIteratorFilter } from '../../LineIteratorFilter';

class LBorderIgnore {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const cell = table.getMasterMergeCellOrCell(row, col);
    if (cell) {
      const { left } = cell.borderAttr;
      return left.display
        ? LineIteratorFilter.RETURN_TYPE.JUMP
        : LineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  LBorderIgnore,
};
