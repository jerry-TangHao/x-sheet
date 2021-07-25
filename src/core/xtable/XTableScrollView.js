import { PlainUtils } from '../../utils/PlainUtils';
import { RectRange } from './tablebase/RectRange';

const VIEW_MODE = {
  CHANGE_ADD: Symbol('change_add'),
  CHANGE_NOT: Symbol('change_not'),
  STATIC: Symbol('static'),
  BOUND_OUT: Symbol('bound_out'),
};

/**
 * XTableScrollView
 */
class XTableScrollView {

  /**
   * 视图类型
   * @param lastView
   * @param view
   * @return {symbol}
   */
  static viewMode(lastView, view) {
    if (PlainUtils.isUnDef(lastView)) {
      return VIEW_MODE.CHANGE_NOT;
    }
    // 视图无变化
    if (view.equals(lastView)) {
      return VIEW_MODE.STATIC;
    }
    // 视图不相交
    if (view.coincide(lastView).equals(RectRange.EMPTY)) {
      return VIEW_MODE.BOUND_OUT;
    }
    // 无新增加的视图区域
    if (view.within(lastView)) {
      return VIEW_MODE.CHANGE_NOT;
    }
    // 有新增的视图区域
    return VIEW_MODE.CHANGE_ADD;
  }

  /**
   * XTableScrollView
   * @param scroll
   * @param rows
   * @param cols
   * @param xIteratorBuilder
   * @param getHeight
   * @param getWidth
   */
  constructor({
    scroll,
    rows,
    cols,
    xIteratorBuilder,
    getHeight = () => 0,
    getWidth = () => 0,
  }) {
    this.scroll = scroll;
    this.rows = rows;
    this.cols = cols;
    this.xIteratorBuilder = xIteratorBuilder;
    this.getHeight = getHeight;
    this.getWidth = getWidth;
  }

  /**
   * 当前视图滚动区域
   * @returns {RectRange}
   */
  getScrollView() {
    const {
      rows, cols, xIteratorBuilder, scroll, getHeight, getWidth,
    } = this;
    const { ri, ci } = scroll;
    let [width, height] = [0, 0];
    let [eri, eci] = [rows.len, cols.len];
    // 行
    xIteratorBuilder.getRowIterator()
      .setBegin(ri)
      .setEnd(rows.len - 1)
      .setLoop((i) => {
        height += rows.getHeight(i);
        eri = i;
        return height < getHeight();
      })
      .execute();
    // 列
    xIteratorBuilder.getColIterator()
      .setBegin(ci)
      .setEnd(cols.len - 1)
      .setLoop((j) => {
        width += cols.getWidth(j);
        eci = j;
        return width < getWidth();
      })
      .execute();
    // 滚动视图
    return new RectRange(ri, ci, eri, eci);
  }

  /**
   * 获取最大滚动区域
   */
  getScrollMaxRiCi() {
    const {
      rows, cols, xIteratorBuilder, getHeight, getWidth,
    } = this;
    let [width, height] = [0, 0];
    let [sri, sci] = [0, 0];
    // 行
    xIteratorBuilder.getRowIterator()
      .setBegin(rows.len - 1)
      .setEnd(0)
      .setLoop((i) => {
        height += rows.getHeight(i);
        sri = i;
        return height < getHeight();
      })
      .execute();
    // 列
    xIteratorBuilder.getColIterator()
      .setBegin(cols.len - 1)
      .setEnd(0)
      .setLoop((j) => {
        width += cols.getWidth(j);
        sci = j;
        return width < getWidth();
      })
      .execute();
    // 滚动视图最大行列号
    return { maxRi: sri + 1, maxCi: sci + 1 };
  }

}

export {
  XTableScrollView,
  VIEW_MODE,
};
