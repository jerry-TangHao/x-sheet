import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import Download from '../../../lib/donwload/Download';
import { h } from '../../../lib/Element';
import { File } from './option/File';
import { ForMart } from './option/ForMart';
import { Insert } from './option/Insert';
import { Look } from './option/Look';
import { Update } from './option/Update';
import { XEvent } from '../../../lib/XEvent';
import { ElPopUp } from '../../../module/elpopup/ElPopUp';
import { Alert } from '../../../module/alert/Alert';
import { SelectFile } from '../../../lib/SelectFile';
import { XlsxImportTask } from '../../../task/XlsxImportTask';
import { XlsxExportTask } from '../../../task/XlsxExportTask';
import { XDraw } from '../../../draw/XDraw';
import { Confirm } from '../../../module/confirm/Confirm';
import { XWorkTab } from '../body/tab/XWorkTab';
import { XWorkSheet } from '../body/sheet/XWorkSheet';

class XBookTopOption extends Widget {

  constructor(workTop) {
    super(`${cssPrefix}-option`);
    this.workTop = workTop;
    this.title = `${cssPrefix} 工作簿`;
    this.logoEle = h('div', `${cssPrefix}-option-logo`);
    this.titleEle = h('div', `${cssPrefix}-option-title`);
    this.optionsEle = h('div', `${cssPrefix}-option-box`);
    this.leftEle = h('div', `${cssPrefix}-option-left`);
    this.rightEle = h('div', `${cssPrefix}-option-right`);
    this.leftEle.children(this.logoEle);
    this.rightEle.children(this.titleEle, this.optionsEle);
    this.xlsxImportTask = new XlsxImportTask();
    this.xlsxExportTask = new XlsxExportTask();
    this.children(this.leftEle);
    this.children(this.rightEle);
    this.setTitle(this.title);
    this.xlsxSelect = new SelectFile({
      accept: SelectFile.ACCEPT.XLSX,
      multiple: false,
    });
    this.cvsSelect = new SelectFile({
      accept: SelectFile.ACCEPT.CVS,
      multiple: false,
    });
    this.file = new File({
      contextMenu: {
        autoClose: false,
        onUpdate: async (item, menu) => {
          const { type } = item;
          const { work } = workTop;
          const { body } = work;
          const { sheetView } = body;
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const style = table.getXTableStyle();
          const { wideUnit, heightUnit } = style;
          switch (type) {
            case 1: {
              const file = await this.xlsxSelect.choose();
              menu.close();
              if (file) {
                const dpr = XDraw.dpr();
                const unit = wideUnit.getUnit();
                const dpi = heightUnit.getDpi();
                const result = await this.xlsxImportTask.execute(file, dpr, unit, dpi);
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
                }).open();
              }
              break;
            }
            case 2: {
              menu.close();
              const { sheetList } = sheetView;
              const sheetItems = [];
              sheetList.forEach((sheet) => {
                const { table, tab } = sheet;
                const { rows, cols, settings } = table;
                const merges = table.getTableMerges();
                const cells = table.getTableCells();
                const item = {
                  name: tab.name,
                  tableConfig: {
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
              const options = work.options;
              const dpr = XDraw.dpr();
              const unit = wideUnit.getUnit();
              const dpi = heightUnit.getDpi();
              const result = await this.xlsxExportTask.execute(options, sheetItems, dpr, unit, dpi);
              const file = result.data;
              Download(file, `${options.name}.xlsx`);
              break;
            }
            case 3: {
              menu.close();
              new Alert({
                message: '开发人员正在努力施工中....',
              }).open();
              break;
            }
          }
        },
      },
    });
    this.format = new ForMart();
    this.insert = new Insert();
    this.look = new Look();
    this.update = new Update();
    this.optionsEle.children(this.file);
    this.optionsEle.children(this.format);
    this.optionsEle.children(this.insert);
    this.optionsEle.children(this.look);
    this.optionsEle.children(this.update);
  }

  onAttach() {
    this.bind();
  }

  bind() {
    XEvent.bind(this.file, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { file } = this;
      const { fileContextMenu } = file;
      const { elPopUp } = fileContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fileContextMenu.isClose()) {
        fileContextMenu.open();
      } else {
        fileContextMenu.close();
      }
      e.preventDefault();
      e.stopPropagation();
    });
  }

  unbind() {}

  setTitle(title) {
    this.title = title;
    this.titleEle.text(title);
  }

}

export { XBookTopOption };
