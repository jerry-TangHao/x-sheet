import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { Download } from '../../../lib/donwload/Download';
import { h } from '../../../lib/Element';
import { File } from './option/File';
import { Format } from './option/Format';
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

class XWorkHeadOption extends Widget {

  constructor(workTop) {
    super(`${cssPrefix}-option`);
    this.workTop = workTop;
    this.title = `${cssPrefix} 工作簿`;
    this.logoEle = h('div', `${cssPrefix}-option-logo`);
    this.titleEle = h('div', `${cssPrefix}-option-title`);
    this.optionsEle = h('div', `${cssPrefix}-option-box`);
    this.leftEle = h('div', `${cssPrefix}-option-left`);
    this.rightEle = h('div', `${cssPrefix}-option-right`);
    this.leftEle.childrenNodes(this.logoEle);
    this.rightEle.childrenNodes(this.titleEle, this.optionsEle);
    this.xlsxImportTask = new XlsxImportTask();
    this.xlsxExportTask = new XlsxExportTask();
    this.childrenNodes(this.leftEle);
    this.childrenNodes(this.rightEle);
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
                }).parentWidget(this).open();
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
              }).parentWidget(this).open();
              break;
            }
          }
        },
      },
    }).parentWidget(this);
    this.format = new Format().parentWidget(this);
    this.insert = new Insert().parentWidget(this);
    this.look = new Look().parentWidget(this);
    this.update = new Update().parentWidget(this);
    this.optionsEle.childrenNodes(this.file);
    this.optionsEle.childrenNodes(this.update);
    this.optionsEle.childrenNodes(this.insert);
    this.optionsEle.childrenNodes(this.look);
    this.optionsEle.childrenNodes(this.format);
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
    XEvent.bind(this.format, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { format } = this;
      const { formatContextMenu } = format;
      const { elPopUp } = formatContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (formatContextMenu.isClose()) {
        formatContextMenu.open();
      } else {
        formatContextMenu.close();
      }
      e.preventDefault();
      e.stopPropagation();
    });
    XEvent.bind(this.insert, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { insert } = this;
      const { insertContextMenu } = insert;
      const { elPopUp } = insertContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (insertContextMenu.isClose()) {
        insertContextMenu.open();
      } else {
        insertContextMenu.close();
      }
      e.preventDefault();
      e.stopPropagation();
    });
    XEvent.bind(this.look, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { look } = this;
      const { lookContextMenu } = look;
      const { elPopUp } = lookContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (lookContextMenu.isClose()) {
        lookContextMenu.open();
      } else {
        lookContextMenu.close();
      }
      e.preventDefault();
      e.stopPropagation();
    });
    XEvent.bind(this.update, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { update } = this;
      const { updateContextMenu } = update;
      const { elPopUp } = updateContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (updateContextMenu.isClose()) {
        updateContextMenu.open();
      } else {
        updateContextMenu.close();
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

export { XWorkHeadOption };
