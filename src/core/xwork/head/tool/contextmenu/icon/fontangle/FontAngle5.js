import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { Item } from '../../../base/Item';

class FontAngle5 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle5`);
    this.icon = new Icon('font-angle5');
    this.childrenNodes(this.icon);
  }
}
export {
  FontAngle5,
};
