import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon3 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border3`);
    this.icon = new Icon('border3');
    this.children(this.icon);
  }
}

export { BorderIcon3 };
