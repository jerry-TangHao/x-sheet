import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class FontItalic extends Item {

  constructor() {
    super(`${cssPrefix}-tools-font-italic`);
    this.icon = new Icon('font-italic');
    this.childrenNodes(this.icon);
  }

}

export { FontItalic };
