import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon2 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border2`);
    this.icon = new Icon('border2');
    this.children(this.icon);
  }
}

export { BorderIcon2 };
