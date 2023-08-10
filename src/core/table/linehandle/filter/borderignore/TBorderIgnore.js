import { LineIteratorFilter } from '../../LineIteratorFilter';

class TBorderIgnore {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const cell = table.getMasterMergeCellOrCell(row, col);
    if (cell) {
      const { top } = cell.borderAttr;
      return top.display
        ? LineIteratorFilter.RETURN_TYPE.JUMP
        : LineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  TBorderIgnore,
};
