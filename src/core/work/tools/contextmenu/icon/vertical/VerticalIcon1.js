import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class VerticalIcon1 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-verticalIcon1`);
    this.icon = new Icon('align-top');
    this.children(this.icon);
  }
}

export { VerticalIcon1 };
