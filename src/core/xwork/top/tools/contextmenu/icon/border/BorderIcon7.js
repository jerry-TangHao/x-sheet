import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon7 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border7`);
    this.icon = new Icon('border7');
    this.children(this.icon);
  }
}

export { BorderIcon7 };
