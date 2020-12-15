import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { TopMenu } from './TopMenu';
import { TopOption } from './TopOption';

class WorkTop extends Widget {

  constructor(work) {
    super(`${cssPrefix}-work-top`);
    this.work = work;
  }

  onAttach() {
    this.toolsMenu = new TopMenu(this);
    this.option = new TopOption(this);
    this.attach(this.option);
    this.attach(this.toolsMenu);
  }

}

export { WorkTop };
