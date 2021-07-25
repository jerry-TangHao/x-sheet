/* global window, document */
import { Constant, cssPrefix, XSheetVersion } from './const/Constant';
import { XWork } from './core/xwork/XWork';
import { Widget } from './libs/Widget';
import { XDraw } from './canvas/XDraw';
import { h } from './libs/Element';
import { DragPanel } from './module/dragpanel/DragPanel';
import { ElPopUp } from './module/elpopup/ElPopUp';
import { PlainUtils } from './utils/PlainUtils';
import { RectRange } from './core/xtable/tablebase/RectRange';
import { BaseFont } from './canvas/font/BaseFont';
import { XIcon } from './core/xtable/xicon/XIcon';
import { XlsxExport } from './io/xlsx/XlsxExport';
import { ColorPicker } from './module/colorpicker/ColorPicker';
import FindDpi from './libs/finddpi/FindDpi';
import { HeightUnit } from './core/xtable/tableunit/HeightUnit';
import { WideUnit } from './core/xtable/tableunit/WideUnit';
import './styles/base.less';
import './styles/index.less';
import { XTableFocus } from './core/xtable/XTableFocus';
import { XEvent } from './libs/XEvent';
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
   * @param selectors
   * @param options
   */
  constructor(selectors, options) {
    super(`${cssPrefix}`);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    root.children(this);
    this.options = PlainUtils.copy({}, settings, options);
    this.work = new XWork(this.options.workConfig);
    this.attach(this.work);
    ElPopUp.setRoot(this);
    DragPanel.setRoot(this);
    XTableFocus.setRoot(this);
  }
}

XSheet.version = XSheetVersion;
XSheet.PlainUtils = PlainUtils;
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
