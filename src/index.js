/* global window document */
import { Constant, cssPrefix, XSheetVersion } from './const/Constant';
import { XWork } from './core/xwork/XWork';
import { Widget } from './lib/Widget';
import { XDraw } from './draw/XDraw';
import { h } from './lib/Element';
import { SheetUtils } from './utils/SheetUtils';
import { RectRange } from './core/xtable/tablebase/RectRange';
import { BaseFont } from './draw/font/BaseFont';
import { XIcon } from './core/xtable/tableicon/XIcon';
import { XlsxExport } from './io/xlsx/XlsxExport';
import { ColorPicker } from './module/colorpicker/ColorPicker';
import { FindDPI } from './lib/finddpi/FindDpi';
import { HeightUnit } from './core/xtable/tableunit/HeightUnit';
import { WideUnit } from './core/xtable/tableunit/WideUnit';
import { Download } from './lib/donwload/Download';
import './style/base.less';
import './style/index.less';
import { XEvent } from './lib/XEvent';
import { XlsxImport } from './io/xlsx/XlsxImport';
import { WidgetFocusMange } from './lib/WidgetFocusMange';

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
      },
      sheets: [{
        tableConfig: {},
      }],
      sheetConfig: {
        showMenu: true,
      },
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
    if (SheetUtils.isString(el)) {
      el = document.querySelector(el);
    }
    h(el).childrenNodes(this);
    this.options = SheetUtils.copy({}, settings, options);
    this.focusManage = new WidgetFocusMange({
      root: this,
    });
    this.xSheetWork = new XWork(this.options.workConfig);
    this.attach(this.xSheetWork);
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
