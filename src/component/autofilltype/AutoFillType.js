import { Constant, cssPrefix } from '../../const/Constant';
import { ELContextMenu } from '../contextmenu/ELContextMenu';
import { XEvent } from '../../libs/XEvent';
import { AutoFillTypeMenu } from './AutoFillTypeMenu';

class AutoFillType extends ELContextMenu {

  constructor(options = {
    onUpdate: () => {},
  }) {
    super(`${cssPrefix}-auto-fill-type`, options);
    this.autoFillTypeMenu = new AutoFillTypeMenu({
      el: this,
      onUpdate: (menu) => {
        this.options.onUpdate(menu);
        this.autoFillTypeMenu.close();
        this.close();
      },
    });
    this.bind();
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.autoFillTypeMenu.open();
    });
  }

  destroy() {
    super.destroy();
    this.autoFillTypeMenu.destroy();
  }

}

export {
  AutoFillType,
};
