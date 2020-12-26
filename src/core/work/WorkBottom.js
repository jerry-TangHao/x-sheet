import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { BottomMenu } from './BottomMenu';

class WorkBottom extends Widget {

  constructor(work) {
    super(`${cssPrefix}-work-bottom`);
    this.work = work;
  }

  onAttach() {
    this.bottomMenu = new BottomMenu(this);
    this.attach(this.bottomMenu);
  }

}

export { WorkBottom };
