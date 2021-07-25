import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { PlainUtils } from '../../../../../../utils/PlainUtils';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { FontSizeContextMenuItem } from './FontSizeContextMenuItem';
import { XEvent } from '../../../../../../libs/XEvent';

class FontSizeContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-size-context-menu`, PlainUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontSizeContextMenuItem(6),
      new FontSizeContextMenuItem(7),
      new FontSizeContextMenuItem(8),
      new FontSizeContextMenuItem(9),
      new FontSizeContextMenuItem(10),
      new FontSizeContextMenuItem(11),
      new FontSizeContextMenuItem(12),
      new FontSizeContextMenuItem(14),
      new FontSizeContextMenuItem(15),
      new FontSizeContextMenuItem(18),
      new FontSizeContextMenuItem(24),
      new FontSizeContextMenuItem(36),
      new FontSizeContextMenuItem(500),
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
