import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';

class RecycleMenuContextMenuItem extends ELContextMenuItem {
  constructor(menuItem) {
    super(`${cssPrefix}-recycle-menu-context-menu-item`);
    this.menuItem = menuItem;
  }

  onAttach() {
    super.onAttach();
    this.attach(this.menuItem);
  }
}

export { RecycleMenuContextMenuItem };
