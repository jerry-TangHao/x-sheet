class RowHeightGroupIndex {

  constructor({
    group = 1000,
    xFixedView,
    rows,
    xIteratorBuilder,
  }) {
    this.groupIndex = [];
    this.xFixedView = xFixedView;
    this.rows = rows;
    this.group = group;
    this.xIteratorBuilder = xIteratorBuilder;
    this.clear();
  }

  min() {
    let { xFixedView } = this;
    let fixedView = xFixedView.getFixedView();
    let min = 0;
    if (xFixedView.hasFixedTop()) {
      min = fixedView.eri + 1;
    }
    return min;
  }

  limit(ri, top, max) {
    let { groupIndex } = this;
    let { group, rows } = this;
    let find = groupIndex[0];
    let end = rows.len - 1;
    top += rows.getHeight(ri);
    ri += 1;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(ri)
      .setEnd(end)
      .setSkip((ri) => {
        if (ri % group === 0) {
          groupIndex.push({ ri, top });
        }
      })
      .setLoop((ri) => {
        if (ri % group === 0) {
          groupIndex.push({
            ri, top,
          });
          if (top > max) {
            let { length } = groupIndex;
            find = groupIndex[length - 2];
            return false;
          }
        }
        top += rows.getHeight(ri);
        return true;
      })
      .execute();
    return find;
  }

  clear() {
    let min = this.min();
    this.groupIndex = [{ ri: min, top: 0 }];
  }

  get(scroll) {
    let { groupIndex, group, rows } = this;
    let { length } = groupIndex;
    if (rows.len <= group) {
      return groupIndex[0];
    }
    if (scroll === 0) {
      return groupIndex[0];
    }
    for (let i = 0; i < length; i++) {
      let item = groupIndex[i];
      if (item.top > scroll) {
        return groupIndex[i - 1];
      }
    }
    let last = groupIndex[length - 1];
    let { ri, top } = last;
    return this.limit(ri, top, scroll);
  }

}

export {
  RowHeightGroupIndex,
};
