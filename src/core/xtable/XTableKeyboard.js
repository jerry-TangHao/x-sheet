/* global document */
import { XEvent } from '../../libs/XEvent';
import { Constant } from '../../const/Constant';
import { PlainUtils } from '../../utils/PlainUtils';

class XTableKeyboard {

  constructor(table) {
    const { focus } = table;
    this.table = table;
    this.items = [];
    this.keyCode = '';
    this.downHandle = (event) => {
      const { activate } = focus;
      const { keyCode } = event;
      if (!`${this.keyCode}`.includes(`${keyCode}`)) {
        this.keyCode = `${this.keyCode}${keyCode}`;
      }
      if (activate) {
        const { target } = activate;
        const find = this.find(target);
        if (find) {
          const { response } = find;
          const flagCode = PlainUtils.parseInt(this.keyCode);
          response.forEach((item) => {
            if (item.keyCode(flagCode, event)) {
              item.handle(event);
            }
          });
        }
      }
    };
    this.upHandle = (event) => {
      const { keyCode } = event;
      this.keyCode = `${this.keyCode}`.replace(`${keyCode}`, '');
    };
    this.bind();
  }

  bind() {
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.downHandle);
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_UP, this.upHandle);
  }

  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.downHandle);
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.upHandle);
  }

  find(el) {
    const { items } = this;
    for (let i = 0, len = items.length; i < len; i += 1) {
      const item = items[i];
      const { target } = item;
      if (target === el) {
        return item;
      }
    }
    return null;
  }

  register({
    target = null, response = [],
  }) {
    this.items.push({
      target, response,
    });
  }

  destroy() {
    this.unbind();
  }

}

export {
  XTableKeyboard,
};
