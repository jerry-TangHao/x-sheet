import { LineIteratorFilter } from '../../LineIteratorFilter';

class RGridIgnore {

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
      const { right } = main.borderAttr;
      if (right.display) {
        return LineIteratorFilter.RETURN_TYPE.JUMP;
      }
    }
    if (next) {
      const { left } = next.borderAttr;
      if (left.display) {
        return LineIteratorFilter.RETURN_TYPE.JUMP;
      }
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  RGridIgnore,
};
