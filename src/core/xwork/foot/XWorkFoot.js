import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { XWorkFootMenu } from './XWorkFootMenu';

class XWorkFoot extends Widget {

  constructor(work) {
    super(`${cssPrefix}-work-bottom`);
    this.work = work;
  }

  onAttach() {
    this.bottomMenu = new XWorkFootMenu(this);
    this.attach(this.bottomMenu);
  }

}

export { XWorkFoot };
