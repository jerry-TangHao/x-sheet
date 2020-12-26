const MERGE_RECORD_TYPE = {
  ADD: Symbol('添加一个合并单元格'),
  DELETE: Symbol('删除一个合并单元格'),
};

class MergeDataRecord {
  constructor({ merge, recordType }) {
    this.merge = merge;
    this.recordType = recordType;
  }
}

export {
  MergeDataRecord,
  MERGE_RECORD_TYPE,
};
