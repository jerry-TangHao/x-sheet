import { PlainUtils } from '../../utils/PlainUtils';
import { Code } from './tablebase/Code';
import { Rows } from './tablebase/Rows';
import { Cols } from './tablebase/Cols';
import { Scroll, SCROLL_TYPE } from './tablebase/Scroll';
import { Widget } from '../../libs/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { XEvent } from '../../libs/XEvent';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { XTableMousePointer } from './XTableMousePointer';
import { XTableKeyboard } from './XTableKeyboard';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { XTableFocus } from './XTableFocus';
import { XDraw } from '../../canvas/XDraw';
import { RectRange } from './tablebase/RectRange';
import { XTableScrollView } from './XTableScrollView';
import { XTableAreaView } from './XTableAreaView';
import { XTableEdit } from './XTableEdit';
import { XTableStyle } from './XTableStyle';
import { XScreen } from './xscreen/XScreen';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';
import { XAutoFillItem } from './xscreenitems/xautofill/XAutoFillItem';
import { XCopyStyle } from './xscreenitems/xcopystyle/XCopyStyle';
import { RowFixed } from './tablefixed/RowFixed';
import { ColFixed } from './tablefixed/ColFixed';
import { DropRowFixed } from './tablefixed/drop/DropRowFixed';
import { DropColFixed } from './tablefixed/drop/DropColFixed';
import { XFixedMeasure } from './tablebase/XFixedMeasure';
import { XFixedView } from './tablebase/XFixedView';
import { XFilter } from './xscreenitems/xfilter/XFilter';
import { TableDataSnapshot } from './datasnapshot/TableDataSnapshot';
import { CellMergeCopyHelper } from './helper/CellMergeCopyHelper';
import { Clipboard } from '../../libs/Clipboard';
import { XIcon } from './xicon/XIcon';
import { XIconBuilder } from './xicon/XIconBuilder';
import { BaseFont } from '../../canvas/font/BaseFont';
import { XIteratorBuilder } from './iterator/XIteratorBuilder';
import { RowHeightGroupIndex } from './tablebase/RowHeightGroupIndex';

class Dimensions {

  constructor(table) {
    this.table = table;
    this.scrollView = null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  reset() {
    this.scrollView = null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  getX() {
    throw new TypeError('child impl');
  }

  getY() {
    throw new TypeError('child impl');
  }

  getHeight() {
    throw new TypeError('child impl');
  }

  getWidth() {
    throw new TypeError('child impl');
  }

}

// ============================== 表格区域信息 ===============================

class XTableFrozenContent extends Dimensions {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { xFixedView } = table;
    const view = xFixedView.getFixedView();
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

}

class XTableTopIndex extends Dimensions {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = index.getHeight();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableLeftIndex extends Dimensions {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { index } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = index.getWidth();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableLeft extends Dimensions {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    const fixedView = xFixedView.getFixedView();
    scrollView.sci = fixedView.sci;
    scrollView.eci = fixedView.eci;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableTop extends Dimensions {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    const fixedView = xFixedView.getFixedView();
    scrollView.sri = fixedView.sri;
    scrollView.eri = fixedView.eri;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableContent extends Dimensions {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const { xLeft } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

// ================================= 快捷键 =================================

class KeyBoardTabCode {

  static register(table) {
    const {
      keyboard, xTableScrollView, cols, rows, xScreen, edit,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const merges = table.getTableMerges();
    let $tabNext = null;
    keyboard.register({
      target: table,
      keyCode: 9,
      callback: () => {
        edit.hideEdit();
        const scrollView = xTableScrollView.getScrollView();
        const { selectRange } = xSelect;
        const { tabNext } = selectRange;
        const selectRangeClone = selectRange.clone();
        if (!tabNext) {
          const { sri, sci } = selectRangeClone;
          $tabNext = { sri, sci };
        }
        const cLen = cols.len - 1;
        const rLen = rows.len - 1;
        let { sri, sci } = $tabNext;
        const srcMerges = merges.getFirstIncludes(sri, sci);
        if (srcMerges) {
          sci = srcMerges.eci;
        }
        if (sci >= cLen && sri >= rLen) {
          return;
        }
        if (sci >= cLen) {
          sri += 1;
          sci = 0;
        } else {
          sci += 1;
        }
        $tabNext.sri = sri;
        $tabNext.sci = sci;
        let eri = sri;
        let eci = sci;
        const targetMerges = merges.getFirstIncludes(sri, sci);
        if (targetMerges) {
          sri = targetMerges.sri;
          sci = targetMerges.sci;
          eri = targetMerges.eri;
          eci = targetMerges.eci;
        }
        selectRangeClone.tabNext = true;
        selectRangeClone.sri = sri;
        selectRangeClone.sci = sci;
        selectRangeClone.eri = eri;
        selectRangeClone.eci = eci;
        xSelect.setRange(selectRangeClone);
        if (scrollView.intersects(selectRangeClone)) {
          edit.showEdit();
        } else {
          edit.hideEdit();
        }
      },
    });
  }

}

// ================================= XTable ================================

const settings = {
  index: {
    height: 30,
    width: 50,
    gridColor: 'rgb(193,193,193)',
    size: 11,
    color: 'rgb(0,0,0)',
  },
  table: {
    showGrid: true,
    background: 'rgb(255,255,255)',
    borderColor: 'rgb(0,0,0)',
    gridColor: 'rgb(225,225,225)',
  },
  rows: {
    len: 1000,
    height: 30,
    data: [],
  },
  cols: {
    len: 36,
    width: 110,
    data: [],
  },
  xFixedView: {
    fixedView: new RectRange(0, 0, -1, -1),
    fxLeft: -1,
    fxTop: -1,
  },
  xFixedBar: {
    height: RowFixed.HEIGHT,
    width: ColFixed.WIDTH,
    background: 'rgb(234,234,234)',
    buttonColor: 'rgb(293,293,293)',
  },
  data: [],
  merge: {
    merges: [],
  },
};

/**
 * XTable
 */
class XTableDimensions extends Widget {

  /**
   * XTable
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-table`);
    // 表格设置
    this.settings = PlainUtils.copy({}, settings, options);
    // 视口区域大小
    this.visualHeightCache = null;
    this.visualWidthCache = null;
    // 图标创建器
    this.xIconBuilder = new XIconBuilder();
    // 行列迭代器
    this.xIteratorBuilder = new XIteratorBuilder();
    // 表格数据配置
    this.scale = new Scale();
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.srcTransformCssPx(this.scale.goto(v)),
      }),
      ...this.settings.index,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.srcTransformCssPx(this.scale.goto(v)),
      }),
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.rows,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.srcTransformCssPx(this.scale.goto(v)),
      }),
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.cols,
    });
    // 冻结视图坐标
    this.xFixedView = new XFixedView(this.settings.xFixedView);
    this.xFixedMeasure = new XFixedMeasure({
      fixedView: this.xFixedView,
      cols: this.cols,
      rows: this.rows,
    });
    // 滚动视图的坐标
    this.scroll = new Scroll({
      xFixedView: this.xFixedView,
    });
    // 表格滚动视图
    this.xTableScrollView = new XTableScrollView({
      scroll: this.scroll,
      rows: this.rows,
      cols: this.cols,
      xIteratorBuilder: this.xIteratorBuilder,
      getHeight: () => this.xContent.getHeight(),
      getWidth: () => this.xContent.getWidth(),
    });
    // 表格视图区域
    this.xTableAreaView = new XTableAreaView({
      xTableScrollView: this.xTableScrollView,
      rows: this.rows,
      cols: this.cols,
      scroll: this.scroll,
    });
    // 表格界面
    this.xTableStyle = new XTableStyle({
      xTableScrollView: this.xTableScrollView,
      scroll: this.scroll,
      xIteratorBuilder: this.xIteratorBuilder,
      settings: this.settings,
      xFixedView: this.xFixedView,
    });
    // 数据快照
    this.tableDataSnapshot = new TableDataSnapshot({
      merges: this.getTableMerges(),
      cells: this.getTableCells(),
      table: this,
      cols: this.cols,
      rows: this.rows,
    });
    // table区域
    this.xTableFrozenContent = new XTableFrozenContent(this);
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // table组件
    this.focus = new XTableFocus(this);
    this.mousePointer = new XTableMousePointer(this);
    this.keyboard = new XTableKeyboard(this);
    this.xScreen = new XScreen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new XTableEdit(this);
    this.rowFixed = new RowFixed(this);
    this.colFixed = new ColFixed(this);
    this.dropColFixed = new DropColFixed(this);
    this.dropRowFixed = new DropRowFixed(this);
    // 单元格辅助类
    this.cellMergeCopyHelper = new CellMergeCopyHelper(this);
    // 粘贴板
    this.clipboard = new Clipboard({
      filter: () => {
        const { focus } = this;
        const { activate } = focus;
        const { target } = activate;
        return target === this;
      },
      paste: () => {},
    });
    // 表格行高索引
    this.rowHeightGroupIndex = new RowHeightGroupIndex({
      rows: this.rows,
      xFixedView: this.xFixedView,
      xIteratorBuilder: this.xIteratorBuilder,
    });
  }

  /**
   * 滚动行区间
   * @param min
   * @param max
   * @param initS
   * @param initV
   * @param ifv
   * @param getV
   * @return {(*|number)[]}
   */
  rowsReduceIf(min, max, initS, initV, ifv, getV) {
    let s = initS;
    let v = initV;
    let ri = min;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(ri)
      .setEnd(max - 1)
      .setLoop((i) => {
        if (s >= ifv) {
          return false;
        }
        v = getV(i);
        s += v;
        return true;
      })
      .setFinish((i) => {
        ri = i;
      })
      .execute();
    return [ri, s - v, v];
  }

  /**
   * 滚动列区间
   * @param min
   * @param max
   * @param initS
   * @param initV
   * @param ifv
   * @param getV
   * @return {(*|number)[]}
   */
  colsReduceIf(min, max, initS, initV, ifv, getV) {
    let s = initS;
    let v = initV;
    let ri = min;
    this.xIteratorBuilder.getColIterator()
      .setBegin(ri)
      .setEnd(max - 1)
      .setLoop((i) => {
        if (s >= ifv) {
          return false;
        }
        v = getV(i);
        s += v;
        return true;
      })
      .setFinish((i) => {
        ri = i;
      })
      .execute();
    return [ri, s - v, v];
  }

  /**
   * 单元辅助实例
   * @returns {OperateCellsHelper}
   */
  getOperateCellsHelper() {
    const { xTableStyle } = this;
    const { operateCellsHelper } = xTableStyle;
    return operateCellsHelper;
  }

  /**
   * 单元辅助实例
   * @returns {StyleCellsHelper}
   */
  getStyleCellsHelper() {
    const { xTableStyle } = this;
    const { styleCellsHelper } = xTableStyle;
    return styleCellsHelper;
  }

  /**
   * 获取表格渲染对象
   * @returns {XTableStyle}
   */
  getXTableStyle() {
    const { xTableStyle } = this;
    return xTableStyle;
  }

  /**
   * 读取合并单元格
   */
  getTableMerges() {
    const { xTableStyle } = this;
    const { merges } = xTableStyle;
    return merges;
  }

  /**
   * 获取表格单元格
   * @returns {Cells}
   */
  getTableCells() {
    const { xTableStyle } = this;
    const { cells } = xTableStyle;
    return cells;
  }

  /**
   * 滚动视图的高度
   * @returns {*}
   */
  getScrollTotalHeight() {
    const {
      xFixedView,
    } = this;
    const { rows } = this;
    let height;
    if (xFixedView.hasFixedTop()) {
      const fixedView = xFixedView.getFixedView();
      height = rows.sectionSumHeight(fixedView.eri + 1, rows.len - 1);
    } else {
      height = rows.sectionSumHeight(0, rows.len - 1);
    }
    return height;
  }

  /**
   * 滚动视图的宽度
   * @returns {*}
   */
  getScrollTotalWidth() {
    const {
      xFixedView,
    } = this;
    const { cols } = this;
    let width;
    if (xFixedView.hasFixedLeft()) {
      const fixedView = xFixedView.getFixedView();
      width = cols.sectionSumWidth(fixedView.eci, cols.len - 1);
    } else {
      width = cols.sectionSumWidth(0, cols.len - 1);
    }
    return width;
  }

  /**
   * 获取单元格CSS样式
   * @param row
   * @param col
   */
  getCellCssStyle(row, col) {
    const cells = this.getTableCells();
    const cell = cells.getCell(row, col);
    const { fontAttr, background } = cell;
    const { align, size, color, bold, italic, name } = fontAttr;
    const fontSize = XDraw.srcTransformCssPx(this.scale.goto(size));
    let textAlign = 'left';
    switch (align) {
      case BaseFont.ALIGN.left:
        textAlign = 'left';
        break;
      case BaseFont.ALIGN.center:
        textAlign = 'center';
        break;
      case BaseFont.ALIGN.right:
        textAlign = 'right';
        break;
    }
    const css = `
      text-align:${textAlign};
      color: ${color};
      background:${background};
      font-style: ${italic ? 'italic' : 'initial'};
      font-weight: ${bold ? 'bold' : 'initial'};
      font-size: ${XDraw.srcTransformCssPx(fontSize)}px;
      font-family: ${name};
    `;
    return css.replace(/\s/g, '');
  }

  /**
   * 索引栏高度
   * @returns {*}
   */
  getIndexHeight() {
    const { index } = this;
    return index.getHeight();
  }

  /**
   * 索引栏宽度
   * @returns {*}
   */
  getIndexWidth() {
    const { index } = this;
    return index.getWidth();
  }

  /**
   * 获取内容区域高度
   */
  getContentHeight() {
    const { xContent } = this;
    return xContent.getHeight();
  }

  /**
   * 获取内容区域宽度
   */
  getContentWidth() {
    const { xContent } = this;
    return xContent.getWidth();
  }

  /**
   * 固定区域宽度
   */
  getFixedWidth() {
    const { xLeft } = this;
    return xLeft.getWidth();
  }

  /**
   * 固定区域高度
   * @returns {*}
   */
  getFixedHeight() {
    const { xTop } = this;
    return xTop.getHeight();
  }

  /**
   * 可视区域宽度
   * @return {*}
   */
  visualWidth() {
    if (PlainUtils.isNumber(this.visualWidthCache)) {
      return this.visualWidthCache;
    }
    const width = this.box().width;
    this.visualWidthCache = width;
    return width;
  }

  /**
   * 可视区域高度
   * @return {*}
   */
  visualHeight() {
    if (PlainUtils.isNumber(this.visualHeightCache)) {
      return this.visualHeightCache;
    }
    const height = this.box().height;
    this.visualHeightCache = height;
    return height;
  }

  /**
   * 表格图标事件处理
   * @param type
   * @param info
   * @param native
   */
  xIconsEvent(type, info, native) {
    const { xIconBuilder } = this;
    const style = this.getXTableStyle();
    const cells = this.getTableCells();
    const {
      fixedCellIcon, staticCellIcon,
    } = style;
    const {
      ri, ci, mri, mci, fx, fy, sx, sy,
    } = info;

    let staticIconArray = [];
    let fixedIconArray = [];

    // 单元格固定小图标
    const fixedIcon = fixedCellIcon.getIcon(ri, ci);
    if (fixedIcon) {
      fixedIconArray = fixedIconArray.concat(fixedIcon);
    }

    // 单元格内容小图标
    const cell = cells.getCell(mri, mci);
    if (cell) {
      staticIconArray = staticIconArray.concat(cell.icons);
    }

    // 单元格固定小图标
    const staticIcon = staticCellIcon.getIcon(mri, mci);
    if (staticIcon) {
      staticIconArray = staticIconArray.concat(staticIcon);
    }

    // 触发单元格小图标事件
    xIconBuilder.xIconsEvent({
      native,
      type,
      staticIcons: staticIconArray,
      fixedIcons: fixedIconArray,
      sx: XDraw.srcTransformStylePx(sx),
      sy: XDraw.srcTransformStylePx(sy),
      fx: XDraw.srcTransformStylePx(fx),
      fy: XDraw.srcTransformStylePx(fy),
    });
  }

  /**
   * 更新表格的指针
   */
  pointerEvent(info) {
    const { mousePointer } = this;
    const { ri, ci } = info;
    if (ri === -1 && ci === -1) {
      mousePointer.set(XTableMousePointer.KEYS.default);
      return;
    }
    if (ri === -1) {
      mousePointer.set(XTableMousePointer.KEYS.sResize);
      return;
    }
    if (ci === -1) {
      mousePointer.set(XTableMousePointer.KEYS.eResize);
      return;
    }
    mousePointer.set(XTableMousePointer.KEYS.cell);
  }

  /**
   * 获取指定单元格下的行列
   * @param x
   * @param y
   * @returns {{ci: number, ri: number}}
   */
  getRiCiByXy(x, y) {
    const {
      xFixedView, rows, cols,
    } = this;

    const { index } = this;
    const fixedView = xFixedView.getFixedView();
    const merges = this.getTableMerges();
    const fixedWidth = this.getFixedWidth();
    const fixedHeight = this.getFixedHeight();

    let [left, top] = [x, y];
    let [ci, ri] = [-1, -1];
    left -= index.getWidth();
    top -= index.getHeight();

    let fx = 0;
    if (left <= fixedWidth && x > index.getWidth()) {
      let total = 0;
      this.xIteratorBuilder.getColIterator()
        .setBegin(fixedView.sci)
        .setEnd(fixedView.eci)
        .setLoop((i) => {
          const width = cols.getWidth(i);
          total += width;
          ci = i;
          return total < left;
        })
        .execute();
      fx = (total - cols.getWidth(ci) - left) * -1;
    } else if (x > index.getWidth()) {
      let total = fixedWidth;
      const viewRange = this.getScrollView();
      this.xIteratorBuilder.getColIterator()
        .setBegin(viewRange.sci)
        .setEnd(viewRange.eci)
        .setLoop((i) => {
          const width = cols.getWidth(i);
          total += width;
          ci = i;
          return total < left;
        })
        .execute();
      fx = (total - cols.getWidth(ci) - left) * -1;
    }

    let fy = 0;
    if (top < fixedHeight && y > index.getHeight()) {
      let total = 0;
      this.xIteratorBuilder.getRowIterator()
        .setBegin(fixedView.sri)
        .setEnd(fixedView.eri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          total += height;
          ri = i;
          return total <= top;
        })
        .execute();
      fy = (total - rows.getHeight(ri) - top) * -1;
    } else if (y > index.getHeight()) {
      let total = fixedHeight;
      const viewRange = this.getScrollView();
      this.xIteratorBuilder.getRowIterator()
        .setBegin(viewRange.sri)
        .setEnd(viewRange.eri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          total += height;
          ri = i;
          return total <= top;
        })
        .execute();
      fy = (total - rows.getHeight(ri) - top) * -1;
    }

    const merge = merges.getFirstIncludes(ri, ci);
    let mci = ci;
    let mri = ri;
    let sx = fx;
    let sy = fy;
    if (merge) {
      mri = merge.sri;
      mci = merge.sci;
      const { rows, cols } = this;
      const height = rows.sectionSumHeight(mri, ri - 1);
      const width = cols.sectionSumWidth(mci, ci - 1);
      sy += height;
      sx += width;
    }

    return {
      ri, ci, mri, mci, fx, fy, sx, sy,
    };
  }

  /**
   * onAttach
   */
  onAttach() {
    // 注册焦点元素
    this.focus.register({ target: this });
    // 表格渲染组件
    const { xTableStyle } = this;
    this.attach(xTableStyle);
    // 添加屏幕组件
    this.attach(this.xScreen);
    this.xScreen.addItem(new XFilter(this));
    this.xScreen.addItem(new XSelectItem(this));
    this.xScreen.addItem(new XCopyStyle(this));
    this.xScreen.addItem(new XAutoFillItem(this));
    // 添加表格组件
    this.attach(this.xHeightLight);
    this.attach(this.yHeightLight);
    this.attach(this.edit);
    this.attach(this.rowFixed);
    this.attach(this.colFixed);
    this.attach(this.xReSizer);
    this.attach(this.yReSizer);
    this.attach(this.dropRowFixed);
    this.attach(this.dropColFixed);
    // 绑定表格事件
    this.bind();
    // 注册快捷键
    KeyBoardTabCode.register(this);
  }

  /**
   * 事件绑定
   */
  bind() {
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      const { x, y } = this.eventXy(e);
      const info = this.getRiCiByXy(x, y);
      this.pointerEvent(info);
      this.xIconsEvent(XIcon.ICON_EVENT_TYPE.MOUSE_MOVE, info, e);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { activate } = this.focus;
      const { target } = activate;
      if (target === this) {
        const { x, y } = this.eventXy(e);
        const info = this.getRiCiByXy(x, y);
        this.xIconsEvent(XIcon.ICON_EVENT_TYPE.MOUSE_DOWN, info, e);
      }
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.rowHeightGroupIndex.clear();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.FIXED_ROW_CHANGE, () => {
      this.rowHeightGroupIndex.clear();
    });
  }

  /**
   * 移除事件绑定
   */
  unbind() {
    this.keyboard.unbind();
    this.focus.unbind();
  }

  /**
   * 获取滚动视图
   * @returns {RectRange}
   */
  getScrollView() {
    const { xTableAreaView } = this;
    return xTableAreaView.getScrollView();
  }

  /**
   * 水平滚动
   * @param x
   */
  scrollX(x) {
    const {
      cols, xFixedView, scroll,
    } = this;
    const fixedView = xFixedView.getFixedView();
    const [
      ci, left, width,
    ] = this.colsReduceIf(fixedView.eci + 1, cols.len, 0, 0, x, i => cols.getWidth(i));
    let x1 = left;
    if (x > 0) x1 += width;
    let type;
    if (scroll.x > x1) {
      type = SCROLL_TYPE.H_LEFT;
    } else if (scroll.x < x1) {
      type = SCROLL_TYPE.H_RIGHT;
    }
    scroll.type = type;
    scroll.ci = ci;
    scroll.x = x1;
    this.scrolling();
    scroll.type = SCROLL_TYPE.UN;
  }

  /**
   * 垂直滚动
   * @param y
   */
  scrollY(y) {
    const { rows, scroll, rowHeightGroupIndex } = this;
    const find = rowHeightGroupIndex.get(y);
    const [
      ri, top, height,
    ] = this.rowsReduceIf(find.ri, rows.len, find.top, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    let type;
    if (scroll.y > y1) {
      type = SCROLL_TYPE.V_TOP;
    } else if (scroll.y < y1) {
      type = SCROLL_TYPE.V_BOTTOM;
    }
    scroll.type = type;
    scroll.ri = ri;
    scroll.y = y1;
    this.scrolling();
    scroll.type = SCROLL_TYPE.UN;
  }

  /**
   * 获取向上滚动的距离
   * @returns {*}
   */
  getTop() {
    const {
      rows, xFixedView,
    } = this;
    const fixedView = xFixedView.getFixedView();
    const view = this.getScrollView();
    return rows.sectionSumHeight(fixedView.eri + 1, view.sri - 1);
  }

  /**
   * 获取向左滚动的距离
   * @returns {*}
   */
  getLeft() {
    const {
      cols, xFixedView,
    } = this;
    const fixedView = xFixedView.getFixedView();
    const view = this.getScrollView();
    return cols.sectionSumWidth(fixedView.eci + 1, view.sci - 1);
  }

  /**
   * 设置固定行视图
   * @param end
   * @param start
   */
  setFixedRow(end, start = -1) {
    const {
      xFixedView,
      rows,
      scroll,
      rowFixed,
    } = this;
    // 更新视图
    const fixedView = xFixedView.getFixedView();
    fixedView.eri = end;
    if (start > -1) {
      fixedView.sri = start;
    }
    xFixedView.setFixedView(fixedView);
    // 更新滚动距离
    const { sri, eri } = fixedView;
    if (xFixedView.hasFixedTop()) {
      scroll.y = 0;
      scroll.ri = eri + 1;
    } else {
      scroll.y = rows.sectionSumHeight(0, sri - 1);
      scroll.ri = sri;
    }
    // 更新固定条
    rowFixed.fxSri = fixedView.sri;
    rowFixed.fxEri = fixedView.eri;
    // 更新视图
    this.resize();
    // 发送更新通知
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_ROW_CHANGE);
  }

  /**
   * 设置固定列视图
   * @param end
   * @param start
   */
  setFixedCol(end, start = -1) {
    const {
      xFixedView,
      rows,
      scroll,
      colFixed,
    } = this;
    // 更新视图
    const fixedView = xFixedView.getFixedView();
    fixedView.eci = end;
    if (start > -1) {
      fixedView.sci = start;
    }
    xFixedView.setFixedView(fixedView);
    // 更新滚动距离
    const { sci, eci } = fixedView;
    if (xFixedView.hasFixedLeft()) {
      scroll.x = 0;
      scroll.ci = eci + 1;
    } else {
      scroll.x = rows.sectionSumHeight(0, sci - 1);
      scroll.ci = sci;
    }
    // 跟新固定条
    colFixed.fxSci = fixedView.sci;
    colFixed.fxEci = fixedView.eci;
    // 更新视图
    this.resize();
    // 发送更新通知
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
  }

  /**
   * 设置缩放比
   */
  setScale(val = 1) {
    const {
      yHeightLight,
      xHeightLight,
      xTableStyle,
      xScreen,
      scale,
      rowFixed,
      colFixed,
    } = this;
    this.reset();
    scale.setValue(val);
    xScreen.setZone();
    xHeightLight.offsetHandle();
    yHeightLight.offsetHandle();
    rowFixed.setSize();
    colFixed.setSize();
    xTableStyle.setScale(val);
    this.trigger(Constant.TABLE_EVENT_TYPE.SCALE_CHANGE);
  }

  /**
   * 重置变量区
   */
  reset() {
    const { xTableAreaView } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    this.visualHeightCache = null;
    this.visualWidthCache = null;
    xTableAreaView.reset();
    xTableFrozenContent.reset();
    xLeftIndex.reset();
    xTopIndex.reset();
    xLeft.reset();
    xTop.reset();
    xContent.reset();
  }

  /**
   * 重置界面大小
   */
  resize() {
    const {
      xTableStyle, xScreen, rowFixed, colFixed,
    } = this;
    this.reset();
    xScreen.setZone();
    rowFixed.setSize();
    colFixed.setSize();
    xTableStyle.resize();
    this.trigger(Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE);
  }

  /**
   * 渲染静态界面
   */
  render() {
    const { xTableStyle } = this;
    xTableStyle.render();
    this.trigger(Constant.TABLE_EVENT_TYPE.RENDER);
  }

  /**
   * 渲染滚动界面
   */
  scrolling() {
    const {
      xTableStyle, xFixedView, scroll,
    } = this;
    const fixedView = xFixedView.getFixedView();
    if (!xFixedView.hasFixedTop()) {
      fixedView.sri = scroll.ri;
    }
    if (!xFixedView.hasFixedLeft()) {
      fixedView.sci = scroll.ci;
    }
    this.reset();
    xFixedView.setFixedView(fixedView);
    xTableStyle.scrolling();
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.xScreen.destroy();
    this.xReSizer.destroy();
    this.yReSizer.destroy();
    this.xHeightLight.destroy();
    this.yHeightLight.destroy();
    this.edit.destroy();
    this.rowFixed.destroy();
    this.colFixed.destroy();
  }

}

export {
  XTableDimensions,
};
