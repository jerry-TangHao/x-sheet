class XMergesIndex {

  constructor(xTableData) {
    this.xTableData = xTableData;
  }

  set(ri, ci, point) {
    const item = this.xTableData.getOrNew(ri, ci);
    item.setMergeId(point);
  }

  get(ri, ci) {
    const item = this.xTableData.get(ri, ci);
    return item ? item.getMergeId() : undefined;
  }

  clear(ri, ci) {
    const item = this.xTableData.get(ri, ci);
    if (item) {
      item.setMergeId(null);
    }
  }

}

export {
  XMergesIndex,
};
