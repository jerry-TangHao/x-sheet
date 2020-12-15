import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class Redo extends Item {

  constructor() {
    super(`${cssPrefix}-tools-redo`);
    this.icon = new Icon('redo');
    this.children(this.icon);
  }

}

export { Redo };
