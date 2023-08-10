import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { RecycleMenuContextMenuItem } from './RecycleMenuContextMenuItem';

export class RecycleMenuContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-recycle-menu-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.recycleItemList = [];
  }

  addMenuItem(menuItem) {
    const recycleMenuitem = new RecycleMenuContextMenuItem(menuItem);
    this.attach(recycleMenuitem);
    this.recycleItemList.push(recycleMenuitem);
  }

  getRecycleSize() {
    return this.recycleItemList.length;
  }

  popRecycleItem() {
    const recycleMenuitem = this.recycleItemList.pop();
    if (recycleMenuitem) {
      recycleMenuitem.remove();
    }
    return recycleMenuitem;
  }

  addRecycleItem(recycleMenuItem) {
    this.append(recycleMenuItem);
    this.recycleItemList.push(recycleMenuItem);
  }
}
