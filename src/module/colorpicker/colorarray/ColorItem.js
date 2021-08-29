import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Icon } from '../../../core/xwork/head/tool/Icon';
import { ColorPicker } from '../ColorPicker';

class ColorItem extends Widget {

  constructor(options) {
    super(`${cssPrefix}-color-array-item`);
    this.options = SheetUtils.copy({
      color: null,
      icon: null,
    }, options);
    this.icon = this.options.icon;
    this.color = SheetUtils.blankClear(this.options.color);
    if (this.icon) {
      this.childrenNodes(this.options.icon);
    }
    if (this.color) {
      this.css('backgroundColor', this.color);
      if (ColorPicker.isDark(this.options.color)) {
        this.checkedIcon = new Icon('checked-dark');
        this.childrenNodes(this.checkedIcon);
      } else {
        this.checkedIcon = new Icon('checked-light');
        this.childrenNodes(this.checkedIcon);
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
