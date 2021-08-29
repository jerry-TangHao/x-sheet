import { ELContextMenu } from '../../contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../const/Constant';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';

class SelectContextMenu extends ELContextMenu {

  constructor(options) {
    super(`${cssPrefix}-form-select-menu`, SheetUtils.copy({
      autoHeight: true,
      onUpdate: () => {},
    }, options));
    this.items = [];
    this.elPopUp.offset({
      width: 200,
    });
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item);
    });
  }

  bind(item) {
    XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdate(item);
      this.close();
    });
  }

  addItem(item) {
    this.bind(item);
    this.items.push(item);
    this.childrenNodes(item);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  SelectContextMenu,
};
