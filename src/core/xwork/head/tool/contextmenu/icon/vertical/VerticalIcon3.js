import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class VerticalIcon3 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-verticalIcon3`);
    this.icon = new Icon('align-bottom');
    this.childrenNodes(this.icon);
  }
}

export { VerticalIcon3 };
