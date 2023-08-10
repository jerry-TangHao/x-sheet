/* global window document */
import { Constant, cssPrefix, XSheetVersion } from './const/Constant';
import { XWork } from './core/work/XWork';
import { Widget } from './lib/Widget';
import { XDraw } from './draw/XDraw';
import { h } from './lib/Element';
import { SheetUtils } from './utils/SheetUtils';
import { RectRange } from './core/table/tablebase/RectRange';
import { BaseFont } from './draw/font/BaseFont';
import { XIcon } from './core/table/tableicon/XIcon';
import { XlsxExport } from './io/xlsx/XlsxExport';
import { ColorPicker } from './module/colorpicker/ColorPicker';
import { FindDPI } from './lib/finddpi/FindDpi';
import { HeightUnit } from './core/table/tableunit/HeightUnit';
import { WideUnit } from './core/table/tableunit/WideUnit';
import { Download } from './lib/donwload/Download';
import { XEvent } from './lib/XEvent';
import { XlsxImport } from './io/xlsx/XlsxImport';
import { WidgetFocusMange } from './lib/WidgetFocusMange';

import './style/base.less';
import './style/index.less';

import { TabNameGen } from './lib/TabNameGen';
import { XlsxImportTask } from './worker/XlsxImportTask';
import { XlsxExportTask } from './worker/XlsxExportTask';
import { Confirm } from './module/confirm/Confirm';
import { XWorkTab } from './core/work/body/tab/XWorkTab';
import { XWorkSheet } from './core/work/body/sheet/XWorkSheet';

const settings = {
  workConfig: {
    name: 'x-sheet',
    top: {
      option: {
        show: true,
      },
      menu: {
        show: true,
      },
    },
    body: {
      tabConfig: {
        showMenu: true,
        showAdd: true,
      },
      banner: true,
      sheetConfig: {
        showMenu: true,
      },
      sheets: [{
        tableConfig: {},
      }],
    },
    bottom: {
      show: true,
    },
  },
};

/**
 * XSheet
 */
class XSheet extends Widget {

  /**
   * XSheet
   * @param el
   * @param options
   */
  constructor(el, options) {
    super(`${cssPrefix}`, 'div', true);
    this.tabNameGen = new TabNameGen();
    if (SheetUtils.isString(el)) {
      el = document.querySelector(el);
    }
    h(el).childrenNodes(this);
    this.xlsxImportTask = new XlsxImportTask();
    this.xlsxExportTask = new XlsxExportTask();
    this.options = SheetUtils.copy({}, settings, options);
    this.focusManage = new WidgetFocusMange({
      root: this,
    });
    this.xWork = new XWork(this.options.workConfig);
    this.attach(this.xWork);
  }

  getWork() {
    return this.xWork;
  }

  /**
   * 导入xlsx文件
   * @param xlsx 文件
   * @param confirm 展示确认提示框
   * @returns {Promise<void>}
   */
  async importXlsx(xlsx, confirm = false) {
    const { body } = this.xWork;
    const result = await this.xlsxToXSheet(xlsx, null);
    if (confirm) {
      new Confirm({
        message: '文件解析完成是否导入?',
        ok: () => {
          const config = result.data;
          const { sheets } = config.body;
          sheets.forEach((item) => {
            const tab = new XWorkTab(item.name);
            const sheet = new XWorkSheet(tab, item);
            body.addTabSheet(tab, sheet);
          });
        },
      }).parentWidget(this).open();
    } else {
      const config = result.data;
      const { sheets } = config.body;
      sheets.forEach((item) => {
        const tab = new XWorkTab(item.name);
        const sheet = new XWorkSheet(tab, item);
        body.addTabSheet(tab, sheet);
      });
    }
  }

  /**
   * xlsx文件转换到 XSheetJson
   * @param xlsx {File}
   * @param callback {Function | null}
   * @returns {Promise<never>}
   */
  async xlsxToXSheet(xlsx, callback) {
    const { body } = this.xWork;
    const { sheetView } = body;
    const { table } = sheetView.getActiveSheet();
    const { wideUnit, heightUnit } = table.getXTableStyle();
    const dpr = XDraw.dpr();
    const unit = wideUnit.getUnit();
    const dpi = heightUnit.getDpi();
    const result = await this.xlsxImportTask.execute(xlsx, dpr, unit, dpi);
    if (callback) {
      callback(result);
    }
    return result;
  }

  /**
   * 下载xlsx文件
   * @returns {Promise<void>}
   */
  async exportXlsx() {
    const { options } = this.xWork;
    const result = await this.xSheetToXlsx(null);
    const file = result.data;
    Download(file, `${options.name}.xlsx`);
  }

  /**
   * XSheet 转换到 xlsx文件
   * @param callback
   * @returns {Promise<never>}
   */
  async xSheetToXlsx(callback) {
    const { body, options } = this.xWork;
    const { sheetView } = body;
    const { sheetList } = sheetView;
    const { table } = sheetView.getActiveSheet();
    const { wideUnit, heightUnit } = table.getXTableStyle();
    const sheetItems = [];
    sheetList.forEach((sheet) => {
      const { table, tab } = sheet;
      const { rows, cols, settings } = table;
      const { colFixed, rowFixed } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const item = {
        name: tab.name,
        tableConfig: {
          fxLeft: colFixed.fxEci,
          fxTop: rowFixed.fxEri,
          table: {
            showGrid: settings.table.showGrid,
            background: settings.table.background,
          },
          merge: merges.getData(),
          rows: rows.getData(),
          cols: cols.getData(),
          data: cells.getData(),
        },
      };
      sheetItems.push(item);
    });
    const dpr = XDraw.dpr();
    const unit = wideUnit.getUnit();
    const dpi = heightUnit.getDpi();
    const result = await this.xlsxExportTask.execute(options, sheetItems, dpr, unit, dpi);
    if (callback) {
      callback(result);
    }
    return result;
  }

  /**
   * destroy
   */
  destroy() {
    super.destroy();
    this.xWork.destroy();
    this.focusManage.destroy();
    this.tabNameGen.clear();
  }
}

XSheet.version = XSheetVersion;
XSheet.SheetUtils = SheetUtils;
XSheet.XDraw = XDraw;
XSheet.XIcon = XIcon;
XSheet.RectRange = RectRange;
XSheet.BaseFont = BaseFont;
XSheet.FindDPI = FindDPI;
XSheet.WideUnit = WideUnit;
XSheet.HeightUnit = HeightUnit;
XSheet.ColorPicker = ColorPicker;
XSheet.XEvent = XEvent;
XSheet.Constant = Constant;
XSheet.Download = Download;
XSheet.XlsxExport = XlsxExport;
XSheet.XlsxImport = XlsxImport;

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
