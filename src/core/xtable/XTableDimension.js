import { SheetUtils } from '../../utils/SheetUtils';
import { Code } from './tablebase/Code';
import { Rows } from './tablerow/Rows';
import { Cols } from './tablecol/Cols';
import { Scroll, SCROLL_TYPE } from './tablebase/Scroll';
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { XTableMousePoint } from './XTableMousePoint';
import { XTableKeyboard } from './XTableKeyboard';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { XDraw } from '../../draw/XDraw';
import { RectRange } from './tablebase/RectRange';
import { XTableScrollView } from './XTableScrollView';
import { XTableAreaView } from './XTableAreaView';
import { XTableDrawStyle } from './XTableDrawStyle';
import { XScreen } from './screen/XScreen';
import { XSelectItem } from './screenitems/xselect/XSelectItem';
import { XAutoFillItem } from './screenitems/xautofill/XAutoFillItem';
import { XCopyStyle } from './screenitems/xcopystyle/XCopyStyle';
import { RowFixed } from './tablefixed/RowFixed';
import { ColFixed } from './tablefixed/ColFixed';
import { DropRowFixed } from './tablefixed/drop/DropRowFixed';
import { DropColFixed } from './tablefixed/drop/DropColFixed';
import { XFixedMeasure } from './tablebase/XFixedMeasure';
import { XFixedView } from './tablebase/XFixedView';
import { XFilter } from './screenitems/xfilter/XFilter';
import { CellMergeCopyHelper } from './helper/dimension/CellMergeCopyHelper';
import { Clipboard } from '../../lib/Clipboard';
import { XIcon } from './tableicon/XIcon';
import { XIconBuilder } from './tableicon/XIconBuilder';
import { BaseFont } from '../../draw/font/BaseFont';
import { XIteratorBuilder } from './iterator/XIteratorBuilder';
import { RowHeightGroupIndex } from './tablebase/RowHeightGroupIndex';
import { Alert } from '../../module/alert/Alert';
import { Snapshot } from './snapshot/Snapshot';
import { TableEdit } from './tableedit/TableEdit';
import { Protection } from './protection/Protection';
import { DateCellsHelper } from './helper/dimension/DateCellsHelper';

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
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
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

class XTableTop extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
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
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
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
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
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

class XTableLeft extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
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
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
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
    if (SheetUtils.isDef(this.scrollView)) {
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

class XTableLeftIndex extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
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
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
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
    if (SheetUtils.isDef(this.scrollView)) {
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

class XTableContent extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
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
    if (SheetUtils.isNumber(this.height)) {
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
    if (SheetUtils.isNumber(this.x)) {
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
    if (SheetUtils.isNumber(this.y)) {
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
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableTopIndex extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
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
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
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
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
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

// ================================= XTable ================================

const settings = {
  index: {
    height: 30,
    width: 50,
    gridColor: 'rgb(193,193,193)',
    size: 12,
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
    buttonColor: 'rgb(193,193,193)',
  },
  data: [],
  protection: {
    protections: [],
  },
  merge: {
    merges: [],
  },
  sheetProtection: false,
};

/**
 * XTable
 */
class XTableDimension extends Widget {

  /**
   * XTable
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-table`);
    this.settings = SheetUtils.copy({}, settings, options);
  }

  /**
   * onAttach
   */
  onAttach() {
    this.rootWidget = this.getRootWidget();
    // 焦点元素管理
    this.focusManage = this.rootWidget.focusManage;
    // 图标创建器
    this.xIconBuilder = new XIconBuilder();
    // 行列迭代器
    this.xIteratorBuilder = new XIteratorBuilder();
    // 数据快照
    this.snapshot = new Snapshot();
    // 表格数据配置
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cssPx(this.scale.goto(v)),
      }),
      ...this.settings.index,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cssPx(this.scale.goto(v)),
      }),
      snapshot: this.snapshot,
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.cols,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cssPx(this.scale.goto(v)),
      }),
      snapshot: this.snapshot,
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.rows,
    });
    this.scale = new Scale();
    // 保护区域
    this.protection = new Protection({
      snapshot: this.snapshot,
      ...settings.protection,
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
    // 表格界面绘制
    this.xTableStyle = new XTableDrawStyle({
      xTableScrollView: this.xTableScrollView,
      xIteratorBuilder: this.xIteratorBuilder,
      scroll: this.scroll,
      snapshot: this.snapshot,
      settings: this.settings,
      xFixedView: this.xFixedView,
    });
    // 数据操作帮助类
    this.dateCellsHelper = new DateCellsHelper(this);
    // table区域
    this.xTableFrozenContent = new XTableFrozenContent(this);
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // table组件
    this.readOnlyAlert = new Alert({
      closeDestroy: false,
    }).parentWidget(this);
    this.keyboard = new XTableKeyboard(this);
    this.mousePointer = new XTableMousePoint(this);
    this.xScreen = new XScreen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new TableEdit(this);
    this.rowFixed = new RowFixed(this);
    this.colFixed = new ColFixed(this);
    this.dropColFixed = new DropColFixed(this);
    this.dropRowFixed = new DropRowFixed(this);
    // 粘贴板
    this.clipboard = new Clipboard({
      filter: () => {},
      paste: () => {},
    });
    // 单元格辅助类
    this.cellMergeCopyHelper = new CellMergeCopyHelper(this);
    // 表格行高索引
    this.rowHeightGroupIndex = new RowHeightGroupIndex({
      rows: this.rows,
      xFixedView: this.xFixedView,
      xIteratorBuilder: this.xIteratorBuilder,
    });
    // 数据变更监听
    this.snapshot.listen.registerListen('change', (event) => {
      this.cols.syncColsLen(this.xTableStyle.cols);
      this.rows.syncRowsLen(this.xTableStyle.rows);
      if (event) {
        const { type } = event;
        switch (type) {
          case Constant.TABLE_EVENT_TYPE.REMOVE_ROW:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.REMOVE_ROW);
            break;
          case Constant.TABLE_EVENT_TYPE.REMOVE_COL:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.REMOVE_COL);
            break;
          case Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW);
            break;
          case Constant.TABLE_EVENT_TYPE.ADD_NEW_COL:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.ADD_NEW_COL);
            break;
          case Constant.TABLE_EVENT_TYPE.DATA_CHANGE:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            break;
          case Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH:
            this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH);
            break;
          case Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT:
            this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT);
            break;
        }
      }
      this.trigger(Constant.TABLE_EVENT_TYPE.SNAPSHOT_CHANGE);
    });
    // 表格事件绑定
    this.bindTableEvent();
    // 图标事件绑定
    this.bindIconEvent();
    // 初始化
    this.initialize();
  }

  /**
   * 初始化
   */
  initialize() {
    // 注册焦点元素
    this.focusManage.register({
      target: this,
    });
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
    let ci = min;
    this.xIteratorBuilder.getColIterator()
      .setBegin(ci)
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
        ci = i;
      })
      .execute();
    return [ci, s, v];
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
    return [ri, s, v];
  }

  /**
   * 单元辅助实例
   * @returns {TextCellsHelper}
   */
  getTextCellsHelper() {
    const { xTableStyle } = this;
    return xTableStyle.getTextCellsHelper();
  }

  /**
   * 数据操作帮助类
   * @returns {DateCellsHelper}
   */
  getDateCellsHelper() {
    return this.dateCellsHelper;
  }

  /**
   * 单元辅助实例
   * @returns {StyleCellsHelper}
   */
  getStyleCellsHelper() {
    const { xTableStyle } = this;
    return xTableStyle.getStyleCellsHelper();
  }

  /**
   * 单元辅助实例
   * @returns {OperateCellsHelper}
   */
  getOperateCellsHelper() {
    const { xTableStyle } = this;
    return xTableStyle.getOperateCellsHelper();
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
   * 获取表格渲染对象
   * @returns {XTableDrawStyle}
   */
  getXTableStyle() {
    const { xTableStyle } = this;
    return xTableStyle;
  }

  /**
   * 获取表格数据
   * @returns {XTableDataItems}
   */
  getTableData() {
    const { xTableStyle } = this;
    const { xTableData } = xTableStyle;
    return xTableData;
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
    const { xFixedView } = this;
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
    const { xFixedView } = this;
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
    return this.box().width;
  }

  /**
   * 可视区域高度
   * @return {*}
   */
  visualHeight() {
    return this.box().height;
  }

  /**
   * 隐藏编辑器
   */
  hideEditor() {
    this.edit.hide();
  }

  /**
   * 显示编辑器
   */
  showEditor() {
    this.edit.show();
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
    const { fixedCellIcon, staticCellIcon } = style;
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
      sx: XDraw.stylePx(sx),
      sy: XDraw.stylePx(sy),
      fx: XDraw.stylePx(fx),
      fy: XDraw.stylePx(fy),
    });
  }

  /**
   * 更新表格的指针
   */
  pointerEvent(info) {
    const { mousePointer } = this;
    const { ri, ci } = info;
    if (ri === -1 && ci === -1) {
      mousePointer.set(XTableMousePoint.KEYS.default);
      return;
    }
    if (ri === -1) {
      mousePointer.set(XTableMousePoint.KEYS.sResize);
      return;
    }
    if (ci === -1) {
      mousePointer.set(XTableMousePoint.KEYS.eResize);
      return;
    }
    mousePointer.set(XTableMousePoint.KEYS.cell);
  }

  /**
   * 获取指定单元格下的行列
   * @param x
   * @param y
   * @returns {{ci: number, ri: number}}
   */
  getRiCiByXy(x, y) {
    const { xFixedView } = this;
    const { rows, cols } = this;

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

    const merge = merges.getFirstInclude(ri, ci);
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
   * 移除事件绑定
   */
  unbind() {
    this.focusManage.remove(this);
    XEvent.unbind(this);
  }

  /**
   * 图标事件
   */
  bindIconEvent() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      const { x, y } = this.eventXy(e);
      const info = this.getRiCiByXy(x, y);
      this.pointerEvent(info);
      this.xIconsEvent(XIcon.ICON_EVENT_TYPE.MOUSE_MOVE, info, e);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { activate } = this.focusManage;
      const { target } = activate;
      if (target === this) {
        const { x, y } = this.eventXy(e);
        const info = this.getRiCiByXy(x, y);
        this.xIconsEvent(XIcon.ICON_EVENT_TYPE.MOUSE_DOWN, info, e);
      }
    });
  }

  /**
   * 表格事件
   */
  bindTableEvent() {
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.ADD_NEW_COL, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.REMOVE_COL, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.REMOVE_ROW, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.FIXED_ROW_CHANGE, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.FIXED_COL_CHANGE, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.SNAPSHOT_CHANGE, () => {
      this.render();
    });
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
    const { cols, xFixedView, scroll } = this;
    const fixedView = xFixedView.getFixedView();
    const [
      ci, left,
    ] = this.colsReduceIf(fixedView.eci + 1, cols.len, 0, 0, x, i => cols.getWidth(i));
    // 记录滚动方向
    if (scroll.x > left) {
      scroll.x = left;
      scroll.ci = ci;
      scroll.type = SCROLL_TYPE.H_LEFT;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.x < left) {
      scroll.x = left;
      scroll.ci = ci;
      scroll.type = SCROLL_TYPE.H_RIGHT;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * 垂直滚动
   * @param y
   */
  scrollY(y) {
    const { rows, scroll, rowHeightGroupIndex } = this;
    const find = rowHeightGroupIndex.get(y);
    const [
      ri, top,
    ] = this.rowsReduceIf(find.ri, rows.len, find.top, 0, y, i => rows.getHeight(i));
    // 记录滚动方向
    if (scroll.y > top) {
      scroll.type = SCROLL_TYPE.V_TOP;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.y < top) {
      scroll.type = SCROLL_TYPE.V_BOTTOM;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * 滚动到指定行
   */
  scrollRi(ri) {
    const { rows, scroll } = this;
    const top = rows.sectionSumHeight(0, ri);
    // 记录滚动方向
    if (scroll.y > top) {
      scroll.type = SCROLL_TYPE.V_TOP;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.y < top) {
      scroll.type = SCROLL_TYPE.V_BOTTOM;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * 滚动到指定列
   */
  scrollCi(ci) {
    const { cols, scroll } = this;
    const left = cols.sectionSumWidth(0, ci);
    // 记录滚动方向
    if (scroll.x > left) {
      scroll.x = left;
      scroll.ci = ci;
      scroll.type = SCROLL_TYPE.H_LEFT;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.x < left) {
      scroll.x = left;
      scroll.ci = ci;
      scroll.type = SCROLL_TYPE.H_RIGHT;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * 获取向上滚动的距离
   * @returns {*}
   */
  getTop() {
    const { rows, xFixedView } = this;
    const fixedView = xFixedView.getFixedView();
    const view = this.getScrollView();
    return rows.sectionSumHeight(fixedView.eri + 1, view.sri - 1);
  }

  /**
   * 获取向左滚动的距离
   * @returns {*}
   */
  getLeft() {
    const { cols, xFixedView } = this;
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
    const { xFixedView, rows, scroll, rowFixed } = this;
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
    // 发送更新通知
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_ROW_CHANGE);
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
  }

  /**
   * 设置固定列视图
   * @param end
   * @param start
   */
  setFixedCol(end, start = -1) {
    const { xFixedView, rows, scroll, colFixed } = this;
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
    // 发送更新通知
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_COL_CHANGE);
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
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
    xTableAreaView.reset();
    xTableFrozenContent.reset();
    xLeftIndex.reset();
    xTopIndex.reset();
    xLeft.reset();
    xTop.reset();
    xContent.reset();
  }

  /**
   * 重置缓存
   */
  recache() {
    this.rows.clearCache();
    this.cols.clearCache();
    this.rowHeightGroupIndex.clear();
    this.xTableStyle.rows.clearCache();
    this.xTableStyle.cols.clearCache();
  }

  /**
   * 重置界面大小
   */
  resize() {
    const { rowFixed, colFixed } = this;
    const { xTableStyle, xScreen } = this;
    this.recache();
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
    const { xTableStyle, xFixedView, scroll } = this;
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
   * 设置缩放比
   */
  setScale(val = 1) {
    const { yHeightLight, xHeightLight, xTableStyle } = this;
    const { xScreen, scale, rowFixed, colFixed } = this;
    this.recache();
    this.reset();
    scale.setValue(val);
    xTableStyle.setScale(val);
    xScreen.setZone();
    rowFixed.setSize();
    colFixed.setSize();
    xHeightLight.offsetHandle();
    yHeightLight.offsetHandle();
    this.trigger(Constant.TABLE_EVENT_TYPE.SCALE_CHANGE);
  }

  /**
   * 表格是否只读
   * @returns {boolean}
   */
  isProtection({ tips = true, view = null } = {}) {
    let { settings, readOnlyAlert } = this;
    let { xScreen, protection } = this;
    let { sheetProtection } = settings;
    // 表格是否只读
    if (sheetProtection) {
      if (tips) {
        readOnlyAlert.setMessage('只读模式无法编辑').open();
      }
      return true;
    }
    // 选择区域是否只读
    if (view === null) {
      let xSelect = xScreen.findType(XSelectItem);
      let { selectRange } = xSelect;
      if (selectRange) {
        let includes = protection.getIntersects(selectRange);
        if (includes.length) {
          if (tips) {
            readOnlyAlert.setMessage('只读模式无法编辑').open();
          }
          return true;
        }
      }
    } else {
      let includes = protection.getIntersects(view);
      if (includes.length) {
        if (tips) {
          readOnlyAlert.setMessage('只读模式无法编辑').open();
        }
        return true;
      }
    }
    return false;
  }

  /**
   * 删除指定行
   * @param ri
   * @param number
   */
  removeRow(ri, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.removeRow(ri, number);
    protection.removeRow(ri, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.REMOVE_ROW,
    });
    this.resize();
  }

  /**
   * 删除指定列
   * @param ci
   * @param number
   */
  removeCol(ci, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.removeCol(ci, number);
    protection.removeCol(ci, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.REMOVE_COL,
    });
    this.resize();
  }

  /**
   * 插入到指定行之后
   * @param ri
   * @param number
   */
  insertRowAfter(ri, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertRowAfter(ri, number);
    protection.insertRowAfter(ri, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW,
    });
    this.resize();
  }

  /**
   * 插入到指定行之前
   * @param ri
   * @param number
   */
  insertRowBefore(ri, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertRowBefore(ri, number);
    protection.insertRowBefore(ri, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW,
    });
    this.resize();
  }

  /**
   * 插入到指定列之后
   * @param ci
   * @param number
   */
  insertColAfter(ci, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertColAfter(ci, number);
    protection.insertColAfter(ci, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_COL,
    });
    this.resize();
  }

  /**
   * 插入到指定列之前
   * @param ci
   * @param number
   */
  insertColBefore(ci, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertColBefore(ci, number);
    protection.insertColBefore(ci, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_COL,
    });
    this.resize();
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
    this.keyboard.destroy();
  }

}

export {
  XTableDimension,
};
