import { Widget } from '../../libs/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../libs/Element';
import { File } from './options/File';
import { ForMart } from './options/ForMart';
import { Insert } from './options/Insert';
import { Look } from './options/Look';
import { Update } from './options/Update';
import { XEvent } from '../../libs/XEvent';
import { ElPopUp } from '../../component/elpopup/ElPopUp';
import { Alert } from '../../component/alert/Alert';
import { XlsxExport } from '../../io/XlsxExport';

class TopOption extends Widget {

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
    this.children(this.leftEle);
    this.children(this.rightEle);
    this.setTitle(this.title);
    this.file = new File({
      contextMenu: {
        onUpdate(item) {
          const { work } = workTop;
          const { type } = item;
          switch (type) {
            case 1:
              new Alert({ message: '开发人员正在努力施工中....' }).open();
              break;
            case 2:
              XlsxExport.exportXlsx(work);
              break;
            case 3:
              new Alert({ message: '开发人员正在努力施工中....' }).open();
              break;
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

export { TopOption };
