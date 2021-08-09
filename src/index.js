/* global window, document */
import { Constant, cssPrefix, XSheetVersion } from './const/Constant';
import { XWork } from './core/xwork/XWork';
import { Widget } from './lib/Widget';
import { XDraw } from './draw/XDraw';
import { h } from './lib/Element';
import { DragPanel } from './module/dragpanel/DragPanel';
import { ElPopUp } from './module/elpopup/ElPopUp';
import { SheetUtils } from './utils/SheetUtils';
import { RectRange } from './core/xtable/tablebase/RectRange';
import { BaseFont } from './draw/font/BaseFont';
import { XIcon } from './core/xtable/xicon/XIcon';
import { XlsxExport } from './io/xlsx/XlsxExport';
import { ColorPicker } from './module/colorpicker/ColorPicker';
import FindDpi from './lib/finddpi/FindDpi';
import { HeightUnit } from './core/xtable/tableunit/HeightUnit';
import { WideUnit } from './core/xtable/tableunit/WideUnit';
import './style/base.less';
import './style/index.less';
import { XTableWidgetFocus } from './core/xtable/XTableWidgetFocus';
import { XEvent } from './lib/XEvent';
import { XlsxImport } from './io/xlsx/XlsxImport';

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
   * @param selectors
   * @param options
   */
  constructor(selectors, options) {
    super(`${cssPrefix}`);
    ElPopUp.setRoot(this);
    DragPanel.setRoot(this);
    XTableWidgetFocus.setRoot(this);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    root.children(this);
    this.options = SheetUtils.copy({}, settings, options);
    this.work = new XWork(this.options.workConfig);
    this.attach(this.work);
  }
}

XSheet.version = XSheetVersion;
XSheet.PlainUtils = SheetUtils;
XSheet.XDraw = XDraw;
XSheet.XIcon = XIcon;
XSheet.RectRange = RectRange;
XSheet.BaseFont = BaseFont;
XSheet.FindDpi = FindDpi;
XSheet.WideUnit = WideUnit;
XSheet.HeightUnit = HeightUnit;
XSheet.ColorPicker = ColorPicker;
XSheet.XEvent = XEvent;
XSheet.Constant = Constant;
XSheet.XlsxExport = XlsxExport;
XSheet.XlsxImport = XlsxImport;

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
