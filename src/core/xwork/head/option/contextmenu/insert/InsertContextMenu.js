import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { InsertContextMenuItem } from './InsertContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';
import { UpdateContextMenuItem } from '../update/UpdateContextMenuItem';
import { ELContextMenuDivider } from '../../../../../../module/contextmenu/ELContextMenuDivider';

class InsertContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-option-insert-context-menu`, SheetUtils.copy({
      autoClose: true,
      onUpdate: () => {},
    }, options));
    this.items = [
      new InsertContextMenuItem('复选框', 3),
      new InsertContextMenuItem('单选框', 4),
      new InsertContextMenuItem('下拉框', 5),
      new ELContextMenuDivider(),
      new InsertContextMenuItem('函数', 1),
      new InsertContextMenuItem('链接', 2),
      new ELContextMenuDivider(),
      new UpdateContextMenuItem('绘图', 6),
      new UpdateContextMenuItem('图片', 7),
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
  InsertContextMenu,
};
