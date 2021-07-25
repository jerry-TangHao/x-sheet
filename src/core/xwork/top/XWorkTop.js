import { Widget } from '../../../libs/Widget';
import { cssPrefix } from '../../../const/Constant';
import { XWorkTopMenu } from './XWorkTopMenu';
import { XBookTopOption } from './XWorkTopOption';
import { PlainUtils } from '../../../utils/PlainUtils';

const settings = {
  option: {
    show: true,
  },
};

class XWorkTop extends Widget {

  constructor(work, options) {
    super(`${cssPrefix}-work-top`);
    this.options = PlainUtils.copy({}, settings, options);
    this.work = work;
  }

  onAttach() {
    this.option = new XBookTopOption(this, this.options.option);
    this.toolsMenu = new XWorkTopMenu(this, this.options.menu);
    if (this.options.option.show) {
      this.attach(this.option);
    }
    if (this.options.menu.show) {
      this.attach(this.toolsMenu);
    }
  }

}

export { XWorkTop };
