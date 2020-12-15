import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { FontContextMenu } from './contextmenu/font/FontContextMenu';

class Font extends DropDownItem {

  constructor(options = {
    contextMenu: {},
  }) {
    super(`${cssPrefix}-tools-font`);
    this.options = options;
    this.setTitle('Arial');
    this.setWidth(50);
    this.setEllipsis();
    this.fontContextMenu = new FontContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.fontContextMenu.destroy();
  }

}

export { Font };
