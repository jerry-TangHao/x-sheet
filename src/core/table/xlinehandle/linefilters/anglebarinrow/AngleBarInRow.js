import { PlainUtils } from '../../../../../utils/PlainUtils';
import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class AngleBarInRow {

  constructor(table) {
    this.table = table;
  }

  run({
    row,
  }) {
    const { table } = this;
    return table.hasAngleCell(row)
      ? XLineIteratorFilter.RETURN_TYPE.EXEC
      : XLineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  AngleBarInRow,
};
