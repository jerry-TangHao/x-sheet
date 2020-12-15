import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class FontBold extends Item {

  constructor() {
    super(`${cssPrefix}-tools-font-bold`);
    this.icon = new Icon('font-bold');
    this.children(this.icon);
  }

}

export { FontBold };
