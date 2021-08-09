import { h } from '../../../../../../lib/Element';
import { cssPrefix } from '../../../../../../const/Constant';
import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { Icon } from '../../Icon';

const pool = [];

class FormatContextMenuItem extends ELContextMenuItem {
  constructor(title, desc) {
    super(`${cssPrefix}-format-context-menu-item`);
    this.title = title;
    this.desc = desc;
    this.icon = new Icon('checked');
    this.iconElement = h('div', `${cssPrefix}-format-context-menu-item-icon`);
    this.iconElement.children(this.icon);
    this.titleElement = h('div', `${cssPrefix}-format-context-menu-item-title`);
    this.descElement = h('div', `${cssPrefix}-format-context-menu-item-desc`);
    this.titleElement.text(title);
    this.descElement.text(desc);
    this.children(this.iconElement);
    this.children(this.titleElement);
    this.children(this.descElement);
    pool.push(this);
  }

  setTitle(title) {
    this.titleElement.text(title);
  }

  setDesc(desc) {
    this.descElement.text(desc);
  }

  setActive() {
    pool.forEach((item) => {
      item.removeClass('active');
    });
    this.addClass('active');
  }
}

export { FormatContextMenuItem };
