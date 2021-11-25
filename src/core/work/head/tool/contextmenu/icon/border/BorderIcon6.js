import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon6 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border6`);
    this.icon = new Icon('border6');
    this.childrenNodes(this.icon);
  }
}

export { BorderIcon6 };
