import { ELContextMenuItem } from '../contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';

class AutoFillTypeMenuItem extends ELContextMenuItem {

  constructor({ text, value }) {
    super(`${cssPrefix}-auto-fill-menu-item`);
    this.text = text;
    this.value = value;
    this.textEle = h('div', `${cssPrefix}-auto-fill-menu-item-title`);
    this.textEle.text(text);
    this.children(this.textEle);
  }

}

export {
  AutoFillTypeMenuItem,
};
