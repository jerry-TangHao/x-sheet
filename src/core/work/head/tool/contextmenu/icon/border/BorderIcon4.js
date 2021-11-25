import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon4 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border4`);
    this.icon = new Icon('border4');
    this.childrenNodes(this.icon);
  }
}

export { BorderIcon4 };
