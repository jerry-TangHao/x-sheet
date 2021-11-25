import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';
import { h } from '../../../../../../lib/Element';

class FontAngleValueContextMenuItem extends ELContextMenuItem {

  constructor(angleValue) {
    super(`${cssPrefix}-font-angle-value-context-menu-item`);
    this.angleValue = angleValue;
    this.titleElement = h('div', `${cssPrefix}-font-angle-value-context-menu-item-title`);
    this.titleElement.text(angleValue);
    this.titleElement.css('text-align', 'center');
    this.childrenNodes(this.titleElement);
  }

}

export {
  FontAngleValueContextMenuItem,
};
