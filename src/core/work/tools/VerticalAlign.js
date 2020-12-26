import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { VerticalContextMenu } from './contextmenu/vertical/VerticalContextMenu';

class VerticalAlign extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-vertical-align`);
    this.options = options;
    this.icon = new Icon('align-middle');
    this.setIcon(this.icon);
    this.verticalContextMenu = new VerticalContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.verticalContextMenu.destroy();
  }

}

export { VerticalAlign };
