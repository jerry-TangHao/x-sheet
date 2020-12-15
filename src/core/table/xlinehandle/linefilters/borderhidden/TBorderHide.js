import { PlainUtils } from '../../../../../utils/PlainUtils';
import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class TBorderHide {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getCell(row, col);
    if (PlainUtils.isUnDef(cell)) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    const { top } = cell.borderAttr;
    return top.display
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  TBorderHide,
};
