import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class UnderLine extends Item {

  constructor() {
    super(`${cssPrefix}-tools-under-line`);
    this.icon = new Icon('under-line');
    this.children(this.icon);
  }

}

export { UnderLine };
