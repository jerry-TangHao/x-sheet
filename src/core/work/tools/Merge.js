import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class Merge extends Item {

  constructor() {
    super(`${cssPrefix}-tools-merge`);
    this.icon = new Icon('merge');
    this.children(this.icon);
  }

}

export { Merge };
