import { LineIteratorFilter } from '../../LineIteratorFilter';

class BBorderPriority {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { cells } = table;
    const main = cells.getCell(row, col);
    const next = cells.getCell(row + 1, col);
    if (main) {
      if (next) {
        const { bottom } = main.borderAttr;
        const { top } = next.borderAttr;
        if (top.display && bottom.display) {
          const result = bottom.priority(top);
          return result === 1 || result === 0
            ? LineIteratorFilter.RETURN_TYPE.EXEC
            : LineIteratorFilter.RETURN_TYPE.JUMP;
        }
      }
      const { bottom } = main.borderAttr;
      return bottom.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  BBorderPriority,
};
