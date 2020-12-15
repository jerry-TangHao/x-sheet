import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { Item } from '../../../base/Item';

class FontAngle2 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle2`);
    this.icon = new Icon('font-angle2');
    this.children(this.icon);
  }
}
export {
  FontAngle2,
};
