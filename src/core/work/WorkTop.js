import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';
import { TopMenu } from './TopMenu';
import { TopOption } from './TopOption';
import { PlainUtils } from '../../utils/PlainUtils';

const settings = {
  option: {
    show: true,
  },
};

class WorkTop extends Widget {

  constructor(work, options) {
    super(`${cssPrefix}-work-top`);
    this.options = PlainUtils.copy({}, settings, options);
    this.work = work;
  }

  onAttach() {
    this.option = new TopOption(this, this.options.option);
    this.toolsMenu = new TopMenu(this, this.options.menu);
    if (this.options.option.show) {
      this.attach(this.option);
    }
    if (this.options.menu.show) {
      this.attach(this.toolsMenu);
    }
  }

}

export { WorkTop };
