import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { FillColorContextMenu } from './contextmenu/fillcolor/FillColorContextMenu';

class FillColor extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-fill-color`);
    this.options = options;
    this.icon = new Icon('fill-color');
    this.setIcon(this.icon);
    this.setColor('rgb(255, 255, 255)');
    this.fillColorContextMenu = new FillColorContextMenu({
      el: this,
      ...this.options.contextMenu,
    }).parentWidget(this);
    this.fillColorContextMenu.setActiveByColor('rgb(255, 255, 255)');
  }

  setColor(color) {
    this.icon.css('border-bottom', `3px solid ${color}`);
  }

  destroy() {
    super.destroy();
    this.fillColorContextMenu.destroy();
  }

}

export { FillColor };
