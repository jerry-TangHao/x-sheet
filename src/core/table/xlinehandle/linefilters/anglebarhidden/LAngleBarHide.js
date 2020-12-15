import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class LAngleBarHide {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col) || table.isAngleBarCell(row, col - 1)
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  LAngleBarHide,
};
