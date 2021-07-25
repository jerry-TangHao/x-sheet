import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';

class ELContextMenuItem extends Widget {

  constructor(className = '') {
    super(`${cssPrefix}-el-context-menu-item hover ${className}`);
  }

}

export { ELContextMenuItem };
