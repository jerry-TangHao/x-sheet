import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { ELContextMenuDivider } from '../../../../../../module/contextmenu/ELContextMenuDivider';
import { FixedContextMenuItem } from './FixedContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';
import { SheetUtils } from '../../../../../../utils/SheetUtils';

class FixedContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-fixed-context-menu`, SheetUtils.copy({
      onUpdate: () => {
      },
    }, options));
    this.row = new FixedContextMenuItem('冻结至当前行');
    this.row1 = new FixedContextMenuItem('冻结1行');
    this.row2 = new FixedContextMenuItem('冻结2行');
    this.col = new FixedContextMenuItem('冻结至当前列');
    this.col1 = new FixedContextMenuItem('冻结1列');
    this.col2 = new FixedContextMenuItem('冻结2列');
    this.addItem(this.row);
    this.addItem(this.row1);
    this.addItem(this.row2);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.col);
    this.addItem(this.col1);
    this.addItem(this.col2);
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.row, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.row1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.row2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.col, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.col1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.col2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
  }

  bind() {
    XEvent.bind(this.row, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { options } = this;
      options.onUpdate('ROW');
      this.close();
    });
    XEvent.bind(this.row1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { options } = this;
      options.onUpdate('ROW1');
      this.close();
    });
    XEvent.bind(this.row2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { options } = this;
      options.onUpdate('ROW2');
      this.close();
    });
    XEvent.bind(this.col, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { options } = this;
      options.onUpdate('COL');
      this.close();
    });
    XEvent.bind(this.col1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { options } = this;
      options.onUpdate('COL1');
      this.close();
    });
    XEvent.bind(this.col2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { options } = this;
      options.onUpdate('COL2');
      this.close();
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  FixedContextMenu,
};
