import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';
import { h } from '../../../../../../libs/Element';
import { Icon } from '../../Icon';

const pool = [];

class FontContextMenuItem extends ELContextMenuItem {

  constructor(title) {
    super(`${cssPrefix}-font-context-menu-item`);
    this.title = title;
    this.icon = new Icon('checked');
    this.iconElement = h('div', `${cssPrefix}-font-context-menu-item-icon`);
    this.iconElement.children(this.icon);
    this.titleElement = h('div', `${cssPrefix}-font-context-menu-item-title`);
    this.titleElement.text(title);
    this.titleElement.css('font-family', title);
    this.children(this.iconElement);
    this.children(this.titleElement);
    pool.push(this);
  }

  setActive() {
    pool.forEach((item) => {
      item.removeClass('active');
    });
    this.addClass('active');
  }

  setTitle(title) {
    this.title = title;
    this.titleElement.text(title);
  }

}

export { FontContextMenuItem };
