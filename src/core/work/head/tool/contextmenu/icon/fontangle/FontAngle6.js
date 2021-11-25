import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';

class FontAngle6 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle6`);
    this.icon = new Icon('font-angle6');
    this.childrenNodes(this.icon);
  }
}
export {
  FontAngle6,
};
