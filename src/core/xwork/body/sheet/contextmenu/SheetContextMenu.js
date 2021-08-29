import { ELContextMenu } from '../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../const/Constant';
import { SheetUtils } from '../../../../../utils/SheetUtils';
import { SheetContextMenuItem } from './SheetContextMenuItem';
import { XEvent } from '../../../../../lib/XEvent';
import { ELContextMenuDivider } from '../../../../../module/contextmenu/ELContextMenuDivider';

class SheetContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-sheet-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new SheetContextMenuItem('复制', 1),
      new SheetContextMenuItem('粘贴', 2),
      new ELContextMenuDivider(),
      new SheetContextMenuItem('插入行', 3),
      new SheetContextMenuItem('插入列', 4),
      new SheetContextMenuItem('删除行', 5),
      new SheetContextMenuItem('删除列', 6),
      new ELContextMenuDivider(),
      new SheetContextMenuItem('插入链接', 7),
    ];
    this.tab = null;
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }


  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    });
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.update(item.name, item.type);
      });
    });
  }

  setTab(tab) {
    this.tab = tab;
  }

  update(name, type) {
    const { options } = this;
    options.onUpdate(name, type);
    this.close();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  SheetContextMenu,
};
