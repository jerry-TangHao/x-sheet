import { Widget } from '../../../libs/Widget';
import { cssPrefix } from '../../../const/Constant';
import { PlainUtils } from '../../../utils/PlainUtils';
import { Icon } from '../../../core/xwork/top/tools/Icon';
import { ColorPicker } from '../ColorPicker';

class ColorItem extends Widget {

  constructor(options) {
    super(`${cssPrefix}-color-array-item`);
    this.options = PlainUtils.copy({
      color: null,
      icon: null,
    }, options);
    this.icon = this.options.icon;
    this.color = PlainUtils.blankClear(this.options.color);
    if (this.icon) {
      this.children(this.options.icon);
    }
    if (this.color) {
      this.css('backgroundColor', this.color);
      if (ColorPicker.isDark(this.options.color)) {
        this.checkedIcon = new Icon('checked-dark');
        this.children(this.checkedIcon);
      } else {
        this.checkedIcon = new Icon('checked-light');
        this.children(this.checkedIcon);
      }
      this.checkedIcon.hide();
    }
  }

  setActive(active) {
    if (this.checkedIcon) {
      if (active) {
        this.checkedIcon.show();
      } else {
        this.checkedIcon.hide();
      }
    }
  }

}

export { ColorItem };
