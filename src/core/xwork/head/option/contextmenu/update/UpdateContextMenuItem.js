import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';
import { h } from '../../../../../../lib/Element';

class UpdateContextMenuItem extends ELContextMenuItem {

  constructor(text, type) {
    super(`${cssPrefix}-option-update-context-menu-item`);
    this.text = text;
    this.type = type;
    this.titleElement = h('div', `${cssPrefix}-option-update-context-menu-item-title`);
    this.titleElement.text(`${text}`);
    this.childrenNodes(this.titleElement);
  }

}

export {
  UpdateContextMenuItem,
};
