import { LineIteratorFilter } from '../../LineIteratorFilter';

class TAngleBarRequire {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col) || table.isAngleBarCell(row - 1, col)
      ? LineIteratorFilter.RETURN_TYPE.EXEC
      : LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  TAngleBarRequire,
};
