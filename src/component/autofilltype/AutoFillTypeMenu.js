import { ELContextMenu } from '../contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../const/Constant';
import { AutoFillTypeMenuItem } from './AutoFillTypeMenuItem';
import { XEvent } from '../../lib/XEvent';

class AutoFillTypeMenu extends ELContextMenu {

  constructor(options = {
    onUpdate: () => {},
  }) {
    super(`${cssPrefix}-auto-fill-menu`, options);
    this.addItem(new AutoFillTypeMenuItem({ text: '以序列的方式填充', value: AutoFillTypeMenu.FILL_TYPE.SERIALIZE }).attr('title', '只有在起始单元格内容为数字时才生效'));
    this.addItem(new AutoFillTypeMenuItem({ text: '填充单元格内容', value: AutoFillTypeMenu.FILL_TYPE.FILLING }).attr('title', '默认使用内容填充'));
    this.bind();
  }

  unbind() {
    this.menus.forEach((menu) => {
      XEvent.unbind(menu);
    });
  }

  bind() {
    this.menus.forEach((menu) => {
      XEvent.bind(menu, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.options.onUpdate(menu);
      });
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}
AutoFillTypeMenu.FILL_TYPE = {
  SERIALIZE: 1, FILLING: 2,
};

export {
  AutoFillTypeMenu,
};
