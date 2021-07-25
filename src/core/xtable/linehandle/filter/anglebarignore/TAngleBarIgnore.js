import { LineIteratorFilter } from '../../LineIteratorFilter';

class TAngleBarIgnore {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col) || table.isAngleBarCell(row - 1, col)
      ? LineIteratorFilter.RETURN_TYPE.JUMP
      : LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  TAngleBarIgnore,
};
