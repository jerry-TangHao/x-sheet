import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { FormatContextMenu } from './contextmenu/format/FormatContextMenu';

class Format extends DropDownItem {

  constructor(options = {
    contextMenu: {},
  }) {
    super(`${cssPrefix}-tools-format`);
    this.options = options;
    this.setTitle('常规');
    this.setWidth(50);
    this.setEllipsis();
    this.formatContextMenu = new FormatContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.formatContextMenu.destroy();
  }

}

export { Format };
