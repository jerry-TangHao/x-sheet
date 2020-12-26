import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { XEvent } from '../../lib/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from '../table/xscreenitems/xselect/XSelectItem';
import { Throttle } from '../../lib/Throttle';
import { RowsIterator } from '../table/iterator/RowsIterator';
import { ColsIterator } from '../table/iterator/ColsIterator';

class BottomMenu extends Widget {

  constructor(workBottom) {
    super(`${cssPrefix}-bottom-menu`);
    this.workBottom = workBottom;
    this.sum = h('div', `${cssPrefix}-bottom-sum`);
    this.avg = h('div', `${cssPrefix}-bottom-avg`);
    this.number = h('div', `${cssPrefix}-bottom-number`);
    this.fullScreen = h('div', `${cssPrefix}-bottom-full-screen`);
    this.grid = h('div', `${cssPrefix}-bottom-grid`);
    this.throttle = new Throttle({ time: 800 });
    this.children(this.grid);
    this.children(this.fullScreen);
    this.children(this.sum);
    this.children(this.avg);
    this.children(this.number);
  }

  onAttach() {
    this.bind();
  }

  computer() {
    const { workBottom } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const merges = table.getTableMerges();
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    if (selectRange) {
      const { sri, sci, eri, eci } = selectRange;
      let number = 0;
      let total = 0;
      RowsIterator.getInstance()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((ri) => {
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((ci) => {
              const merge = merges.getFirstIncludes(ri, ci);
              const cell = cells.getCell(ri, ci);
              if (merge) {
                if (merge.sri !== ri || merge.sci !== ci) {
                  return;
                }
              }
              if (cell) {
                number += 1;
                const { text } = cell;
                if (PlainUtils.isNumber(text)) {
                  total += parseFloat(text);
                }
              }
            })
            .execute();
        })
        .execute();
      const avg = total / number;
      this.setNumber(number);
      this.setSum(total);
      this.setAvg(avg);
    } else {
      this.setNumber(0);
      this.setSum(0);
      this.setAvg(0);
    }
  }

  unbind() {
    const { workBottom, grid, fullScreen } = this;
    const { work } = workBottom;
    const { body } = work;
    XEvent.unbind(grid);
    XEvent.unbind(fullScreen);
    XEvent.unbind(body);
  }

  bind() {
    const { workBottom, grid, fullScreen, throttle } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    XEvent.bind(body, Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE, () => {
      throttle.action(() => {
        this.computer();
      });
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      throttle.action(() => {
        this.computer();
      });
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, () => {
      throttle.action(() => {
        this.computer();
      });
    });
    XEvent.bind(fullScreen, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (PlainUtils.isFull()) {
        PlainUtils.exitFullscreen();
      } else {
        PlainUtils.fullScreen(work.root);
      }
    });
    XEvent.bind(grid, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.settings.table.showGrid = !table.settings.table.showGrid;
      table.render();
    });
  }

  setNumber(val) {
    this.number.text(`数量: ${val}`);
  }

  setSum(val) {
    this.sum.text(`求和: ${val}`);
  }

  setAvg(val) {
    this.avg.text(`平均数: ${val}`);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { BottomMenu };
