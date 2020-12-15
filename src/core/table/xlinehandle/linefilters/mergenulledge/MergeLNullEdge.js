import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class MergeLNullEdge {

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
      return merge.sci === col
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  MergeLNullEdge,
};
