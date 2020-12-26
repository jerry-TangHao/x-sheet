import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class BorderIcon10 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-border10`);
    this.icon = new Icon('border10');
    this.children(this.icon);
  }
}

export { BorderIcon10 };
