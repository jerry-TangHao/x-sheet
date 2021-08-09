import { ELContextMenuItem } from '../contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';

class OrderZA extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-order-za`);
    this.titleElement = h('div', `${cssPrefix}-filter-data-menu-item-title`);
    this.titleElement.text('以Z->A的顺序排序');
    this.children(this.titleElement);
  }

}

export {
  OrderZA,
};
