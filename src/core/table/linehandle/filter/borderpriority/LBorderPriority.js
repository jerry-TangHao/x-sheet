import { LineIteratorFilter } from '../../LineIteratorFilter';

class LBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const main = cells.getCell(row, col);
    const last = cells.getCell(row, col - 1);
    if (main) {
      if (last) {
        const { left } = main.borderAttr;
        const { right } = last.borderAttr;
        if (right.display && left.display) {
          const result = left.priority(right);
          return result === 1
            ? LineIteratorFilter.RETURN_TYPE.EXEC
            : LineIteratorFilter.RETURN_TYPE.JUMP;
        }
      }
      const { left } = main.borderAttr;
      return left.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  LBorderPriority,
};
