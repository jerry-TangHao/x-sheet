import { XSelectItem } from '../xselect/XSelectItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { XEvent } from '../../../../lib/XEvent';
import { RectRange } from '../../tablebase/RectRange';
import { XScreenSvgBorderItem } from '../../xscreen/item/viewborder/XScreenSvgBorderItem';

class XCopyStyle extends XScreenSvgBorderItem {

  constructor(table) {
    super({ table });
    this.display = false;
    this.selectRange = RectRange.EMPTY;
    this.ltElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.brElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.lElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.tElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.blt.children(this.ltElem);
    this.bl.children(this.lElem);
    this.bt.children(this.tElem);
    this.bbr.children(this.brElem);
  }

  onAdd() {
    this.hideCopyStyle();
    this.bind();
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  bind() {
    const { table } = this;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    });
  }

  borderHandle() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      return;
    }
    this.hideBorder();
    this.showBorder(selectRange);
  }

  offsetHandle() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      this.hide();
      return;
    }
    this.show();
    this.setDisplay(selectRange);
    this.setSizer(selectRange);
    this.setLocal(selectRange);
  }

  hideCopyStyle() {
    this.display = false;
    this.hide();
  }

  showCopyStyle() {
    this.display = true;
    this.show();
    const { xScreen } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    this.selectRange = selectRange;
    this.offsetHandle();
    this.borderHandle();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XCopyStyle,
};
