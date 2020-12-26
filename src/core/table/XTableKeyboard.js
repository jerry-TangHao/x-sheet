/* global document */
import { XEvent } from '../../lib/XEvent';
import { Constant } from '../../const/Constant';

class XTableKeyboard {

  constructor(table) {
    const { focus } = table;
    this.table = table;
    this.pool = [];
    this.xTableKeyBoardDownHandle = (e) => {
      const { activate } = focus;
      const { keyCode } = e;
      if (activate) {
        const { target } = activate;
        const find = this.find(target);
        if (find && find.keyCode === keyCode) {
          find.callback();
        }
      }
      if (keyCode === 9) {
        e.preventDefault();
      }
    };
    this.bind();
  }

  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.xTableKeyBoardDownHandle);
  }

  bind() {
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.xTableKeyBoardDownHandle);
  }

  find(el) {
    const { pool } = this;
    for (let i = 0; i < pool.length; i += 1) {
      const item = pool[i];
      const { target } = item;
      if (target === el) {
        return item;
      }
    }
    return null;
  }

  register({
    target, keyCode, callback,
  }) {
    this.pool.push({ target, keyCode, callback });
  }

}

export {
  XTableKeyboard,
};
