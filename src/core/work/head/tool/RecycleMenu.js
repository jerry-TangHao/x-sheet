import { Constant, cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';
import { RecycleMenuContextMenu } from './contextmenu/recyclemenu/RecycleMenuContextMenu';
import { XEvent } from '../../../../lib/XEvent';
import { Throttle } from '../../../../lib/Throttle';

class XWorkHeadMenuRecycleHelper {
  constructor(recycleMenuItem) {
    const headMenu = recycleMenuItem.headMenu;
    const attach = headMenu.attach;
    this.menuItems = [];
    this.recycleMenuItem = recycleMenuItem;
    headMenu.attach = (menuItem) => {
      if (menuItem === recycleMenuItem) {
        attach.call(headMenu, menuItem);
        return;
      }
      this.menuItems.push(menuItem);
      attach.call(headMenu, menuItem);
    };
  }

  popMenuItem() {
    const menuItem = this.menuItems.pop();
    if (menuItem) {
      menuItem.remove();
    }
    return menuItem;
  }

  addMenuItem(menuItem) {
    this.menuItems.push(menuItem);
    this.recycleMenuItem.before(menuItem);
  }

  getHeadMenuWidth() {
    return this.recycleMenuItem.headMenu.box().width;
  }

  getContentWidth() {
    return this.recycleMenuItem.headMenu.content.box().width;
  }
}

class RecycleMenu extends Item {

  constructor(headMenu, options = {
    enable: true,
  }) {
    super(`${cssPrefix}-tools-recycle-menu`);
    const throttle = new Throttle();
    this.options = options;
    this.icon = new Icon('recycle-menu');
    this.headMenu = headMenu;
    this.helper = new XWorkHeadMenuRecycleHelper(this);
    this.recycleContextMenu = new RecycleMenuContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
    this.calculate = () => {
      throttle.action(() => {
        this.dispatch();
      });
    };
    this.childrenNodes(this.icon);
    this.bind();
  }

  onAttach() {
    super.onAttach();
    this.oldHeadMaxWidth = Number.MAX;
    this.dispatch();
  }

  bind() {
    super.bind();
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.calculate);
  }

  unbind() {
    XEvent.unbind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.calculate);
  }

  dispatch() {
    if (this.options.enable) {
      this.show();
      while (this.helper.getHeadMenuWidth() > this.helper.getContentWidth()) {
        const recycleItem = this.recycleContextMenu.popRecycleItem();
        this.helper.addMenuItem(recycleItem.menuItem);
        if (this.recycleContextMenu.getRecycleSize() === 0) {
          break;
        }
      }
      while (this.helper.getHeadMenuWidth() < this.helper.getContentWidth()) {
        const menuItem = this.helper.popMenuItem();
        this.recycleContextMenu.addMenuItem(menuItem);
      }
      if (this.recycleContextMenu.getRecycleSize() > 0) {
        this.show();
      } else {
        this.hide();
      }
    } else {
      this.hide();
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { RecycleMenu };
