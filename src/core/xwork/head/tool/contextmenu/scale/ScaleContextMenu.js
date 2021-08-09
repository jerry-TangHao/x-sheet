import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { ScaleContextMenuItem } from './ScaleContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';

class ScaleContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-scale-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new ScaleContextMenuItem(200),
      new ScaleContextMenuItem(150),
      new ScaleContextMenuItem(125),
      new ScaleContextMenuItem(100),
      new ScaleContextMenuItem(90),
      new ScaleContextMenuItem(75),
      new ScaleContextMenuItem(50),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.update(item.scale);
      });
    });
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    });
  }

  update(scale) {
    const { options } = this;
    options.onUpdate(scale);
    this.close();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  ScaleContextMenu,
};
