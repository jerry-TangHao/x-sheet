/* global document */
import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XTableMousePoint } from '../XTableMousePoint';
import { ColFixed } from '../tablefixed/ColFixed';

class XReSizer extends Widget {

  constructor(table, options = { width: 5 }) {
    super(`${cssPrefix}-re-sizer-horizontal`);
    this.table = table;
    this.options = options;
    this.width = options.width;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
    this.tableMove = XEvent.WrapFuncion.mouseClick((event) => {
      let { table } = this;
      let { xFixedView } = table;
      let { cols, index } = table;
      let { left, ci } = this.getEventLeft(event);
      let min = left - cols.getWidth(ci) + cols.min;
      let visualWidth = table.visualWidth();
      let fixedView = xFixedView.getFixedView();
      if (left > visualWidth) {
        left = visualWidth;
      }
      if (left === -1 || min > visualWidth || ci === -1) {
        this.hide();
      } else {
        this.show();
        if (ci === fixedView.eci) {
          this.css('left', `${left - this.width - ColFixed.WIDTH / 2}px`);
        } else {
          this.css('left', `${left - this.width}px`);
        }
        this.hoverEl.css('width', `${this.width}px`);
        this.hoverEl.css('height', `${index.getHeight()}px`);
      }
    });
    this.tableDown = XEvent.WrapFuncion.mouseClick(() => {
      const { table } = this;
      const { widgetFocus } = table;
      const { activate } = widgetFocus;
      const { target } = activate;
      if (target !== table && target !== this) {
        this.hide();
      }
    });
    this.tableLeave = XEvent.WrapFuncion.mouseClick(() => {
      this.hide();
    });
  }

  onAttach() {
    this.bind();
    this.table.widgetFocus.register({ target: this });
  }

  bind() {
    const { table } = this;
    const { tableDown } = this;
    const { tableMove } = this;
    const { tableLeave } = this;
    const { mousePointer } = table;
    const { snapshot } = table;
    const { scale, cols } = table;
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, tableDown);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, tableMove);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, tableLeave);
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      mousePointer.lock(XReSizer);
      mousePointer.set(XTableMousePoint.KEYS.colResize, XReSizer);
      const { left, ci } = this.getEventLeft(event);
      const min = left - cols.getWidth(ci) + cols.min;
      let { x: mx } = table.eventXy(event);
      XEvent.mouseMoveUp(document, (e) => {
        ({ x: mx } = table.eventXy(e));
        mx -= this.width / 2;
        mx = Math.ceil(SheetUtils.minIf(mx, min));
        this.css('left', `${mx}px`);
        this.lineEl.css('height', `${table.visualHeight()}px`);
        this.lineEl.show();
      }, (e) => {
        mousePointer.free(XReSizer);
        this.lineEl.hide();
        this.css('left', `${mx}px`);
        const { y } = table.eventXy(e);
        if (y <= 0) {
          this.hide();
        }
        const newLeft = mx - (left - cols.getWidth(ci)) + this.width;
        snapshot.open();
        cols.setWidth(ci, scale.back(newLeft));
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH,
        });
      });
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(XReSizer);
      mousePointer.set(XTableMousePoint.KEYS.colResize, XReSizer);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(XReSizer);
    });
  }

  unbind() {
    const { table } = this;
    const { tableDown } = this;
    const { tableMove } = this;
    const { tableLeave } = this;
    XEvent.unbind(this);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, tableDown);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, tableMove);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, tableLeave);
  }

  getEventLeft(event) {
    const { table } = this;
    const {
      cols, xFixedView, xFixedMeasure,
    } = table;
    const { index } = table;
    const { x, y } = table.eventXy(event);
    const { ri, ci } = table.getRiCiByXy(x, y);
    const result = {
      ci, left: -1,
    };
    // 无效区域
    if (ri !== -1) {
      return result;
    }
    const fixedWidth = xFixedMeasure.getWidth();
    const indexWidth = index.getWidth();
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    // 冻结区域
    if (xFixedView.hasFixedLeft()) {
      if (ci > fixedView.eci) {
        result.left = indexWidth + fixedWidth + cols.sectionSumWidth(scrollView.sci, ci);
      } else {
        result.left = indexWidth + cols.sectionSumWidth(fixedView.sci, ci);
      }
    } else {
      result.left = indexWidth + cols.sectionSumWidth(scrollView.sci, ci);
    }
    return result;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XReSizer };
