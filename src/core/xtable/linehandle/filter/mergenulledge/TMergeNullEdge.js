import { LineIteratorFilter } from '../../LineIteratorFilter';

class TMergeNullEdge {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstInclude(row, col);
    if (merge) {
      return merge.sri === row
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  TMergeNullEdge,
};
