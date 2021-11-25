import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { Item } from '../../../base/Item';

class TextWrappingIcon3 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-text-wrapping3`);
    this.icon = new Icon('wrap');
    this.childrenNodes(this.icon);
  }
}

export { TextWrappingIcon3 };
