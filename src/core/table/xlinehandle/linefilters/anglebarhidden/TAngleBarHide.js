import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class TAngleBarHide {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col) || table.isAngleBarCell(row - 1, col)
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  TAngleBarHide,
};
