import { ELContextMenuItem } from '../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';

class TabContextMenuItem extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-tab-context-menu-item`);
  }

}

export {
  TabContextMenuItem,
};
