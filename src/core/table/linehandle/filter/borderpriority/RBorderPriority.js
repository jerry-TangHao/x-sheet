import { LineIteratorFilter } from '../../LineIteratorFilter';

class RBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const main = cells.getCell(row, col);
    const next = cells.getCell(row, col + 1);
    if (main) {
      if (next) {
        const { right } = main.borderAttr;
        const { left } = next.borderAttr;
        if (left.display && right.display) {
          const result = right.priority(left);
          return result === 1 || result === 0
            ? LineIteratorFilter.RETURN_TYPE.EXEC
            : LineIteratorFilter.RETURN_TYPE.JUMP;
        }
      }
      const { right } = main.borderAttr;
      return right.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  RBorderPriority,
};
