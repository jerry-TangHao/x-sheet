import { Widget } from '../../../../lib/Widget';
import { XEvent } from '../../../../lib/XEvent';
import { Constant, cssPrefix } from '../../../../const/Constant';

class XWorkTab extends Widget {

  constructor(name, {
    lClickHandle = () => {},
    rClickHandle = () => {},
  } = {}) {
    super(`${cssPrefix}-sheet-tab`);
    this.name = name;
    this.lClickHandle = lClickHandle;
    this.rClickHandle = rClickHandle;
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

  onAttach() {
    super.onAttach();
    const root = this.getRootWidget();
    this.setName(root.tabNameGen.genName(this.name));
  }

  setName(name) {
    this.name = name;
    this.text(this.name);
  }

  getName() {
    return this.name;
  }

  setRClick(handle) {
    this.rClickHandle = handle;
  }

  setLClick(handle) {
    this.lClickHandle = handle;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XWorkTab };
