/* global document */
import { Widget } from '../../../libs/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { h } from '../../../libs/Element';
import { XEvent } from '../../../libs/XEvent';
import { PlainUtils } from '../../../utils/PlainUtils';
import { XTableMousePointer } from '../XTableMousePointer';
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
  }

  onAttach() {
    this.bind();
    this.table.focus.register({ target: this });
  }

  bind() {
    const { table } = this;
    const {
      scale, cols, mousePointer, focus, xFixedView,
    } = table;
    const { snapshot } = table;
    const { index } = table;
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      mousePointer.lock(XReSizer);
      mousePointer.set(XTableMousePointer.KEYS.colResize, XReSizer);
      const { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + cols.min;
      let { x: mx } = table.eventXy(e);
      XEvent.mouseMoveUp(document, (e) => {
        ({ x: mx } = table.eventXy(e));
        mx -= this.width / 2;
        mx = Math.ceil(PlainUtils.minIf(mx, min));
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
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(XReSizer);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(XReSizer);
      mousePointer.set(XTableMousePointer.KEYS.colResize, XReSizer);
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { activate } = focus;
      const { target } = activate;
      if (target !== table && target !== this) {
        this.hide();
      }
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      // eslint-disable-next-line prefer-const
      let { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + cols.min;
      const visualWidth = table.visualWidth();
      const fixedView = xFixedView.getFixedView();
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
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      this.hide();
    });
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
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
