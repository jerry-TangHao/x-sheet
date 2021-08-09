import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';

class ELContextMenuItem extends Widget {

  constructor(className = '') {
    super(`${cssPrefix}-el-context-menu-item hover ${className}`);
  }

}

export { ELContextMenuItem };
