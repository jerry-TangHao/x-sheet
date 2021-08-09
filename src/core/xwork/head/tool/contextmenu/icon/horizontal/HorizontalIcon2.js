import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class HorizontalIcon2 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-horizontal2`);
    this.icon = new Icon('align-center');
    this.children(this.icon);
  }
}

export { HorizontalIcon2 };
