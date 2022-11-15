import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';

class RecycleMenuContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-recycle-menu-context-menu-item`);
  }
}

export { RecycleMenuContextMenuItem };
