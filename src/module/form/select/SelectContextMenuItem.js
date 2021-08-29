import { ELContextMenuItem } from '../../contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';

class SelectContextMenuItem extends ELContextMenuItem {

  constructor({
    text = '', value = '',
  }) {
    super(`${cssPrefix}-form-select-menu-item`);
    this.value = value;
    this.text = text;
    this.textEle = h('div', `${cssPrefix}-form-select-menu-item-title`);
    this.textEle.text(text);
    this.childrenNodes(this.textEle);
  }

}

export {
  SelectContextMenuItem,
};
