import { Item } from '../../../base/Item';
import { cssPrefix } from '../../../../../../../const/Constant';
import { Divider } from '../../../base/Divider';

class FontAngleDivider extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-angle-divider`);
    this.children(new Divider());
    this.css('padding-left', '0');
    this.css('padding-right', '0');
    this.css('margin-left', '0');
    this.css('margin-right', '0');
  }
}

export {
  FontAngleDivider,
};
