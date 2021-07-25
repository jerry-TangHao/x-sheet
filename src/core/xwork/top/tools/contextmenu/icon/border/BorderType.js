import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { DropDownItem } from '../../../base/DropDownItem';

class BorderType extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-border-type`);
    this.icon = new Icon('border-type');
    this.setIcon(this.icon);
  }
}

export { BorderType };
