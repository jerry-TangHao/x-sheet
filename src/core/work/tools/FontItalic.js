import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class FontItalic extends Item {

  constructor() {
    super(`${cssPrefix}-tools-font-italic`);
    this.icon = new Icon('font-italic');
    this.children(this.icon);
  }

}

export { FontItalic };
