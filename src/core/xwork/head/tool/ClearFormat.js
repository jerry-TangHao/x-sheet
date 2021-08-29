import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';

class ClearFormat extends Item {

  constructor() {
    super(`${cssPrefix}-tools-clear-format`);
    this.icon = new Icon('clear-format');
    this.childrenNodes(this.icon);
  }

}

export { ClearFormat };
