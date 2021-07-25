import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { FontAngleContextMenu } from './contextmenu/fontangle/FontAngleContextMenu';

class FontAngle extends DropDownItem {

  constructor(options = {
    contextMenu: {},
  }) {
    super(`${cssPrefix}-tools-angle`);
    this.options = options;
    this.icon = new Icon('angle');
    this.setIcon(this.icon);
    this.fontAngleContextMenu = new FontAngleContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  setValue(value) {
    this.fontAngleContextMenu.setValue(value);
  }

  destroy() {
    super.destroy();
    this.fontAngleContextMenu.destroy();
  }

}

export {
  FontAngle,
};
