import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { FontAngleValueContextMenuItem } from './FontAngleValueContextMenuItem';
import { Constant, cssPrefix } from '../../../../../../const/Constant';
import { XEvent } from '../../../../../../libs/XEvent';
import { PlainUtils } from '../../../../../../utils/PlainUtils';

class FontAngleValueContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-angle-value-context-menu`, PlainUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontAngleValueContextMenuItem(-90),
      new FontAngleValueContextMenuItem(-75),
      new FontAngleValueContextMenuItem(-60),
      new FontAngleValueContextMenuItem(-45),
      new FontAngleValueContextMenuItem(-30),
      new FontAngleValueContextMenuItem(-15),
      new FontAngleValueContextMenuItem(0),
      new FontAngleValueContextMenuItem(15),
      new FontAngleValueContextMenuItem(30),
      new FontAngleValueContextMenuItem(45),
      new FontAngleValueContextMenuItem(60),
      new FontAngleValueContextMenuItem(75),
      new FontAngleValueContextMenuItem(90),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.bind();
  }

  unbind() {
    const { items } = this;
    items.forEach((item) => {
      XEvent.unbind(item);
    });
  }

  bind() {
    const { items } = this;
    items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.options.onUpdate(item);
        this.close();
      });
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  FontAngleValueContextMenu,
};
