import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { XEvent } from '../../../../../../lib/XEvent';
import { UpdateContextMenuItem } from './UpdateContextMenuItem';
import { ELContextMenuDivider } from '../../../../../../module/contextmenu/ELContextMenuDivider';

class UpdateContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-option-update-context-menu`, SheetUtils.copy({
      autoClose: true,
      onUpdate: () => {},
    }, options));
    this.items = [
      new UpdateContextMenuItem('撤销', 1),
      new UpdateContextMenuItem('重做', 2),
      new ELContextMenuDivider(),
      new UpdateContextMenuItem('剪切', 3),
      new UpdateContextMenuItem('复制', 4),
      new UpdateContextMenuItem('粘贴', 5),
      new ELContextMenuDivider(),
      new UpdateContextMenuItem('查找', 6),
      new UpdateContextMenuItem('查找和替换', 7),
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
  UpdateContextMenu,
};
