import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon1 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border1`);
    this.icon = new Icon('border1');
    this.childrenNodes(this.icon);
  }
}

export { BorderIcon1 };
