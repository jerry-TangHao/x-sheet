import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { LookContextMenu } from './contextmenu/look/LookContextMenu';

class Look extends Item {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-look`);
    this.setTitle('查看');
    this.options = options;
    this.lookContextMenu = new LookContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
  }

}

export { Look };
