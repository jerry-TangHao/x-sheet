import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { DropDownItem } from './base/DropDownItem';
import { TextWrappingContextMenu } from './contextmenu/textwrapping/TextWrappingContextMenu';

class TextWrapping extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-text-wrapping`);
    this.options = options;
    this.icon = new Icon('text-wrap');
    this.setIcon(this.icon);
    this.textWrappingContextMenu = new TextWrappingContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.textWrappingContextMenu.destroy();
  }

}

export { TextWrapping };
