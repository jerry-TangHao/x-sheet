import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { FileContextMenuItem } from './FileContextMenuItem';
import { XEvent } from '../../../../../libs/XEvent';

class FileContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-scale-context-menu`, PlainUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FileContextMenuItem('导入xlsx文件', 1),
      new FileContextMenuItem('导出xlsx文件', 2),
      new FileContextMenuItem('导入cvs文件', 3),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }

  update(item) {
    const { options } = this;
    options.onUpdate(item);
    this.close();
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.update(item);
      });
    });
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  FileContextMenu,
};
