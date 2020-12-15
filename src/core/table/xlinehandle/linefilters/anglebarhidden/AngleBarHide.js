import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class AngleBarHide {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    return table.isAngleBarCell(row, col)
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  AngleBarHide,
};
