import { Item } from './base/Item';
import { cssPrefix } from '../../../const/Constant';

class ForMart extends Item {

  constructor() {
    super(`${cssPrefix}-tools-format`);
    this.setTitle('格式');
  }

}

export { ForMart };
