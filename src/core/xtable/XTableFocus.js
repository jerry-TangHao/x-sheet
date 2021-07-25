/* global document */
import { Constant } from '../../const/Constant';
import { XEvent } from '../../libs/XEvent';
import { Element } from '../../libs/Element';
import { PlainUtils } from '../../utils/PlainUtils';

let root = PlainUtils.Nul;
let instance = PlainUtils.Nul;

class XTableFocus {

  static getInstance() {
    if (instance) {
      return instance;
    }
    instance = new XTableFocus();
    return instance;
  }

  static setRoot(element) {
    root = element;
  }

  constructor() {
    this.activate = {};
    this.items = [];
    this.handle = () => {
      this.activate = {};
    };
  }

  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.handle, true);
    this.items.forEach((item) => {
      const { target, callback } = item;
      XEvent.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, callback);
    });
  }

  bind() {
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.handle, true);
  }

  include(el) {
    while (!el.equals(root)) {
      const find = this.exist(el);
      if (find) {
        return find;
      }
      el = el.parent();
    }
    return null;
  }

  exist(el) {
    for (let i = 0, len = this.items.length; i < len; i += 1) {
      const item = this.items[i];
      const { target } = item;
      if (target.equals(el)) {
        return item;
      }
    }
    return null;
  }

  remove(el) {
    this.items = this.items.filter((item) => {
      const { target, callback } = item;
      const equals = target.equals(el);
      if (equals) {
        XEvent.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, callback);
      }
      return equals;
    });
  }

  register({ target }) {
    const callback = (event) => {
      const exist = this.include(Element.wrap(event.target));
      if (exist) {
        this.activate = exist;
      } else {
        this.activate = null;
      }
    };
    this.items.push({ target, callback });
    XEvent.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, callback);
  }

  destroy() {
    this.unbind();
    this.items = [];
  }

}

export {
  XTableFocus,
};
