import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { HorizontalContextMenu } from './contextmenu/horizontal/HorizontalContextMenu';

class HorizontalAlign extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-horizontal-align`);
    this.options = options;
    this.icon = new Icon('align-left');
    this.setIcon(this.icon);
    this.horizontalContextMenu = new HorizontalContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.horizontalContextMenu.destroy();
  }

}
export { HorizontalAlign };
