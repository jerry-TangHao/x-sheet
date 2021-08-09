import { ELContextMenu } from '../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../const/Constant';
import { TabContextMenuItem } from './TabContextMenuItem';
import { XEvent } from '../../../../../lib/XEvent';
import { SheetUtils } from '../../../../../utils/SheetUtils';
import { ELContextMenuDivider } from '../../../../../module/contextmenu/ELContextMenuDivider';

class TabContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-tab-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new TabContextMenuItem('删除', 1),
      new TabContextMenuItem('复制', 2),
      new TabContextMenuItem('颜色', 3),
      new TabContextMenuItem('重命名', 3),
      new ELContextMenuDivider(),
      new TabContextMenuItem('左移', 4),
      new TabContextMenuItem('右移', 5),
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
  TabContextMenu,
};
