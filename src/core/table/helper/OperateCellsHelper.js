import { BaseCellsHelper } from './BaseCellsHelper';
import { RectRange } from '../tablebase/RectRange';

class OperateCellsHelper extends BaseCellsHelper {

  constructor(table) {
    super();
    this.table = table;
  }

  getCellOrNewCellByViewRange({
    rectRange = new RectRange(-1, -1, -1, -1),
    callback = () => {},
  }) {
    const { table } = this;
    const { xIteratorBuilder } = table;
    const cells = this.getCells();
    const { sri, eri, sci, eci } = rectRange;
    xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        xIteratorBuilder.getColIterator()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((j) => {
            const cell = cells.getCellOrNew(i, j);
            callback(i, j, cell);
          })
          .execute();
      })
      .execute();
  }

  getXTableAreaView() {
    return this.table.xTableAreaView;
  }

  getRows() {
    return this.table.rows;
  }

  getCells() {
    return this.table.cells;
  }

  getCols() {
    return this.table.cols;
  }

  getMerges() {
    return this.table.merges;
  }

  getStyleTable() {
    return this.table;
  }

  getXIteratorBuilder() {
    return this.table.xIteratorBuilder;
  }

}

export {
  OperateCellsHelper,
};
