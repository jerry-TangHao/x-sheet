import { LineIteratorFilter } from '../../LineIteratorFilter';

class RMergeNullEdge {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(row, col);
    if (merge) {
      return merge.eci === col
        ? LineIteratorFilter.RETURN_TYPE.EXEC
        : LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return LineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  RMergeNullEdge,
};
