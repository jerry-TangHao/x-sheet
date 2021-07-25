import { Widget } from '../../../libs/Widget';
import { RANGE_OVER_GO } from '../xscreen/item/viewborder/XScreenStyleBorderItem';
import { Constant, cssPrefix } from '../../../const/Constant';
import { XEvent } from '../../../libs/XEvent';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';

class YHeightLight extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-y-height-light`);
    this.table = table;
    this.height = -1;
    this.top = -1;
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
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      this.offsetHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, () => {
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
      const top = this.getTop() + table.getIndexHeight();
      const height = this.getHeight();
      if (top !== this.top || height !== this.height) {
        this.show();
        this.offset({
          left: 0,
          top,
          height,
          width: table.getIndexWidth(),
        });
      }
      this.top = top;
      this.height = height;
    }
  }

  setSize() {
    const { table } = this;
    this.css('width', `${table.getIndexWidth()}px`);
  }

  getTop() {
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
    scrollView.sci = 0;
    scrollView.eci = cols.length - 1;
    fixedView.sci = 0;
    fixedView.eci = cols.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.BRT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.ALL:
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.T: {
        return rows.sectionSumHeight(fixedView.sri, selectRange.sri - 1);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.BRL: {
        const coincide = scrollView.coincide(selectRange);
        const scroll = rows.sectionSumHeight(scrollView.sri, coincide.sri - 1);
        const fixed = rows.sectionSumHeight(fixedView.sri, fixedView.eri);
        return fixed + scroll;
      }
    }
    return 0;
  }

  getHeight() {
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
    scrollView.sci = 0;
    scrollView.eci = cols.length - 1;
    fixedView.sci = 0;
    fixedView.eci = cols.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.LTT: {
        return rows.rectRangeSumHeight(selectRange);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.BRL: {
        return rows.rectRangeSumHeight(scrollView.coincide(selectRange));
      }
      case RANGE_OVER_GO.BRT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.ALL: {
        const scroll = rows.rectRangeSumHeight(scrollView.coincide(selectRange));
        const fixed = rows.rectRangeSumHeight(fixedView.coincide(selectRange));
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

export { YHeightLight };
