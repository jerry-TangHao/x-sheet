import { Widget } from '../../../libs/Widget';
import { RANGE_OVER_GO } from '../xscreen/item/viewborder/XScreenStyleBorderItem';
import { cssPrefix, Constant } from '../../../const/Constant';
import { XEvent } from '../../../libs/XEvent';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';

class XHeightLight extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-x-height-light`);
    this.table = table;
    this.width = -1;
    this.left = -1;
    this.setSize();
  }

  onAttach() {
    this.bind();
    this.hide();
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  bind() {
    const { table } = this;
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, () => {
      this.offsetHandle();
    });
  }

  offsetHandle() {
    const { table } = this;
    const {
      xScreen,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    if (selectRange) {
      const left = this.getLeft() + table.getIndexWidth();
      const width = this.getWidth();
      if (left !== this.left || width !== this.width) {
        this.show();
        this.offset({
          top: 0,
          left,
          width,
          height: table.getIndexHeight(),
        });
      }
      this.left = left;
      this.width = width;
    }
  }

  setSize() {
    const { table } = this;
    this.css('height', `${table.getIndexHeight()}px`);
  }

  getLeft() {
    const { table } = this;
    const {
      xScreen, rows, xFixedView, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    const overGo = xSelect.getOverGo(selectRange);
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = rows.length - 1;
    fixedView.sri = 0;
    fixedView.eri = rows.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.ALL:
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.L: {
        return cols.sectionSumWidth(fixedView.sci, selectRange.sci - 1);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.BRT: {
        const coincide = scrollView.coincide(selectRange);
        const scroll = cols.sectionSumWidth(scrollView.sci, coincide.sci - 1);
        const fixed = cols.sectionSumWidth(fixedView.sci, fixedView.eci);
        return fixed + scroll;
      }
    }
    return 0;
  }

  getWidth() {
    const { table } = this;
    const {
      xScreen, rows, xFixedView, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    const overGo = xSelect.getOverGo(selectRange);
    scrollView.sri = 0;
    scrollView.eri = rows.length - 1;
    fixedView.sri = 0;
    fixedView.eri = rows.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.LTL: {
        return cols.rectRangeSumWidth(selectRange);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.BRT: {
        return cols.rectRangeSumWidth(scrollView.coincide(selectRange));
      }
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.ALL: {
        const scroll = cols.rectRangeSumWidth(scrollView.coincide(selectRange));
        const fixed = cols.rectRangeSumWidth(fixedView.coincide(selectRange));
        return scroll + fixed;
      }
    }
    return 0;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XHeightLight };
