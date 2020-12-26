import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { DropDownItem } from '../../../base/DropDownItem';

class BorderColor extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-border-color`);
    this.icon = new Icon('border-color');
    this.setIcon(this.icon);
    this.setColor('#000000');
  }

  setColor(color) {
    this.icon.css('border-bottom', `3px solid ${color}`);
  }
}

export { BorderColor };
