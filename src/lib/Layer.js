import { Widget } from './Widget';
import { cssPrefix } from '../const/Constant';

class Layer extends Widget {

  constructor(className = '') {
    super(`${cssPrefix}-layer ${className}`);
  }

}

export {Layer}
