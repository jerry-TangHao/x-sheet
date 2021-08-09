/* global document */
import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XTableMousePoint } from '../XTableMousePoint';
import { RowFixed } from '../tablefixed/RowFixed';

class YReSizer extends Widget {

  constructor(table, options = { height: 5 }) {
    super(`${cssPrefix}-re-sizer-vertical`);
    this.table = table;
    this.options = options;
    this.height = options.height;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
    this.tableMove = XEvent.WrapFuncion.mouseClick((event) => {
      const { table } = this;
      const { rows } = table;
      const { xFixedView } = table;
      const { index } = table;
      let { top, ri } = this.getEventTop(event);
      let min = top - rows.getHeight(ri) + rows.min;
      let visualHeight = table.visualHeight();
      let fixedView = xFixedView.getFixedView();
      if (top > visualHeight) {
        top = visualHeight;
      }
      if (top === -1 || min > visualHeight || ri === -1) {
        this.hide();
      } else {
        this.show();
        if (ri === fixedView.eri) {
          this.css('top', `${top - this.height - RowFixed.HEIGHT / 2}px`);
        } else {
          this.css('top', `${top - this.height}px`);
        }
        this.hoverEl.css('width', `${index.getWidth()}px`);
        this.hoverEl.css('height', `${this.height}px`);
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
    const { scale, rows } = table;
    const { mousePointer } = table;
    const { snapshot } = table;
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, tableDown);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, tableMove);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, tableLeave);
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      mousePointer.lock(YReSizer);
      mousePointer.set(XTableMousePoint.KEYS.rowResize, YReSizer);
      const { top, ri } = this.getEventTop(event);
      const min = top - rows.getHeight(ri) + rows.min;
      let { y: my } = table.eventXy(event);
      XEvent.mouseMoveUp(document, (e) => {
        ({ y: my } = table.eventXy(e));
        my -= this.height / 2;
        my = Math.ceil(SheetUtils.minIf(my, min));
        this.css('top', `${my}px`);
        this.lineEl.css('width', `${table.visualWidth()}px`);
        this.lineEl.show();
      }, (e) => {
        mousePointer.free(YReSizer);
        this.lineEl.hide();
        this.css('top', `${my}px`);
        const { x } = table.eventXy(e);
        if (x <= 0) {
          this.hide();
        }
        const newTop = my - (top - rows.getHeight(ri)) + this.height;
        snapshot.open();
        rows.setHeight(ri, scale.back(newTop));
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT,
        });
      });
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(YReSizer);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(YReSizer);
      mousePointer.set(XTableMousePoint.KEYS.rowResize, YReSizer);
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

  getEventTop(event) {
    const { table } = this;
    const {
      rows, xFixedView, xFixedMeasure,
    } = table;
    const { index } = table;
    const { x, y } = table.eventXy(event);
    const { ri, ci } = table.getRiCiByXy(x, y);
    const result = {
      ri, top: -1,
    };
    // 无效区域
    if (ci !== -1) {
      return result;
    }
    const fixedHeight = xFixedMeasure.getHeight();
    const indexHeight = index.getHeight();
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    // 冻结区域
    if (xFixedView.hasFixedTop()) {
      if (ri > fixedView.eri) {
        result.top = indexHeight + fixedHeight + rows.sectionSumHeight(scrollView.sri, ri);
      } else {
        result.top = indexHeight + rows.sectionSumHeight(fixedView.sri, ri);
      }
    } else {
      result.top = indexHeight + rows.sectionSumHeight(scrollView.sri, ri);
    }
    return result;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { YReSizer };
