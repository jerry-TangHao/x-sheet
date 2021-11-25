import { Item } from './Item';
import { cssPrefix } from '../../../../../const/Constant';

class ToggleItem extends Item {

  constructor(className) {
    super(`${cssPrefix}-tools-toggle-item ${className}`);
  }

}

export { ToggleItem };
