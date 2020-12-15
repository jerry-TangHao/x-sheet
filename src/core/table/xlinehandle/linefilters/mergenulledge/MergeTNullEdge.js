import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class MergeTNullEdge {

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
      return merge.sri === row
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  MergeTNullEdge,
};
