import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { BorderTypeContextMenu } from './contextmenu/border/bordertype/BorderTypeContextMenu';

class Border extends DropDownItem {

  constructor(options = {
    contextMenu: {},
  }) {
    super(`${cssPrefix}-tools-border`);
    this.options = options;
    this.icon = new Icon('border');
    this.setIcon(this.icon);
    this.borderTypeContextMenu = new BorderTypeContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

}

export { Border };
