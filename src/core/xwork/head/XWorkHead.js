import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { XWorkHeadMenu } from './XWorkHeadMenu';
import { XWorkHeadOption } from './XWorkHeadOption';
import { SheetUtils } from '../../../utils/SheetUtils';

const settings = {
  option: {
    show: true,
  },
};

class XWorkHead extends Widget {

  constructor(work, options) {
    super(`${cssPrefix}-work-top`);
    this.options = SheetUtils.copy({}, settings, options);
    this.work = work;
  }

  onAttach() {
    this.option = new XWorkHeadOption(this, this.options.option);
    this.toolsMenu = new XWorkHeadMenu(this, this.options.menu);
    if (this.options.option.show) {
      this.attach(this.option);
    }
    if (this.options.menu.show) {
      this.attach(this.toolsMenu);
    }
  }

}

export { XWorkHead };
