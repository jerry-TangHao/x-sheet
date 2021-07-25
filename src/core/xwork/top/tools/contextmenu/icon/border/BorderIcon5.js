import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon5 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border5`);
    this.icon = new Icon('border5');
    this.children(this.icon);
  }
}

export { BorderIcon5 };
