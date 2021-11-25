import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { FontColorContextMenu } from './contextmenu/fontcolor/FontColorContextMenu';

class FontColor extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-font-color`);
    this.options = options;
    this.icon = new Icon('color');
    this.setIcon(this.icon);
    this.setColor('rgb(0,0,0)');
    this.fontColorContextMenu = new FontColorContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
    this.fontColorContextMenu.setActiveByColor('rgb(0,0,0)');
  }

  setColor(color) {
    this.icon.css('border-bottom', `3px solid ${color}`);
  }

  destroy() {
    super.destroy();
    this.fontColorContextMenu.destroy();
  }

}

export { FontColor };
