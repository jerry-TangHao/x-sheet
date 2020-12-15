import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class VerticalIcon2 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-verticalIcon2`);
    this.icon = new Icon('align-middle');
    this.children(this.icon);
  }
}

export { VerticalIcon2 };
