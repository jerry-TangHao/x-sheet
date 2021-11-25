import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { FileContextMenuItem } from './FileContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';
import { ELContextMenuDivider } from '../../../../../../module/contextmenu/ELContextMenuDivider';

class FileContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-option-file-context-menu`, SheetUtils.copy({
      autoClose: true,
      onUpdate: () => {},
    }, options));
    this.items = [
      new FileContextMenuItem('导入cvs', 3),
      new FileContextMenuItem('导出cvs', 6),
      new ELContextMenuDivider(),
      new FileContextMenuItem('导入xlsx', 1),
      new FileContextMenuItem('导出xlsx', 2),
      new ELContextMenuDivider(),
      new FileContextMenuItem('重命名', 8),
      new FileContextMenuItem('打印表格', 4),
      new FileContextMenuItem('表格截图', 5),
      new FileContextMenuItem('文档详情', 7),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }

  update(item) {
    const { options } = this;
    const { autoClose } = options;
    options.onUpdate(item, this);
    if (autoClose) {
      this.close();
    }
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
