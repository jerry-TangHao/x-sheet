/* global window */
import { Widget } from '../../libs/Widget';
import { cssPrefix, Constant, XSheetVersion } from '../../const/Constant';
import { VerticalLayer } from '../../libs/layer/VerticalLayer';
import { HorizontalLayer } from '../../libs/layer/HorizontalLayer';
import { VerticalLayerElement } from '../../libs/layer/VerticalLayerElement';
import { ScrollBarX } from '../../component/scrollbar/ScrollBarX';
import { ScrollBarY } from '../../component/scrollbar/ScrollBarY';
import { HorizontalLayerElement } from '../../libs/layer/HorizontalLayerElement';
import { VerticalCenterElement } from '../../libs/layer/center/VerticalCenterElement';
import { VerticalCenter } from '../../libs/layer/center/VerticalCenter';
import { SheetView } from './SheetView';
import { TabView } from './TabView';
import { PlainUtils } from '../../utils/PlainUtils';
import { XEvent } from '../../libs/XEvent';
import { h } from '../../libs/Element';
import { Tab } from './Tab';
import { Sheet } from './Sheet';
import Download from '../../libs/donwload/Download';
import { Throttle } from '../../libs/Throttle';
import { XDraw } from '../../canvas/XDraw';

const settings = {
  sheets: [],
};

class WorkBody extends Widget {

  constructor(work, options) {
    super(`${cssPrefix}-work-body`);
    this.work = work;
    this.options = PlainUtils.copy({}, settings, options);
    this.sheets = this.options.sheets;
    this.tabSheet = [];
    this.activeIndex = -1;
    // 版本标识
    this.version = h('div', `${cssPrefix}-version-tips`);
    this.version.html(`<a target="_blank" href="https://gitee.com/eigi/x-sheet">${XSheetVersion}</a>`);
    this.children(this.version);
    // sheet表
    this.sheetViewLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    // 垂直滚动条
    this.scrollBarYLayer = new HorizontalLayerElement({
      style: {
        overflow: 'inherit',
      },
    });
    // 水平滚动条
    this.scrollBarXLayer = new VerticalCenterElement();
    this.scrollBarXVerticalCenter = new VerticalCenter();
    this.scrollBarXHorizontalLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 2,
      },
    });
    this.scrollBarXVerticalCenter.children(this.scrollBarXLayer);
    this.scrollBarXHorizontalLayer.children(this.scrollBarXVerticalCenter);
    // 选项卡
    this.sheetSwitchTabLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 3,
      },
    });
    // 水平布局
    this.horizontalLayer1 = new HorizontalLayer();
    this.horizontalLayer2 = new HorizontalLayer();
    this.horizontalLayer1.children(this.sheetViewLayer);
    this.horizontalLayer1.children(this.scrollBarYLayer);
    this.horizontalLayer2.children(this.sheetSwitchTabLayer);
    this.horizontalLayer2.children(this.scrollBarXHorizontalLayer);
    // 根布局
    this.horizontalLayer1Layer = new VerticalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    this.horizontalLayer2Layer = new VerticalLayerElement();
    this.layerVerticalLayer = new VerticalLayer();
    this.horizontalLayer1Layer.children(this.horizontalLayer1);
    this.horizontalLayer2Layer.children(this.horizontalLayer2);
    this.layerVerticalLayer.children(this.horizontalLayer1Layer);
    this.layerVerticalLayer.children(this.horizontalLayer2Layer);
    this.children(this.layerVerticalLayer);
    // 组件
    this.sheetView = new SheetView();
    this.tabView = new TabView({
      onAdd: () => {
        const tab = new Tab();
        const sheet = new Sheet(tab);
        this.addTabSheet({ tab, sheet });
      },
      onSwitch: (tab) => {
        this.setActiveTab(tab);
      },
    });
    this.scrollBarY = new ScrollBarY({
      scroll: (move) => {
        const sheet = this.sheetView.getActiveSheet();
        sheet.table.scrollY(move);
      },
    });
    this.scrollBarX = new ScrollBarX({
      scroll: (move) => {
        const sheet = this.sheetView.getActiveSheet();
        sheet.table.scrollX(move);
      },
    });
  }

  onAttach() {
    const {
      sheetViewLayer, scrollBarYLayer, sheetSwitchTabLayer, scrollBarXLayer,
    } = this;
    scrollBarYLayer.attach(this.scrollBarY);
    scrollBarXLayer.attach(this.scrollBarX);
    sheetSwitchTabLayer.attach(this.tabView);
    sheetViewLayer.attach(this.sheetView);
    this.bind();
    this.createSheet();
  }

  bind() {
    const exploreInfo = PlainUtils.getExplorerInfo();
    const throttle = new Throttle();
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.scrollBarLocal();
      this.scrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.scrollBarLocal();
      this.scrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      const table = this.getActiveTable();
      if (table) {
        this.scrollBarLocal();
        this.scrollBarSize();
      }
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      e.stopPropagation();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      e.stopPropagation();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
      e.stopPropagation();
    });
    XEvent.bind(this.sheetView, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (e) => {
      const sheet = this.sheetView.getActiveSheet();
      if (PlainUtils.isUnDef(sheet)) return;
      const { table } = sheet;
      const {
        scroll, rows,
      } = table;
      const scrollView = table.getScrollView();
      const { scrollTo } = this.scrollBarY;
      const { deltaY } = e;
      switch (exploreInfo.type) {
        case 'Chrome': {
          if (deltaY > 0) {
            this.scrollBarY.scrollMove(scrollTo + Math.abs(deltaY));
          } else {
            this.scrollBarY.scrollMove(scrollTo - Math.abs(deltaY));
          }
          break;
        }
        case 'Firefox': {
          if (deltaY > 0) {
            const dis = rows.getHeight(scrollView.sri + 1);
            this.scrollBarY.scrollMove(scrollTo + dis);
          } else {
            const dis = rows.getHeight(scrollView.sri - 1);
            this.scrollBarY.scrollMove(scrollTo - dis);
          }
          break;
        }
      }
      if (scroll.blockTop < scroll.maxBlockTop && scroll.blockTop > 0) {
        e.stopPropagation();
      }
      e.preventDefault();
    });
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
      throttle.action(() => {
        XDraw.dprUpdate();
        const table = this.getActiveTable();
        if (table) {
          table.reset();
          this.scrollBarLocal();
          this.scrollBarSize();
          table.resize();
        }
      });
    });
  }

  unbind() {
    XEvent.unbind(this.sheetView);
    XEvent.unbind(window);
  }

  addTabSheet({ tab, sheet }) {
    const {
      tabSheet, sheetView, tabView,
    } = this;
    sheetView.attach(sheet);
    tabView.attach(tab);
    tabSheet.push({
      tab, sheet,
    });
  }

  scrollBarSize() {
    const table = this.getActiveTable();
    const {
      scrollBarXHorizontalLayer, scrollBarY, scrollBarX,
    } = this;
    // 获取表格大小
    const totalHeight = table.getScrollTotalHeight();
    const totalWidth = table.getScrollTotalWidth();
    // 是否显示水平滚动条
    if (totalWidth > table.getContentWidth()) {
      scrollBarXHorizontalLayer.show();
    } else {
      scrollBarXHorizontalLayer.hide();
    }
    // 调整滚动条尺寸
    scrollBarY.setSize(table.getContentHeight(), totalHeight);
    scrollBarX.setSize(table.getContentWidth(), totalWidth);
  }

  scrollBarLocal() {
    const table = this.getActiveTable();
    this.scrollBarY.setLocal(table.getTop());
    this.scrollBarX.setLocal(table.getLeft());
  }

  createSheet() {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.sheets) {
      // eslint-disable-next-line no-restricted-syntax
      const { name } = item;
      const tab = new Tab(name);
      const sheet = new Sheet(tab, item);
      this.addTabSheet({ tab, sheet });
    }
    if (this.tabSheet.length) {
      this.setActiveIndex(0);
    }
  }

  setActiveIndex(index) {
    const {
      sheetView, tabView,
    } = this;
    sheetView.setActiveSheet(index);
    tabView.setActiveTab(index);
    const table = this.getActiveTable();
    if (table) {
      table.reset();
      this.scrollBarLocal();
      this.scrollBarSize();
      table.resize();
    }
    this.trigger(Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE);
    this.activeIndex = index;
  }

  setScale(value) {
    const { sheetView } = this;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    table.setScale(value);
    this.scrollBarLocal();
    this.scrollBarSize();
  }

  setActiveTab(tab) {
    this.tabSheet.forEach((item, index) => {
      if (item.tab === tab) {
        this.setActiveIndex(index);
      }
    });
  }

  getActiveSheet() {
    return this.sheetView.getActiveSheet();
  }

  getActiveTable() {
    const sheet = this.getActiveSheet();
    if (sheet) {
      return sheet.table;
    }
    return null;
  }

  toJson() {
    const { activeIndex, sheetView } = this;
    const { sheetList } = sheetView;
    const sheet = sheetList[activeIndex];
    if (sheet) {
      const { table, tab } = sheet;
      const { rows, cols, settings } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const data = {
        name: tab.name,
        tableConfig: {
          table: {
            showGrid: settings.table.showGrid,
            background: settings.table.background,
          },
          merge: {
            merges: merges.getData(),
          },
          cols: {
            len: cols.len,
            width: cols.width,
            data: cols.getData(),
          },
          rows: {
            len: rows.len,
            height: rows.height,
            data: rows.getData(),
          },
          data: cells.getData(),
        },
      };
      const text = `window['${tab.name}'] = ${JSON.stringify(data)}`;
      Download(text, `${tab.name}.js`, 'application/x-javascript');
    }
  }

  toJsonAll() {
    const { sheetView } = this;
    const { sheetList } = sheetView;
    sheetList.forEach((sheet) => {
      const { table, tab } = sheet;
      const { rows, cols, settings } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const data = {
        name: tab.name,
        tableConfig: {
          table: {
            showGrid: settings.table.showGrid,
            background: settings.table.background,
          },
          merge: {
            merges: merges.getData(),
          },
          cols: {
            len: cols.len,
            width: cols.width,
            data: cols.getData(),
          },
          rows: {
            len: rows.len,
            height: rows.height,
            data: rows.getData(),
          },
          data: cells.getData(),
        },
      };
      const text = `window['${tab.name}'] = ${JSON.stringify(data)}`;
      Download(text, `${tab.name}.js`, 'application/x-javascript');
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { WorkBody };
