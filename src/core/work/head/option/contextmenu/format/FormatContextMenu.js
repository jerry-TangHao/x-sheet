import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';
import { ELContextMenuDivider } from '../../../../../../module/contextmenu/ELContextMenuDivider';

class FormatContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-option-format-context-menu`, SheetUtils.copy({
      autoClose: true,
      onUpdate: () => {},
    }, options));
    this.items = [
      new FormatContextMenuItem('下划线', 3),
      new FormatContextMenuItem('删除线', 4),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('粗体', 1),
      new FormatContextMenuItem('斜体', 2),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('合并单元格', 6),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('对齐方式', 5),
      new FormatContextMenuItem('文本换行', 7),
      new FormatContextMenuItem('文本旋转', 8),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('清除格式', 9),
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
  FormatContextMenu,
};
