import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { XEvent } from '../../../../../../lib/XEvent';
import { LookContextMenuItem } from './LookContextMenuItem';

class LookContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-option-look-context-menu`, SheetUtils.copy({
      autoClose: true,
      onUpdate: () => {},
    }, options));
    this.items = [
      new LookContextMenuItem('网格线', 1),
      new LookContextMenuItem('全屏', 4),
      new LookContextMenuItem('函数', 3),
      new LookContextMenuItem('缩放', 5),
      new LookContextMenuItem('冻结', 2),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }

  update(item) {
    const { options } = this;
    const { autoClose } = options;
    options.onUpdate(item, this);
    if (autoClose) {
      this.close();
    }
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.update(item);
      });
    });
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  LookContextMenu,
};
