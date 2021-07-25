import { ELContextMenu } from '../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../const/Constant';

class TabContextMenu extends ELContextMenu {

  constructor() {
    super(`${cssPrefix}-tab-context-menu`);
  }

}

export {
  TabContextMenu,
};
