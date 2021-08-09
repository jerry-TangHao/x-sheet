import { ELContextMenuItem } from '../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../lib/Element';

class SheetContextMenuItem extends ELContextMenuItem {

  constructor(name, type) {
    super(`${cssPrefix}-sheet-context-menu-item`);
    this.name = name;
    this.type = type;
    this.titleElement = h('div', `${cssPrefix}-sheet-context-menu-item-title`);
    this.titleElement.text(name);
    this.children(this.titleElement);
  }

}

export {
  SheetContextMenuItem,
};
