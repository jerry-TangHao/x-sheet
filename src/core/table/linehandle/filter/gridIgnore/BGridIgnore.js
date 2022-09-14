import { LineIteratorFilter } from '../../LineIteratorFilter';

class BGridIgnore {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const main = table.getMasterMergeCellOrCell(row, col);
    const next = table.getMasterMergeCellOrCell(row + 1, col);
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
