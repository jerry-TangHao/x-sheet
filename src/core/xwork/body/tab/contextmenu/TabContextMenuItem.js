import { ELContextMenuItem } from '../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../lib/Element';

class TabContextMenuItem extends ELContextMenuItem {

  constructor(name, type) {
    super(`${cssPrefix}-tab-context-menu-item`);
    this.name = name;
    this.type = type;
    this.titleElement = h('div', `${cssPrefix}-tab-context-menu-item-title`);
    this.titleElement.text(name);
    this.childrenNodes(this.titleElement);
  }

}

export {
  TabContextMenuItem,
};
