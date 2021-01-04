
class RowHeightIndex {

  constructor({
    group = 1000,
    rows,
    xFixedView,
    xIteratorBuilder,
  }) {
    this.group = group;
    this.rows = rows;
    this.index = [];
    this.xFixedView = xFixedView;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  computeIndex() {
    const { rows, group, xFixedView } = this;
    const { len } = rows;
    const fixedView = xFixedView.getFixedView();
    const min = fixedView.eri + 1;
    const index = [];
    let top = 0;
    index.push({
      ri: min, top: 0,
    });
    this.xIteratorBuilder.getRowIterator()
      .setBegin(min + 1)
      .setEnd(len - 1)
      .setLoop((ri) => {
        if (ri % group === 0) {
          index.push({
            ri, top,
          });
        }
        top += rows.getHeight(ri);
      })
      .setSkip((ri) => {
        if (ri % group === 0) {
          index.push({
            ri, top,
          });
        }
      })
      .execute();
    this.index = index;
  }

  getTop(height) {
    const { index } = this;
    const { length } = index;
    for (let i = 0; i < length; i++) {
      const { top } = index[i];
      if (height <= top) {
        return i === 0 ? index[i] : index[i - 1];
      }
    }
    return index[length - 1];
  }

}

export {
  RowHeightIndex,
};
