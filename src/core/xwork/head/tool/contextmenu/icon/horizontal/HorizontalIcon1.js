import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class HorizontalIcon1 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-horizontal1`);
    this.icon = new Icon('align-left');
    this.childrenNodes(this.icon);
  }
}

export { HorizontalIcon1 };
