import { LineIteratorFilter } from '../../LineIteratorFilter';

class AngleBarExist {

  constructor(table) {
    this.table = table;
  }

  run({
    row,
  }) {
    const { table } = this;
    return table.hasAngleCell(row) || table.hasAngleCell(row + 1) || table.hasAngleCell(row - 1)
      ? LineIteratorFilter.RETURN_TYPE.EXEC
      : LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  AngleBarExist,
};
