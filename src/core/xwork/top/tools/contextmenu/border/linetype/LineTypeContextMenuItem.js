import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { h } from '../../../../../../../libs/Element';
import { ELContextMenuItem } from '../../../../../../../module/contextmenu/ELContextMenuItem';

const pool = [];

class LineTypeContextMenuItem extends ELContextMenuItem {
  constructor(type) {
    super(`${cssPrefix}-font-context-menu-item`);
    this.type = type;
    this.icon = new Icon('checked');
    this.typeIcon = new Icon(type);
    this.typeIcon.setWidth(50);
    this.iconElement = h('div', `${cssPrefix}-font-context-menu-item-icon`);
    this.titleElement = h('div', `${cssPrefix}-font-context-menu-item-title`);
    this.iconElement.children(this.icon);
    this.titleElement.children(this.typeIcon);
    this.children(this.iconElement);
    this.children(this.titleElement);
    pool.push(this);
  }

  setTitle(title) {
    this.title = title;
    this.titleElement.text(title);
  }

  setActive() {
    pool.forEach((item) => {
      item.removeClass('active');
    });
    this.addClass('active');
  }
}

export { LineTypeContextMenuItem };
