/* global document */
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';
import { XTableMousePoint } from '../XTableMousePoint';

class RowFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-row-fixed-bar`);
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const block = h('div', `${cssPrefix}-table-row-fixed-block`);
    this.table = table;
    this.fxSri = fixedView.sri;
    this.fxEri = fixedView.eri;
    this.block = block;
    this.childrenNodes(this.block);
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
    let { table } = this;
    let { tableWidthChange } = this;
    let { tableHeightChange } = this;
    let { xFixedView } = table;
    let { mousePointer } = table;
    let { dropRowFixed } = table;
    let moveOff = true;
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      this.setActive(true);
      mousePointer.lock(RowFixed);
      mousePointer.set(XTableMousePoint.KEYS.grab, RowFixed);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (!moveOff) {
        return;
      }
      this.setActive(false);
      mousePointer.free(RowFixed);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      dropRowFixed.show();
      this.setActive(true);
      // 滚动视图
      const scrollView = table.getScrollView();
      // 获取固定区域
      const fixedView = xFixedView.getFixedView();
      this.fxSri = fixedView.sri;
      this.fxEri = fixedView.eri;
      // 锁定鼠标指针
      mousePointer.lock(RowFixed);
      mousePointer.set(XTableMousePoint.KEYS.grab, RowFixed);
      // 推拽条移动位置
      const { y } = table.eventXy(e, table);
      dropRowFixed.offset({ top: y });
      moveOff = false;
      // 如果存在固定位置 定位到起始处
      if (xFixedView.hasFixedTop()) {
        table.scroll.y = 0;
        table.scroll.ri = this.fxEri + 1;
        table.resize();
      }
      XEvent.mouseMoveUp(document, (e) => {
        // 推拽条移动位置 + 行号
        const { x, y } = table.eventXy(e, table);
        dropRowFixed.offset({ top: y });
        // 更新行号
        const { ri } = table.getRiCiByXy(x, y);
        // 是否越界最大行数
        if (ri < scrollView.eri - 2) {
          this.fxEri = ri;
          this.setSize();
        }
      }, () => {
        this.setActive(false);
        // 释放指针
        mousePointer.free(RowFixed);
        dropRowFixed.hide();
        // 更新固定区域
        table.setFixedRow(this.fxEri);
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
    const { table, block } = this;
    const { fxSri, fxEri } = this;
    const { rows } = table;
    const height = RowFixed.HEIGHT;
    const width = fxEri > -1 ? table.visualWidth() : table.getIndexWidth();
    const outer = fxEri > -1 ? height / 2 : height;
    const top = rows.sectionSumHeight(fxSri, fxEri) + table.getIndexHeight() - outer;
    block.offset({
      width: table.getIndexWidth(), height,
    });
    this.offset({
      height, width, left: 0, top,
    });
  }

  setActive(status) {
    if (status) {
      this.addClass('active');
      this.block.addClass('active');
    } else {
      this.removeClass('active');
      this.block.removeClass('active');
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}
RowFixed.HEIGHT = 6;

export {
  RowFixed,
};
