class XTableDataItem {

  constructor(cell = null, mergeId = null) {
    this.cell = cell;
    this.mergeId = mergeId;
  }

  setCell(cell) {
    this.cell = cell;
  }

  setMergeId(mergeId) {
    this.mergeId = mergeId;
  }

  getCell() {
    return this.cell;
  }

  getMergeId() {
    return this.mergeId;
  }

}

export {
  XTableDataItem,
};
