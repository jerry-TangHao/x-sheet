import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XSelectItem } from '../../table/screenitems/xselect/XSelectItem';
import { Throttle } from '../../../lib/Throttle';
import { SumTotalTask } from '../../../task/SumTotalTask';
import { TaskProgress } from '../../../module/taskprogress/TaskProgress';
import { TaskManage } from '../../../task/base/TaskManage';

class XWorkFootMenu extends Widget {

  constructor(workBottom) {
    super(`${cssPrefix}-bottom-menu`);
    this.workBottom = workBottom;
    this.taskProgress = new TaskProgress(TaskManage);
    this.number = h('div', `${cssPrefix}-bottom-number`);
    this.sum = h('div', `${cssPrefix}-bottom-sum`);
    this.avg = h('div', `${cssPrefix}-bottom-avg`);
    this.fullScreen = h('div', `${cssPrefix}-bottom-full-screen`);
    this.grid = h('div', `${cssPrefix}-bottom-grid`);
    this.totalTask = new SumTotalTask();
    this.throttle = new Throttle({ time: 800 });
    this.childrenNodes(this.grid);
    this.childrenNodes(this.fullScreen);
    this.childrenNodes(this.sum);
    this.childrenNodes(this.avg);
    this.childrenNodes(this.number);
    this.childrenNodes(this.taskProgress);
  }

  onAttach() {
    this.bind();
  }

  async computer() {
    const { totalTask, workBottom } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    if (selectRange) {
      const { sri, sci, eri, eci } = selectRange;
      const items = cells.slice(sri, sci, eri, eci);
      const { total, avg, number } = await totalTask.execute(selectRange, items);
      this.setSum(SheetUtils.toFixed(total, 2));
      this.setAvg(SheetUtils.toFixed(avg, 2));
      this.setNumber(SheetUtils.toFixed(number, 2));
    } else {
      this.setSum(0);
      this.setAvg(0);
      this.setNumber(0);
    }
  }

  bind() {
    const { workBottom, grid, fullScreen, throttle } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    XEvent.bind(grid, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.settings.table.showGrid = !table.settings.table.showGrid;
      table.render();
    });
    XEvent.bind(body, Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE, () => {
      throttle.action(() => {
        this.computer().then();
      });
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      throttle.action(() => {
        this.computer().then();
      });
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SNAPSHOT_CHANGE, () => {
      throttle.action(() => {
        this.computer().then();
      });
    });
    XEvent.bind(fullScreen, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (SheetUtils.isFull()) {
        SheetUtils.exitFullscreen();
      } else {
        SheetUtils.fullScreen(work.getRootWidget());
      }
    });
  }

  unbind() {
    const { workBottom, grid, fullScreen } = this;
    const { work } = workBottom;
    const { body } = work;
    XEvent.unbind(grid);
    XEvent.unbind(fullScreen);
    XEvent.unbind(body);
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

export { XWorkFootMenu };
