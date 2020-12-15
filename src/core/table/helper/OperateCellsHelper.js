import { BaseCellsHelper } from './BaseCellsHelper';
import { RectRange } from '../tablebase/RectRange';
import { ColsIterator } from '../iterator/ColsIterator';
import { RowsIterator } from '../iterator/RowsIterator';

class OperateCellsHelper extends BaseCellsHelper {

  constructor(table) {
    super();
    this.table = table;
  }

  getCellOrNewCellByViewRange({
    rectRange = new RectRange(-1, -1, -1, -1),
    callback = () => {},
  }) {
    const cells = this.getCells();
    const { sri, eri, sci, eci } = rectRange;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        ColsIterator.getInstance()
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

  getStyleTable() {
    return this.table;
  }

  getCols() {
    return this.table.cols;
  }

  getMerges() {
    return this.table.merges;
  }

  getCells() {
    return this.table.cells;
  }

}

export {
  OperateCellsHelper,
};
