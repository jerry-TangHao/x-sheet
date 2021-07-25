import { Widget } from '../../../../../libs/Widget';
import { cssPrefix } from '../../../../../const/Constant';

class Item extends Widget {

  constructor(className) {
    super(`${cssPrefix}-tools-item ${className}`);
  }

}

export { Item };
