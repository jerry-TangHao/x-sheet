import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';

class FontStrike extends Item {

  constructor() {
    super(`${cssPrefix}-tools-font-strike`);
    this.icon = new Icon('font-strike');
    this.childrenNodes(this.icon);
  }

}

export { FontStrike };
