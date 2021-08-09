import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class TextWrappingIcon2 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-text-wrapping2`);
    this.icon = new Icon('overflow');
    this.children(this.icon);
  }
}

export { TextWrappingIcon2 };
