import { DataProxy } from '../DataProxy';
import { Constant } from '../../../../const/Constant';

class TableMergeDataProxy extends DataProxy {

  constructor(snapshot, option = {
    on: {
      addMerge() {}, deleteMerge() {},
    },
  }) {
    super();
    this.snapshot = snapshot;
    this.option = option;
  }

  $addMerge(merge) {
    this.change = true;
    const { snapshot } = this;
    const { merges } = snapshot;
    merges.getIncludes(merge, merge => this.deleteMerge(merge));
    merges.add(merge, false);
  }

  $deleteMerge(merge) {
    this.change = true;
    const { snapshot } = this;
    const { merges } = snapshot;
    merges.delete(merge);
  }

  deleteMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { deleteMerge } = on;
    this.$deleteMerge(merge);
    deleteMerge(merge);
  }

  addMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { addMerge } = on;
    this.$addMerge(merge);
    addMerge(merge);
  }

  endNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.endNotice();
  }

  goNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.goNotice();
  }

  backNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.backNotice();
  }

}

export { TableMergeDataProxy };
