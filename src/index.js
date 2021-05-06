/* global window, document */
import { cssPrefix, XSheetVersion } from './const/Constant';
import { h } from './libs/Element';
import { Work } from './core/work/Work';
import { Widget } from './libs/Widget';
import { DragPanel } from './component/dragpanel/DragPanel';
import { ElPopUp } from './component/elpopup/ElPopUp';
import { XDraw } from './canvas/XDraw';
import { PlainUtils } from './utils/PlainUtils';
import { RectRange } from './core/table/tablebase/RectRange';
import { BaseFont } from './canvas/font/BaseFont';
import { XIcon } from './core/table/xicon/XIcon';
import './styles/base.less';
import './styles/index.less';
import { ColorPicker } from './component/colorpicker/ColorPicker';
import { XlsxExport } from './io/XlsxExport';

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

class XSheet extends Widget {
  constructor(selectors, options) {
    super(`${cssPrefix}`);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    root.children(this);
    this.options = PlainUtils.copy({}, settings, options);
    this.work = new Work(this.options.workConfig);
    this.attach(this.work);
    ElPopUp.setRoot(this);
    DragPanel.setRoot(this);
  }
}
XSheet.version = XSheetVersion;
XSheet.PlainUtils = PlainUtils;
XSheet.XDraw = XDraw;
XSheet.XIcon = XIcon;
XSheet.RectRange = RectRange;
XSheet.BaseFont = BaseFont;
XSheet.ColorPicker = ColorPicker;
XSheet.XlsxExport = XlsxExport;
if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
