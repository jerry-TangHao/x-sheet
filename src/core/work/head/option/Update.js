import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { UpdateContextMenu } from './contextmenu/update/UpdateContextMenu';

class Update extends Item {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-update`);
    this.setTitle('编辑');
    this.options = options;
    this.updateContextMenu = new UpdateContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
  }

}

export { Update };
