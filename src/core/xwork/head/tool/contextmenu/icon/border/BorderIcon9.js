import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon9 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border9`);
    this.icon = new Icon('border9');
    this.children(this.icon);
  }
}

export { BorderIcon9 };
