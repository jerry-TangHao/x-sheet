import { DataProxy } from '../DataProxy';
import { Constant } from '../../../../const/Constant';

class TableCellDataProxy extends DataProxy {

  constructor(snapshot, option = {
    on: { setCell() {} },
  }) {
    super();
    this.snapshot = snapshot;
    this.option = option;
  }

  $setCell(ri, ci, newCell) {
    this.change = true;
    const { snapshot } = this;
    const { cells } = snapshot;
    cells.setCellOrNew(ri, ci, newCell);
  }

  setCell(ri, ci, newCell) {
    const { option, snapshot } = this;
    const { on } = option;
    const { setCell } = on;
    const { cells } = snapshot;
    const oldCell = cells.getCell(ri, ci);
    this.$setCell(ri, ci, newCell);
    setCell(ri, ci, oldCell, newCell);
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

export {
  TableCellDataProxy,
};
