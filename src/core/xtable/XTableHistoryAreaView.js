import { PlainUtils } from '../../utils/PlainUtils';
import { SCROLL_TYPE } from './tablebase/Scroll';
import { XTableAreaView } from './XTableAreaView';

/**
 * XTableHistoryAreaView
 */
class XTableHistoryAreaView extends XTableAreaView {

  /**
   * XTableHistoryAreaView
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
    super({
      xTableScrollView,
      rows,
      cols,
      scroll,
    });
    this.lastScrollView = null;
    this.enterView = null;
    this.scrollEnterView = null;
    this.leaveView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    super.reset();
    this.scrollEnterView = null;
    this.enterView = null;
    this.leaveView = null;
  }

  /**
   * 获取上一次滚动的视图区域
   * @returns {null|RectRange}
   */
  getLastScrollView() {
    if (PlainUtils.isNotUnDef(this.lastScrollView)) {
      return this.lastScrollView.clone();
    }
    return null;
  }

  /**
   * 获取滚动离开的视图区域
   * @returns {null|RectRange}
   */
  getLeaveView() {
    if (PlainUtils.isNotUnDef(this.leaveView)) {
      return this.leaveView.clone();
    }
    const lastScrollView = this.getLastScrollView();
    const scrollView = this.getScrollView();
    const { cols, rows } = this;
    if (lastScrollView) {
      const [leaveView] = lastScrollView.coincideDifference(scrollView);
      if (leaveView) {
        leaveView.w = cols.rectRangeSumWidth(leaveView);
        leaveView.h = rows.rectRangeSumHeight(leaveView);
        this.leaveView = leaveView;
        return leaveView.clone();
      }
    }
    return null;
  }

  /**
   * 获取滚动进入的视图区域
   * @returns {null|RectRange}
   */
  getEnterView() {
    if (PlainUtils.isNotUnDef(this.enterView)) {
      return this.enterView.clone();
    }
    const lastScrollView = this.getLastScrollView();
    const scrollView = this.getScrollView();
    const { cols, rows } = this;
    if (lastScrollView) {
      const [enterView] = scrollView.coincideDifference(lastScrollView);
      if (enterView) {
        enterView.w = cols.rectRangeSumWidth(enterView);
        enterView.h = rows.rectRangeSumHeight(enterView);
        this.enterView = enterView;
        return enterView.clone();
      }
    }
    return null;
  }

  /**
   * 获取滚动进入的视图区域
   * @returns {null|RectRange}
   */
  getScrollEnterView() {
    if (PlainUtils.isNotUnDef(this.scrollEnterView)) {
      return this.scrollEnterView.clone();
    }
    const { cols, rows, scroll } = this;
    const enterView = this.getEnterView();
    if (enterView) {
      switch (scroll.type) {
        case SCROLL_TYPE.H_RIGHT: {
          enterView.sci -= 1;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          enterView.sri -= 1;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          enterView.eci += 1;
          break;
        }
        case SCROLL_TYPE.V_TOP: {
          enterView.eri += 1;
          break;
        }
      }
      enterView.w = cols.rectRangeSumWidth(enterView);
      enterView.h = rows.rectRangeSumHeight(enterView);
      this.scrollEnterView = enterView;
      return enterView.clone();
    }
    return null;
  }

  /**
   * 清空上一次视图记录
   */
  undo() {
    this.lastScrollView = null;
  }

  /**
   * 记录上一次视图
   */
  record() {
    this.lastScrollView = this.scrollView;
  }

}

export {
  XTableHistoryAreaView,
};
