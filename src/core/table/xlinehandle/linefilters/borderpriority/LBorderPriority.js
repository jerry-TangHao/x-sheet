import { XLineIteratorFilter } from '../../XLineIteratorFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class LBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const next = cells.getCell(row, col - 1);
    const cell = cells.getCell(row, col);
    // 对面的单元格不存在
    if (PlainUtils.isUnDef(next)) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    // 对面的单元格不需要显示
    const { right } = next.borderAttr;
    if (right.display) {
      const { left } = cell.borderAttr;
      const result = left.priority(right);
      return result === 1 || result === 0
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    // 对面单元格不存在则显示
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  LBorderPriority,
};
