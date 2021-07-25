import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { Item } from '../../../base/Item';

class FontAngle4 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle4`);
    this.icon = new Icon('font-angle4');
    this.children(this.icon);
  }
}
export {
  FontAngle4,
};
