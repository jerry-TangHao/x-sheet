import { XLineIteratorFilter } from '../../XLineIteratorFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class TBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const next = cells.getCell(row - 1, col);
    const cell = cells.getCell(row, col);
    // 对面的单元格不存在
    if (PlainUtils.isUnDef(next)) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    // 对面的单元格不需要显示
    const { bottom } = next.borderAttr;
    if (bottom.display) {
      const { top } = cell.borderAttr;
      const result = top.priority(bottom);
      return result === 1 || result === 0
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    // 对面单元格不存在则显示
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  TBorderPriority,
};
