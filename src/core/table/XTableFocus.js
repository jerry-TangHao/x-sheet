/* global document */
import { Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { Element } from '../../lib/Element';

class XTableFocus {

  constructor(table) {
    this.table = table;
    this.pool = [];
    this.activate = {};
    this.xTableFocusDownHandle = () => {
      this.activate = {};
    };
    this.bind();
  }

  remove(target) {
    if (!(target instanceof Element)) {
      throw new TypeError(' error type not Element ');
    }
    const pool = [];
    for (let i = 0; i < this.pool.length; i += 1) {
      const item = this.pool[i];
      if (item.target.el !== target.el) {
        pool.push(item);
      }
    }
    this.pool = pool;
  }

  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN,
      this.xTableFocusDownHandle, true);
  }

  bind() {
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN,
      this.xTableFocusDownHandle, true);
  }

  add(item) {
    // 是否是Element
    if (!(item.target instanceof Element)) {
      return false;
    }
    // 是否已经注册
    const find = this.findByNode(item.target);
    if (find) {
      return false;
    }
    // 记录注册的元素
    this.pool.push(item);
    if (item.focus) {
      this.activate = this.pool[this.pool.length - 1];
    }
    return true;
  }

  register({
    attr = {},
    target,
    stop = false,
    focus = false,
  }) {
    if (this.add({
      attr, target, focus, stop,
    })) {
      XEvent.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
        const alike = this.findByChild(e.target);
        if (alike) {
          this.activate = alike;
          if (stop) {
            e.stopPropagation();
          }
        } else {
          this.activate = null;
        }
      });
    }
  }

  findByNode(el) {
    for (let i = 0; i < this.pool.length; i += 1) {
      const item = this.pool[i];
      if (item.target.el === el) {
        return item;
      }
    }
    return null;
  }

  findByChild(el) {
    const { table } = this;
    const root = table.el.parentNode;
    while (el !== root) {
      const find = this.findByNode(el);
      if (find) {
        return find;
      }
      el = el.parentNode;
    }
    return null;
  }

}

export { XTableFocus };
