import { Widget } from '../../../libs/Widget';
import { cssPrefix } from '../../../const/Constant';
import { XWorkBottomMenu } from './XWorkBottomMenu';

class XWorkBottom extends Widget {

  constructor(work) {
    super(`${cssPrefix}-work-bottom`);
    this.work = work;
  }

  onAttach() {
    this.bottomMenu = new XWorkBottomMenu(this);
    this.attach(this.bottomMenu);
  }

}

export { XWorkBottom };
