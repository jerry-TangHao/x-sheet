import { TableCellDataProxy } from './proxy/TableCellDataProxy';
import { CellDataRecord } from './record/CellDataRecord';
import { MERGE_RECORD_TYPE, MergeDataRecord } from './record/MergeDataRecord';
import { ChartDataRecord } from './record/ChartDataRecord';
import { TableMergeDataProxy } from './proxy/TableMergeDataProxy';
import { TableColsDataProxy } from './proxy/TableColsDataProxy';
import { ColsDataRecord } from './record/ColsDataRecord';
import { TableRowsDataProxy } from './proxy/TableRowsDataProxy';
import { RowsDataRecord } from './record/RowsDataRecord';

class TableDataSnapshot {

  constructor({
    table, cells, merges, cols, rows,
  }) {
    this.record = false;
    this.backLayerStack = [];
    this.recordLayer = [];
    this.goLayerStack = [];
    this.table = table;
    this.cells = cells;
    this.merges = merges;
    this.cols = cols;
    this.rows = rows;
    this.mergeDataProxy = new TableMergeDataProxy(this, {
      on: {
        deleteMerge: (merge) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new MergeDataRecord({ merge, recordType: MERGE_RECORD_TYPE.DELETE }));
        },
        addMerge: (merge) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new MergeDataRecord({ merge, recordType: MERGE_RECORD_TYPE.ADD }));
        },
      },
    });
    this.cellDataProxy = new TableCellDataProxy(this, {
      on: {
        setCell: (ri, ci, oldCell, newCell) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new CellDataRecord({ ri, ci, oldCell, newCell }));
        },
      },
    });
    this.colsDataProxy = new TableColsDataProxy(this, {
      on: {
        setWidth: (ci, oldWidth, newWidth) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new ColsDataRecord({ ci, oldWidth, newWidth }));
        },
      },
    });
    this.rowsDataProxy = new TableRowsDataProxy(this, {
      on: {
        setHeight: (ri, oldHeight, newHeight) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new RowsDataRecord({ ri, oldHeight, newHeight }));
        },
      },
    });
  }

  back() {
    const { backLayerStack, goLayerStack, table } = this;
    const layer = backLayerStack.pop();
    for (let i = layer.length - 1; i >= 0; i -= 1) {
      const item = layer[i];
      // 单元格元素
      if (item instanceof CellDataRecord) {
        const { ri, ci, oldCell } = item;
        this.cellDataProxy.$setCell(ri, ci, oldCell);
        continue;
      }
      // 合并单元格元素
      if (item instanceof MergeDataRecord) {
        const { recordType } = item;
        switch (recordType) {
          case MERGE_RECORD_TYPE.DELETE: {
            const { merge } = item;
            this.mergeDataProxy.$addMerge(merge);
            break;
          }
          case MERGE_RECORD_TYPE.ADD: {
            const { merge } = item;
            this.mergeDataProxy.$deleteMerge(merge);
            break;
          }
          default: break;
        }
        continue;
      }
      // 图表元素
      if (item instanceof ChartDataRecord) {
        // TODO...
        // ...
      }
      //  列宽元素
      if (item instanceof ColsDataRecord) {
        const { ci, oldWidth } = item;
        this.colsDataProxy.$setWidth(ci, oldWidth);
        continue;
      }
      // 行高元素
      if (item instanceof RowsDataRecord) {
        const { ri, oldHeight } = item;
        this.rowsDataProxy.$setHeight(ri, oldHeight);
      }
    }
    goLayerStack.push(layer);
    this.mergeDataProxy.backNotice();
    this.cellDataProxy.backNotice();
    this.colsDataProxy.backNotice();
    this.rowsDataProxy.backNotice();
    table.render();
  }

  go() {
    const { backLayerStack, goLayerStack, table } = this;
    const layer = goLayerStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      // 单元格元素
      if (item instanceof CellDataRecord) {
        const { ri, ci, newCell } = item;
        this.cellDataProxy.$setCell(ri, ci, newCell);
        continue;
      }
      // 合并单元格元素
      if (item instanceof MergeDataRecord) {
        const { recordType } = item;
        switch (recordType) {
          case MERGE_RECORD_TYPE.DELETE: {
            const { merge } = item;
            this.mergeDataProxy.$deleteMerge(merge);
            break;
          }
          case MERGE_RECORD_TYPE.ADD: {
            const { merge } = item;
            this.mergeDataProxy.$addMerge(merge);
            break;
          }
          default: break;
        }
        continue;
      }
      // 图表元素
      if (item instanceof ChartDataRecord) {
        // TODO...
        // ...
      }
      //  列宽元素
      if (item instanceof ColsDataRecord) {
        const { ci, newWidth } = item;
        this.colsDataProxy.$setWidth(ci, newWidth);
        continue;
      }
      // 行高元素
      if (item instanceof RowsDataRecord) {
        const { ri, newHeight } = item;
        this.rowsDataProxy.$setHeight(ri, newHeight);
      }
    }
    backLayerStack.push(layer);
    this.mergeDataProxy.goNotice();
    this.cellDataProxy.goNotice();
    this.colsDataProxy.goNotice();
    this.rowsDataProxy.goNotice();
    table.render();
  }

  end() {
    const { recordLayer, backLayerStack } = this;
    this.record = false;
    if (recordLayer.length) {
      backLayerStack.push(recordLayer);
    }
    this.recordLayer = [];
    this.mergeDataProxy.endNotice();
    this.cellDataProxy.endNotice();
    this.colsDataProxy.endNotice();
    this.rowsDataProxy.endNotice();
  }

  begin() {
    this.record = true;
    this.goLayerStack = [];
  }

  canBack() {
    const { backLayerStack } = this;
    return backLayerStack.length !== 0;
  }

  canGo() {
    const { goLayerStack } = this;
    return goLayerStack.length !== 0;
  }

}

export { TableDataSnapshot };
