import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { FontSizeContextMenuItem } from './FontSizeContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';

class FontSizeContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-size-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontSizeContextMenuItem(10),
      new FontSizeContextMenuItem(13),
      new FontSizeContextMenuItem(16),
      new FontSizeContextMenuItem(18),
      new FontSizeContextMenuItem(24),
      new FontSizeContextMenuItem(32),
      new FontSizeContextMenuItem(48),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    });
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.update(item.size);
      });
    });
  }

  update(size) {
    const { options } = this;
    options.onUpdate(size);
    this.close();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { FontSizeContextMenu };
