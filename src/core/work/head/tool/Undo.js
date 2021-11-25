import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class Undo extends Item {

  constructor() {
    super(`${cssPrefix}-tools-undo`);
    this.icon = new Icon('undo');
    this.childrenNodes(this.icon);
  }

}

export { Undo };
