import { LineIteratorFilter } from '../../LineIteratorFilter';

class LAngleBarRequire {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col) || table.isAngleBarCell(row, col - 1)
      ? LineIteratorFilter.RETURN_TYPE.EXEC
      : LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  LAngleBarRequire,
};
