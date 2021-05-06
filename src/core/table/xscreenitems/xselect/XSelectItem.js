/* global document */
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import { XEvent } from '../../../../libs/XEvent';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { Widget } from '../../../../libs/Widget';
import { XTableMousePointer } from '../../XTableMousePointer';
import { RANGE_OVER_GO } from '../../xscreen/item/viewborder/XScreenStyleBorderItem';

const SELECT_LOCAL = {
  LT: Symbol('LT'),
  L: Symbol('L'),
  T: Symbol('T'),
  BR: Symbol('BR'),
};

/**
 * XSelectItem
 */
class XSelectItem extends XScreenCssBorderItem {

  /**
   * XSelectItem
   * @param table
   */
  constructor(table) {
    super({ table });
    this.selectLocal = SELECT_LOCAL.BR;
    this.display = false;
    this.border = {};
    // 当前显示的操作按钮
    this.activeCorner = null;
    // 用户选中的区域
    this.selectRange = null;
    this.downRange = null;
    this.moveRange = null;
    // 上下左右四个区域阴影
    this.ltElem = new Widget(`${cssPrefix}-x-select-area`);
    this.brElem = new Widget(`${cssPrefix}-x-select-area`);
    this.lElem = new Widget(`${cssPrefix}-x-select-area`);
    this.tElem = new Widget(`${cssPrefix}-x-select-area`);
    // 上下左右高亮区域
    this.ltHighLight = new Widget(`${cssPrefix}-x-select-high-light`);
    this.lHighLight = new Widget(`${cssPrefix}-x-select-high-light`);
    this.tHighLight = new Widget(`${cssPrefix}-x-select-high-light`);
    this.brHighLight = new Widget(`${cssPrefix}-x-select-high-light`);
    // 上下左右4个操作按钮
    this.ltCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.lCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.tCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.brCorner = new Widget(`${cssPrefix}-x-select-corner`);
    // 添加区域阴影
    this.blt.before(this.ltElem);
    this.bl.before(this.lElem);
    this.bt.before(this.tElem);
    this.bbr.before(this.brElem);
    // 添加上下左右高亮区域
    this.blt.before(this.ltHighLight);
    this.bl.before(this.lHighLight);
    this.bt.before(this.tHighLight);
    this.bbr.before(this.brHighLight);
    // 添加操作按钮
    this.blt.after(this.ltCorner);
    this.bl.after(this.lCorner);
    this.bt.after(this.tCorner);
    this.bbr.after(this.brCorner);
    // 设置边框类型
    this.setBorderType('solid');
  }

  /**
   * 鼠标移动的区域
   * @param x
   * @param y
   */
  moveHandle(x, y) {
    const { table } = this;
    const {
      rows, cols,
    } = table;
    const { downRange, selectLocal } = this;
    const merges = table.getTableMerges();
    const viewRange = table.getScrollView();
    let { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1) {
      ri = viewRange.sri;
    }
    if (ci === -1) {
      ci = viewRange.sci;
    }
    if (selectLocal === SELECT_LOCAL.LT) {
      const rect = downRange.union(new RectRange(0, 0, rows.len - 1, cols.len - 1));
      this.moveRange = downRange.union(rect);
      this.selectRange = this.moveRange;
      this.selectLocal = SELECT_LOCAL.LT;
      return;
    }
    if (selectLocal === SELECT_LOCAL.L) {
      const rect = downRange.union(new RectRange(ri, 0, ri, 0));
      this.moveRange = downRange.union(rect);
      this.selectRange = this.moveRange;
      this.selectLocal = SELECT_LOCAL.L;
      return;
    }
    if (selectLocal === SELECT_LOCAL.T) {
      const rect = downRange.union(new RectRange(0, ci, 0, ci));
      this.moveRange = downRange.union(rect);
      this.selectRange = this.moveRange;
      this.selectLocal = SELECT_LOCAL.T;
      return;
    }
    const rect = downRange.union(new RectRange(ri, ci, ri, ci));
    this.moveRange = merges.union(rect);
    this.selectRange = this.moveRange;
    this.selectLocal = SELECT_LOCAL.BR;
  }

  /**
   * 更新用户选中
   * 的区域
   * @param range
   */
  setRange(range) {
    this.selectRange = range;
    this.selectLocal = SELECT_LOCAL.BR;
    this.offsetHandle();
    this.borderHandle();
    this.cornerHandle();
  }

  /**
   * 鼠标按下的区域
   * @param x
   * @param y
   */
  downHandle(x, y) {
    const { table } = this;
    const { rows, cols } = table;
    const merges = table.getTableMerges();
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1 && ci === -1) {
      this.downRange = new RectRange(0, 0, rows.len - 1, cols.len - 1);
      this.selectRange = this.downRange;
      this.selectLocal = SELECT_LOCAL.LT;
      return;
    }
    if (ri === -1) {
      this.downRange = new RectRange(0, ci, rows.len - 1, ci);
      this.selectRange = this.downRange;
      this.selectLocal = SELECT_LOCAL.T;
      return;
    }
    if (ci === -1) {
      this.downRange = new RectRange(ri, 0, ri, cols.len - 1);
      this.selectRange = this.downRange;
      this.selectLocal = SELECT_LOCAL.L;
      return;
    }
    this.downRange = merges.getFirstIncludes(ri, ci)
      || new RectRange(ri, ci, ri, ci);
    this.selectRange = this.downRange;
    this.selectLocal = SELECT_LOCAL.BR;
  }

  /**
   * 节点已添加
   * 到屏幕上
   */
  onAdd() {
    const { table } = this;
    this.bind();
    this.hide();
    table.focus.register({ target: this.ltCorner });
    table.focus.register({ target: this.lCorner });
    table.focus.register({ target: this.tCorner });
    table.focus.register({ target: this.brCorner });
  }

  /**
   * 解绑事件
   */
  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  /**
   * 绑定事件
   */
  bind() {
    const { table } = this;
    const {
      mousePointer, focus,
    } = table;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) {
        return;
      }
      const { activate } = focus;
      const { target } = activate;
      if (target !== table) {
        return;
      }
      const { x, y } = table.eventXy(e1);
      this.downHandle(x, y);
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
      const { selectLocal } = this;
      switch (selectLocal) {
        case SELECT_LOCAL.L:
          mousePointer.lock(XSelectItem);
          mousePointer.set(XTableMousePointer.KEYS.eResize, XSelectItem);
          break;
        case SELECT_LOCAL.T:
          mousePointer.lock(XSelectItem);
          mousePointer.set(XTableMousePointer.KEYS.sResize, XSelectItem);
          break;
      }
      table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN);
      table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      XEvent.mouseMoveUp(document, (e2) => {
        const { x, y } = table.eventXy(e2);
        this.moveHandle(x, y);
        this.offsetHandle();
        this.borderHandle();
        this.cornerHandle();
        table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      }, () => {
        switch (selectLocal) {
          case SELECT_LOCAL.L:
          case SELECT_LOCAL.T:
            mousePointer.free(XSelectItem);
            break;
        }
        table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_OVER);
      });
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
  }

  /**
   * 处理边框
   * 是否显示
   */
  borderHandle() {
    const { selectRange, display } = this;
    if (selectRange && display) {
      this.hideBorder();
      this.border = this.showBorder(selectRange);
    }
  }

  /**
   * 处理选中区域
   * 的位置和大小
   */
  offsetHandle() {
    const { selectRange } = this;
    if (selectRange && this.setDisplay(selectRange)) {
      this.display = true;
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    } else {
      this.display = false;
    }
  }

  /**
   * 处理操作按钮
   * 是否显示
   */
  cornerHandle() {
    const {
      table, selectRange, selectLocal, display, border,
    } = this;
    const {
      xFixedView,
    } = table;
    if (selectRange && display) {
      const overGo = this.getOverGo(selectRange);
      this.ltCorner.hide();
      this.tCorner.hide();
      this.lCorner.hide();
      this.brCorner.hide();
      switch (selectLocal) {
        case SELECT_LOCAL.LT:
        case SELECT_LOCAL.L:
        case SELECT_LOCAL.BR:
          if (border.bottom === false) {
            return;
          }
      }
      this.brCorner.removeClass('br-pos');
      this.lCorner.removeClass('br-pos');
      this.tCorner.removeClass('br-pos');
      this.ltCorner.removeClass('br-pos');
      this.brCorner.removeClass('tr-pos');
      this.lCorner.removeClass('tr-pos');
      this.tCorner.removeClass('tr-pos');
      this.ltCorner.removeClass('tr-pos');
      this.brCorner.removeClass('bl-pos');
      this.lCorner.removeClass('bl-pos');
      this.tCorner.removeClass('bl-pos');
      this.ltCorner.removeClass('bl-pos');
      switch (selectLocal) {
        case SELECT_LOCAL.L:
          this.brCorner.addClass('bl-pos');
          this.lCorner.addClass('bl-pos');
          this.tCorner.addClass('bl-pos');
          this.ltCorner.addClass('bl-pos');
          break;
        case SELECT_LOCAL.T:
          this.brCorner.addClass('tr-pos');
          this.lCorner.addClass('tr-pos');
          this.tCorner.addClass('tr-pos');
          this.ltCorner.addClass('tr-pos');
          break;
        case SELECT_LOCAL.LT:
        case SELECT_LOCAL.BR:
          this.brCorner.addClass('br-pos');
          this.lCorner.addClass('br-pos');
          this.tCorner.addClass('br-pos');
          this.ltCorner.addClass('br-pos');
          break;
      }
      if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
        switch (overGo) {
          /**
           * 单个区域
           */
          case RANGE_OVER_GO.LT: {
            this.ltCorner.show();
            this.tCorner.hide();
            this.brCorner.hide();
            this.lCorner.hide();
            this.activeCorner = this.ltCorner;
            break;
          }
          case RANGE_OVER_GO.T: {
            this.tCorner.show();
            this.ltCorner.hide();
            this.lCorner.hide();
            this.brCorner.hide();
            this.activeCorner = this.tCorner;
            break;
          }
          case RANGE_OVER_GO.BR: {
            this.brCorner.show();
            this.lCorner.hide();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.activeCorner = this.brCorner;
            break;
          }
          case RANGE_OVER_GO.L: {
            this.lCorner.show();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.brCorner.hide();
            this.activeCorner = this.lCorner;
            break;
          }
          /**
           * 双区域
           */
          case RANGE_OVER_GO.LTT: {
            if (selectLocal === SELECT_LOCAL.L) {
              this.ltCorner.show();
              this.tCorner.hide();
              this.lCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.ltCorner;
            } else {
              this.tCorner.show();
              this.ltCorner.hide();
              this.lCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.tCorner;
            }
            break;
          }
          case RANGE_OVER_GO.BRT: {
            if (selectLocal === SELECT_LOCAL.T) {
              this.tCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.tCorner;
            } else {
              this.brCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.brCorner;
            }
            break;
          }
          case RANGE_OVER_GO.BRL: {
            if (selectLocal === SELECT_LOCAL.L) {
              this.lCorner.show();
              this.brCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.lCorner;
            } else {
              this.brCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.brCorner;
            }
            break;
          }
          case RANGE_OVER_GO.LTL: {
            if (selectLocal === SELECT_LOCAL.T) {
              this.ltCorner.show();
              this.lCorner.hide();
              this.tCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.ltCorner;
            } else {
              this.lCorner.show();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.lCorner;
            }
            break;
          }
          /**
           * 所有区域
           */
          case RANGE_OVER_GO.ALL: {
            if (selectLocal === SELECT_LOCAL.T) {
              this.tCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.tCorner;
            } else if (selectLocal === SELECT_LOCAL.L) {
              this.lCorner.show();
              this.brCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.lCorner;
            } else {
              this.brCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.brCorner;
            }
            break;
          }
        }
      } else if (xFixedView.hasFixedTop()) {
        switch (overGo) {
          /**
           * 单个区域
           */
          case RANGE_OVER_GO.LT: {
            this.ltCorner.show();
            this.tCorner.hide();
            this.brCorner.hide();
            this.lCorner.hide();
            this.activeCorner = this.ltCorner;
            break;
          }
          case RANGE_OVER_GO.T: {
            this.tCorner.show();
            this.ltCorner.hide();
            this.lCorner.hide();
            this.brCorner.hide();
            this.activeCorner = this.tCorner;
            break;
          }
          case RANGE_OVER_GO.BR: {
            this.brCorner.show();
            this.lCorner.hide();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.activeCorner = this.brCorner;
            break;
          }
          case RANGE_OVER_GO.L: {
            this.lCorner.show();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.brCorner.hide();
            this.activeCorner = this.lCorner;
            break;
          }
          /**
           * 双区域
           */
          case RANGE_OVER_GO.BRT: {
            if (selectLocal === SELECT_LOCAL.T) {
              this.tCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.brCorner.hide();
              this.activeCorner = this.tCorner;
            } else {
              this.brCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.brCorner;
            }
            break;
          }
        }
      } else if (xFixedView.hasFixedLeft()) {
        switch (overGo) {
          /**
           * 单个区域
           */
          case RANGE_OVER_GO.LT: {
            this.ltCorner.show();
            this.tCorner.hide();
            this.brCorner.hide();
            this.lCorner.hide();
            this.activeCorner = this.ltCorner;
            break;
          }
          case RANGE_OVER_GO.T: {
            this.tCorner.show();
            this.ltCorner.hide();
            this.lCorner.hide();
            this.brCorner.hide();
            this.activeCorner = this.tCorner;
            break;
          }
          case RANGE_OVER_GO.BR: {
            this.brCorner.show();
            this.lCorner.hide();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.activeCorner = this.brCorner;
            break;
          }
          case RANGE_OVER_GO.L: {
            this.lCorner.show();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.brCorner.hide();
            this.activeCorner = this.lCorner;
            break;
          }
          /**
           * 双区域
           */
          case RANGE_OVER_GO.BRL: {
            if (selectLocal === SELECT_LOCAL.L) {
              this.lCorner.show();
              this.brCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.lCorner;
            } else {
              this.brCorner.show();
              this.lCorner.hide();
              this.ltCorner.hide();
              this.tCorner.hide();
              this.activeCorner = this.brCorner;
            }
            break;
          }
        }
      } else {
        switch (overGo) {
          /**
           * 单个区域
           */
          case RANGE_OVER_GO.BR: {
            this.brCorner.show();
            this.lCorner.hide();
            this.ltCorner.hide();
            this.tCorner.hide();
            this.activeCorner = this.brCorner;
            break;
          }
        }
      }
    }
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XSelectItem, SELECT_LOCAL,
};
