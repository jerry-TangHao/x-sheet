import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon8 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border8`);
    this.icon = new Icon('border8');
    this.childrenNodes(this.icon);
  }
}

export { BorderIcon8 };
