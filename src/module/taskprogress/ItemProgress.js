import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';

class ItemProgress extends Widget {

  constructor() {
    super(`${cssPrefix}-item-progress`);
  }

}

export {
  ItemProgress,
};
