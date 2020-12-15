import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class HorizontalIcon3 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-horizontal3`);
    this.icon = new Icon('align-right');
    this.children(this.icon);
  }
}

export { HorizontalIcon3 };
