import { ELContextMenuItem } from '../../../../../component/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../libs/Element';

class FileContextMenuItem extends ELContextMenuItem {

  constructor(text, type) {
    super(`${cssPrefix}-file-context-menu-item`);
    this.text = text;
    this.type = type;
    this.titleElement = h('div', `${cssPrefix}-file-context-menu-item-title`);
    this.titleElement.text(`${text}`);
    this.children(this.titleElement);
  }

}

export {
  FileContextMenuItem,
};
