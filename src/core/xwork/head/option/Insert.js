import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { InsertContextMenu } from './contextmenu/insert/InsertContextMenu';

class Insert extends Item {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-insert`);
    this.setTitle('插入');
    this.options = options;
    this.insertContextMenu = new InsertContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
  }

}

export { Insert };
