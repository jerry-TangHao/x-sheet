import { SheetUtils } from '../../utils/SheetUtils';

/**
 * TableAreaView
 */
class XTableAreaView {

  /**
   * TableAreaView
   * @param xTableScrollView
   * @param rows
   * @param cols
   * @param scroll
   */
  constructor({
    xTableScrollView,
    rows,
    cols,
    scroll,
  }) {
    this.xTableScrollView = xTableScrollView;
    this.scroll = scroll;
    this.rows = rows;
    this.cols = cols;
    this.scrollView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    this.scrollView = null;
  }

  /**
   * 当前视图滚动区域
   * @returns {RectRange}
   */
  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { xTableScrollView } = this;
    const { cols, rows } = this;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.w = cols.rectRangeSumWidth(scrollView);
    scrollView.h = rows.rectRangeSumHeight(scrollView);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

export {
  XTableAreaView,
};
