import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { XWorkFootMenu } from './XWorkFootMenu';

class XWorkFoot extends Widget {

  constructor(work) {
    super(`${cssPrefix}-work-bottom`);
    this.work = work;
    this.bottomMenu = new XWorkFootMenu(this);
  }

  onAttach() {
    this.attach(this.bottomMenu);
  }

  destroy() {
    super.destroy();
    this.bottomMenu.destroy();
  }
}

export { XWorkFoot };
