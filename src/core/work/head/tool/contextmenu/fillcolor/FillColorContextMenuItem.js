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
      this.iconElement.childrenNodes(this.icon);
      this.childrenNodes(this.iconElement);
    }
    if (title) {
      this.titleElement = h('div', `${cssPrefix}-fill-color-context-menu-item-title`);
      this.titleElement.text(title);
      this.childrenNodes(this.titleElement);
    }
  }
}

export { FillColorContextMenuItem };
