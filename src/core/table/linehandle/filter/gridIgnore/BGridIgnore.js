import { LineIteratorFilter } from '../../LineIteratorFilter';

class BGridIgnore {

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
      const { bottom } = main.borderAttr;
      if (bottom.display) {
        return LineIteratorFilter.RETURN_TYPE.JUMP;
      }
    }
    if (next) {
      const { top } = next.borderAttr;
      if (top.display) {
        return LineIteratorFilter.RETURN_TYPE.JUMP;
      }
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  BGridIgnore,
};
