import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { FormatContextMenu } from './contextmenu/format/FormatContextMenu';

class Format extends Item {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-format`);
    this.setTitle('格式');
    this.options = options;
    this.formatContextMenu = new FormatContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
  }

}

export { Format };
