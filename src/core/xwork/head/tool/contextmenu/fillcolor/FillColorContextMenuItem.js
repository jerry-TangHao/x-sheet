import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';
import { h } from '../../../../../../lib/Element';

class FillColorContextMenuItem extends ELContextMenuItem {
  constructor(title, icon) {
    super(`${cssPrefix}-fill-color-context-menu-item`);
    this.title = title;
    this.icon = icon;
    if (icon) {
      this.iconElement = h('div', `${cssPrefix}-fill-color-context-menu-item-icon`);
      this.iconElement.children(this.icon);
      this.children(this.iconElement);
    }
    if (title) {
      this.titleElement = h('div', `${cssPrefix}-fill-color-context-menu-item-title`);
      this.titleElement.text(title);
      this.children(this.titleElement);
    }
  }
}

export { FillColorContextMenuItem };
