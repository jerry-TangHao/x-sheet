import { LineIteratorFilter } from '../../LineIteratorFilter';

class TBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const main = cells.getCell(row, col);
    const last = cells.getCell(row - 1, col);
    if (main) {
      if (last) {
        const { top } = main.borderAttr;
        const { bottom } = last.borderAttr;
        if (top.display && bottom.display) {
          const result = top.priority(bottom);
          return result === 1
            ? LineIteratorFilter.RETURN_TYPE.EXEC
            : LineIteratorFilter.RETURN_TYPE.JUMP;
        }
      }
      const { top } = main.borderAttr;
      return top.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  TBorderPriority,
};
