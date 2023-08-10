import { Widget } from '../../../../lib/Widget';
import { XEvent } from '../../../../lib/XEvent';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { SheetUtils } from '../../../../utils/SheetUtils';

class XWorkTab extends Widget {

  _setName(name) {
    const root = this.getRootWidget();
    root.tabNameGen.removeName(this.name);
    this.name = root.tabNameGen.genName(name);
    this.editor.text(this.name);
  }

  constructor(name, {
    lClickHandle = () => {},
    rClickHandle = () => {},
  } = {}) {
    super(`${cssPrefix}-sheet-tab`);
    this.name = name;
    this.editor = new Widget(`${cssPrefix}-sheet-tab-editor`, 'span');
    this.lClickHandle = lClickHandle;
    this.rClickHandle = rClickHandle;
    this.attach(this.editor);
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
    this._setName(this.name);
  }

  setName(name) {
    if (SheetUtils.isBlank(name)) {
      name = this.name;
    }
    this._setName(name);
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
    const root = this.getRootWidget();
    super.destroy();
    root.tabNameGen.removeName(this.name);
    this.unbind();
  }

}

export { XWorkTab };
