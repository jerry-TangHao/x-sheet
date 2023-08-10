import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
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
          const root = this.getRootWidget();
          switch (type) {
            case 1: {
              const file = await this.xlsxSelect.choose();
              menu.close();
              if (file) {
                await root.importXlsx(file, true);
              }
              break;
            }
            case 2: {
              menu.close();
              await root.exportXlsx();
              break;
            }
            default: {
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
    this.format = new Format({
      contextMenu: {
        onUpdate: (code) => {
          console.log('Format', code);
          new Alert({
            message: '开发人员正在努力施工中....',
          }).parentWidget(this).open();
        },
      },
    }).parentWidget(this);
    this.insert = new Insert({
      contextMenu: {
        onUpdate: (code) => {
          console.log('Insert', code);
          new Alert({
            message: '开发人员正在努力施工中....',
          }).parentWidget(this).open();
        },
      },
    }).parentWidget(this);
    this.look = new Look({
      contextMenu: {
        onUpdate: (code) => {
          console.log('Look', code);
          new Alert({
            message: '开发人员正在努力施工中....',
          }).parentWidget(this).open();
        },
      },
    }).parentWidget(this);
    this.update = new Update({
      contextMenu: {
        onUpdate: (code) => {
          console.log('Update', code);
          new Alert({
            message: '开发人员正在努力施工中....',
          }).parentWidget(this).open();
        },
      },
    }).parentWidget(this);
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

  unbind() {
    XEvent.unbind(this.file);
    XEvent.unbind(this.format);
    XEvent.unbind(this.insert);
    XEvent.unbind(this.look);
    XEvent.unbind(this.update);
  }

  setTitle(title) {
    this.title = title;
    this.titleEle.text(title);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XWorkHeadOption };
