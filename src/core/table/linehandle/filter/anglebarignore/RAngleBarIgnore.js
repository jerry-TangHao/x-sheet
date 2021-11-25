import { LineIteratorFilter } from '../../LineIteratorFilter';

class RAngleBarIgnore {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col) || table.isAngleBarCell(row, col + 1)
      ? LineIteratorFilter.RETURN_TYPE.JUMP
      : LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  RAngleBarIgnore,
};
