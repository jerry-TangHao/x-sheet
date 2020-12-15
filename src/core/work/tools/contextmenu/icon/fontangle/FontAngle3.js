import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { Item } from '../../../base/Item';

class FontAngle3 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle3`);
    this.icon = new Icon('font-angle3');
    this.children(this.icon);
  }
}
export {
  FontAngle3,
};
