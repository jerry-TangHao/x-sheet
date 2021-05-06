/* global document */
import { Widget } from '../../../libs/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { h } from '../../../libs/Element';
import { XEvent } from '../../../libs/XEvent';
import { PlainUtils } from '../../../utils/PlainUtils';
import { XTableMousePointer } from '../XTableMousePointer';
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
  }

  onAttach() {
    this.bind();
    this.table.focus.register({ target: this });
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  bind() {
    const { table } = this;
    const {
      scale, rows, mousePointer, focus, xFixedView,
    } = table;
    const { tableDataSnapshot } = table;
    const { rowsDataProxy } = tableDataSnapshot;
    const { index } = table;
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      mousePointer.lock(YReSizer);
      mousePointer.set(XTableMousePointer.KEYS.rowResize, YReSizer);
      const { top, ri } = this.getEventTop(e);
      const min = top - rows.getHeight(ri) + rows.min;
      let { y: my } = table.eventXy(e);
      XEvent.mouseMoveUp(document, (e) => {
        ({ y: my } = table.eventXy(e));
        my -= this.height / 2;
        my = Math.ceil(PlainUtils.minIf(my, min));
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
        tableDataSnapshot.begin();
        rowsDataProxy.setHeight(ri, scale.back(newTop));
        tableDataSnapshot.end();
        table.resize();
      });
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(YReSizer);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(YReSizer);
      mousePointer.set(XTableMousePointer.KEYS.rowResize, YReSizer);
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      // eslint-disable-next-line prefer-const
      let { top, ri } = this.getEventTop(e);
      const min = top - rows.getHeight(ri) + rows.min;
      const visualHeight = table.visualHeight();
      const fixedView = xFixedView.getFixedView();
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
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      this.hide();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { activate } = focus;
      const { target } = activate;
      if (target !== table && target !== this) {
        this.hide();
      }
    });
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
