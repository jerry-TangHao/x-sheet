import { ELContextMenuItem } from '../../../../../component/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../lib/Element';

const pool = [];

class FixedContextMenuItem extends ELContextMenuItem {

  constructor(title) {
    super(`${cssPrefix}-fixed-context-menu-item`);
    this.title = title;
    this.titleElement = h('div', `${cssPrefix}-fixed-context-menu-item-title`);
    this.titleElement.text(title);
    this.children(this.titleElement);
    pool.push(this);
  }

  setTitle(title) {
    this.title = title;
    this.titleElement.text(title);
  }

}

export {
  FixedContextMenuItem,
};
