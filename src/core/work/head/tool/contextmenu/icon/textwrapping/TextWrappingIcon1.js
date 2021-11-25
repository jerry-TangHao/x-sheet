import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { Item } from '../../../base/Item';

class TextWrappingIcon1 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-text-wrapping1`);
    this.icon = new Icon('truncate');
    this.childrenNodes(this.icon);
  }
}

export { TextWrappingIcon1 };
