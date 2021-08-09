import { cssPrefix } from '../../const/Constant';
import { Widget } from '../../lib/Widget';
import { ElPopUp } from '../elpopup/ElPopUp';
import { SheetUtils } from '../../utils/SheetUtils';

class ELContextMenu extends Widget {

  constructor(className = '', options = {}) {
    super(`${cssPrefix}-el-context-menu ${className}`);
    this.options = SheetUtils.copy({}, options);
    this.menus = [];
    this.elPopUp = new ElPopUp(this.options);
    this.elPopUp.children(this);
  }

  isClose() {
    return this.elPopUp.status === false;
  }

  addItem(item) {
    const { menus } = this;
    menus.push(item);
    this.children(item);
    return this;
  }

  open() {
    this.elPopUp.open();
    return this;
  }

  openByMouse(event) {
    this.elPopUp.openByMouse(event);
    return this;
  }

  close() {
    this.elPopUp.close();
    return this;
  }

  setEL(el) {
    this.elPopUp.setEL(el);
  }

  destroy() {
    super.destroy();
    this.elPopUp.destroy();
  }

}

export { ELContextMenu };
