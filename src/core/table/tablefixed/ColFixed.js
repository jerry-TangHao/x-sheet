/* global document */
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';
import { XTableMousePoint } from '../XTableMousePoint';

class ColFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-col-fixed-bar`);
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const block = h('div', `${cssPrefix}-table-col-fixed-block`);
    this.table = table;
    this.fxSci = fixedView.sci;
    this.fxEci = fixedView.eci;
    this.block = block;
    this.childrenNodes(block);
    this.tableWidthChange = () => {
      this.setSize();
    };
    this.tableHeightChange = () => {
      this.setSize();
    };
  }

  onAttach() {
    const { table } = this;
    // 初始化固定条大小
    this.setSize();
    // 绑定处理函数
    this.bind();
    // 注册焦点元素
    table.focusManage.register({ target: this, stop: false });
  }

  bind() {
    const { table } = this;
    let { tableWidthChange } = this;
    let { tableHeightChange } = this;
    let { xFixedView } = table;
    let { mousePointer } = table;
    let { dropColFixed } = table;
    let moveOff = true;
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      this.setActive(true);
      mousePointer.lock(ColFixed);
      mousePointer.set(XTableMousePoint.KEYS.grab, ColFixed);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (!moveOff) {
        return;
      }
      this.setActive(false);
      mousePointer.free(ColFixed);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      dropColFixed.show();
      this.setActive(true);
      // 滚动视图
      const scrollView = table.getScrollView();
      // 获取固定区域
      const fixedView = xFixedView.getFixedView();
      this.fxSci = fixedView.sci;
      this.fxEci = fixedView.eci;
      // 锁定鼠标指针
      mousePointer.lock(ColFixed);
      mousePointer.set(XTableMousePoint.KEYS.grab, ColFixed);
      // 推拽条移动位置
      const { x } = table.eventXy(e, table);
      dropColFixed.offset({ left: x });
      moveOff = false;
      // 如果存在固定位置 定位到起始处
      if (xFixedView.hasFixedLeft()) {
        table.scroll.x = 0;
        table.scroll.ci = this.fxEci + 1;
        table.resize();
      }
      XEvent.mouseMoveUp(document, (e) => {
        // 推拽条移动位置
        const { x, y } = table.eventXy(e, table);
        dropColFixed.offset({ left: x });
        // 更新行号
        const { ci } = table.getRiCiByXy(x, y);
        // 是否越界最大列数
        if (ci < scrollView.eci - 2) {
          this.fxEci = ci;
          this.setSize();
        }
      }, () => {
        this.setActive(false);
        // 释放指针
        mousePointer.free(ColFixed);
        dropColFixed.hide();
        // 更新固定区域
        table.setFixedCol(this.fxEci);
        moveOff = true;
      });
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, tableWidthChange);
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, tableHeightChange);
  }

  unbind() {
    const { table } = this;
    let { tableWidthChange } = this;
    let { tableHeightChange } = this;
    XEvent.unbind(this);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, tableWidthChange);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, tableHeightChange);
  }

  setSize() {
    const {
      table, block,
    } = this;
    const { fxSci, fxEci } = this;
    const { cols } = table;
    const width = table.settings.xFixedBar.width;
    const height = fxEci > -1 ? table.visualHeight() : table.getIndexHeight();
    const offset = fxEci > -1 ? width / 2 : width;
    const left = cols.sectionSumWidth(fxSci, fxEci) + table.getIndexWidth() - offset;
    block.offset({
      height: table.getIndexHeight(), width,
    });
    this.offset({
      width, height, left, top: 0,
    });
  }

  setActive(status) {
    if (status) {
      this.block.addClass('active');
      this.addClass('active');
    } else {
      this.block.removeClass('active');
      this.removeClass('active');
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}
ColFixed.WIDTH = 6;

export {
  ColFixed,
};
