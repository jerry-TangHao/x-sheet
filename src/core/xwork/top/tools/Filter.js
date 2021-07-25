import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class Filter extends Item {

  constructor() {
    super(`${cssPrefix}-tools-filter`);
    this.icon = new Icon('filter');
    this.children(this.icon);
  }

}

export { Filter };
