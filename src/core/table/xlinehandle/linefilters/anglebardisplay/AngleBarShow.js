import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class AngleBarShow {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col)
      ? XLineIteratorFilter.RETURN_TYPE.EXEC
      : XLineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  AngleBarShow,
};
