import { LineIteratorFilter } from '../../LineIteratorFilter';

class BBorderRequire {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const cell = table.getMasterMergeCellOrCell(row, col);
    if (cell) {
      const { bottom } = cell.borderAttr;
      return bottom.display
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  BBorderRequire,
};
