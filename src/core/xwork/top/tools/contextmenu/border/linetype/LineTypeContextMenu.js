import { ELContextMenu } from '../../../../../../../module/contextmenu/ELContextMenu';
import { PlainUtils } from '../../../../../../../utils/PlainUtils';
import { cssPrefix, Constant } from '../../../../../../../const/Constant';
import { LineTypeContextMenuItem } from './LineTypeContextMenuItem';
import { XEvent } from '../../../../../../../libs/XEvent';

class LineTypeContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-line-type-context-menu`, PlainUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new LineTypeContextMenuItem('line1'),
      new LineTypeContextMenuItem('line2'),
      new LineTypeContextMenuItem('line3'),
      new LineTypeContextMenuItem('line4'),
      new LineTypeContextMenuItem('line5'),
      new LineTypeContextMenuItem('line6'),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.setActiveByType(this.items[0].type);
    this.bind();
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item);
    });
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.update(item.type);
        item.setActive();
      });
    });
  }

  update(type) {
    const { options } = this;
    options.onUpdate(type);
    this.close();
  }

  setActiveByType(type) {
    this.items.forEach((item) => {
      if (item.type === type) {
        item.setActive();
      }
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { LineTypeContextMenu };
