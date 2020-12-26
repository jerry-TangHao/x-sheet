import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class FontAngle1 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle1`);
    this.icon = new Icon('font-angle1');
    this.children(this.icon);
  }
}
export {
  FontAngle1,
};
