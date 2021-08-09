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
    this.tableScroll = () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    };
    this.tableResize = () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    };
    this.tableScaleChange = () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    };
    this.tableFixedChange = () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    };
    this.tableChangeWidth = () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    };
    this.tableChangeHeight = () => {
      if (this.display) {
        this.offsetHandle();
        this.borderHandle();
      }
    };
  }

  onAdd() {
    this.hideCopyStyle();
    this.bind();
  }

  unbind() {
    const { table } = this;
    const { tableScroll } = this;
    const { tableResize } = this;
    const { tableScaleChange } = this;
    const { tableFixedChange } = this;
    const { tableChangeWidth } = this;
    const { tableChangeHeight } = this;
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScroll);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, tableResize);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, tableScaleChange);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, tableFixedChange);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, tableChangeWidth);
    XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, tableChangeHeight);
  }

  bind() {
    const { table } = this;
    const { tableScroll } = this;
    const { tableResize } = this;
    const { tableScaleChange } = this;
    const { tableFixedChange } = this;
    const { tableChangeWidth } = this;
    const { tableChangeHeight } = this;
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScroll);
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, tableResize);
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, tableScaleChange);
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, tableFixedChange);
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, tableChangeWidth);
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, tableChangeHeight);
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
