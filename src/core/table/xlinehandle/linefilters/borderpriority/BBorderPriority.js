import { XLineIteratorFilter } from '../../XLineIteratorFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class BBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const next = cells.getCell(row + 1, col);
    const cell = cells.getCell(row, col);
    // 对面的单元格不存在
    if (PlainUtils.isUnDef(next)) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    // 对面的单元格不需要显示
    const { top } = next.borderAttr;
    if (top.display) {
      const { bottom } = cell.borderAttr;
      const result = bottom.priority(top);
      return result === 1
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    // 对面单元格不存在则显示
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  BBorderPriority,
};
