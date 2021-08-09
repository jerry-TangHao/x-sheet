import { Widget } from '../../../../lib/Widget';
import { XEvent } from '../../../../lib/XEvent';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { SheetUtils } from '../../../../utils/SheetUtils';

let number = 0;
let include = [];

class XWorkTab extends Widget {

  constructor(name, {
    lClickHandle = () => {},
    rClickHandle = () => {},
  } = {}) {
    super(`${cssPrefix}-sheet-tab`);
    this.name = '';
    this.lClickHandle = lClickHandle;
    this.rClickHandle = rClickHandle;
    this.setName(this.getCheckName(name));
    this.bind();
  }

  unbind() {
    XEvent.unbind(this);
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      if (event.button === 0) {
        this.lClickHandle(event);
      }
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.CONTEXT_MENU, (event) => {
      this.rClickHandle(event);
    });
  }

  setName(name) {
    this.name = name;
    this.text(this.name);
  }

  setRClick(handle) {
    this.rClickHandle = handle;
  }

  setLClick(handle) {
    this.lClickHandle = handle;
  }

  getName() {
    number += 1;
    return `Sheet${number}`;
  }

  getCheckName(name) {
    if (SheetUtils.isUnDef(name)) {
      name = this.getName();
    }
    while (include.indexOf(name) > -1) {
      name = this.getName();
    }
    include.push(name);
    return name;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XWorkTab };
