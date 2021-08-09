import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';

class FontAngleContextMenuItem extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-font-angle-context-menu-item`);
  }

}

export {
  FontAngleContextMenuItem,
};
