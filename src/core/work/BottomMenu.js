import { Widget } from '../../libs/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../libs/Element';
import { XEvent } from '../../libs/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from '../table/xscreenitems/xselect/XSelectItem';
import { Throttle } from '../../libs/Throttle';
import { Cell } from '../table/tablecell/Cell';

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
    const { xScreen, xIteratorBuilder } = table;
    const merges = table.getTableMerges();
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    if (selectRange) {
      const { sri, sci, eri, eci } = selectRange;
      let number = 0;
      let total = 0;
      // 性能杀手(后续优化)
      xIteratorBuilder.getRowIterator()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((ri) => {
          xIteratorBuilder.getColIterator()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((ci) => {
              const merge = merges.getFirstIncludes(ri, ci);
              if (merge) {
                if (merge.sri !== ri || merge.sci !== ci) {
                  return;
                }
              }
              const cell = cells.getCell(ri, ci);
              if (cell) {
                const { text, contentType } = cell;
                number += 1;
                if (contentType === Cell.CONTENT_TYPE.NUMBER) {
                  total += text;
                }
              }
            })
            .execute();
        })
        .execute();
      const avg = total / number;
      this.setSum(total);
      this.setAvg(avg);
      this.setNumber(number);
    } else {
      this.setSum(0);
      this.setAvg(0);
      this.setNumber(0);
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

  setSum(val) {
    this.sum.text(`求和: ${val}`);
  }

  setAvg(val) {
    this.avg.text(`平均数: ${val}`);
  }

  setNumber(val) {
    this.number.text(`数量: ${val}`);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { BottomMenu };
