import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { DropDownItem } from './base/DropDownItem';
import { FixedContextMenu } from './contextmenu/fixed/FixedContextMenu';

class Fixed extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-fixed`);
    this.options = options;
    this.icon = new Icon('freeze');
    this.rowStatus = false;
    this.colStatus = false;
    this.setIcon(this.icon);
    this.fixedContextMenu = new FixedContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  setFixedColStatus(status) {
    const { fixedContextMenu } = this;
    if (status) {
      this.colStatus = true;
      fixedContextMenu.col.setTitle('取消冻结列');
    } else {
      this.colStatus = false;
      fixedContextMenu.col.setTitle('冻结至当前列');
    }
  }

  setFixedRowStatus(status) {
    const { fixedContextMenu } = this;
    if (status) {
      this.rowStatus = true;
      fixedContextMenu.row.setTitle('取消冻结行');
    } else {
      this.rowStatus = false;
      fixedContextMenu.row.setTitle('冻结至当前行');
    }
  }

  destroy() {
    super.destroy();
    this.fixedContextMenu.destroy();
  }

}

export { Fixed };
