/* global document */
import { Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { SheetUtils } from '../../utils/SheetUtils';

/**
 * 键盘事件注册
 */
class XTableKeyboard {

  /**
   * XTableKeyboard
   * @param table
   */
  constructor(table) {
    const { widgetFocus } = table;
    this.table = table;
    this.items = [];
    this.keyCode = '';
    this.doHandle = (event) => {
      const { keyCode } = event;
      const { activate } = widgetFocus;
      if (!`${this.keyCode}`.includes(`${keyCode}`)) {
        this.keyCode = `${this.keyCode}${keyCode}`;
      }
      if (activate) {
        const { target } = activate;
        const find = this.find(target);
        if (find) {
          const { response } = find;
          const flagCode = SheetUtils.parseInt(this.keyCode);
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

  /**
   * 解绑事件
   */
  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.doHandle);
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.upHandle);
  }

  /**
   * 绑定事件
   */
  bind() {
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.doHandle);
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_UP, this.upHandle);
  }

  /**
   * 查找组件的索引
   * @param el
   * @returns {number}
   */
  findIndex(el) {
    const { items } = this;
    for (let i = 0, len = items.length; i < len; i += 1) {
      const item = items[i];
      const { target } = item;
      if (target === el) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 查找组件节点
   * @param el
   * @returns {null|*}
   */
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

  /**
   * 转发到其他组件
   * @param el
   * @param event
   */
  forward({
    target, event,
  }) {
    const find = this.find(target);
    if (find) {
      const { response } = find;
      const flagCode = SheetUtils.parseInt(this.keyCode);
      response.forEach((item) => {
        if (item.keyCode(flagCode, event)) {
          item.handle(event);
        }
      });
    }
  }

  /**
   * 注册组件元素
   * @param response
   * @param target
   */
  register({
    response = [], target = null,
  }) {
    let find = this.find(target);
    if (find) {
      find.response = find.response.concat(response);
    } else {
      this.items.push({
        target, response,
      });
    }
  }

  /**
   * 删除组件元素
   * @param target
   */
  remove(target) {
    const index = this.findIndex(target);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  /**
   * 删除响应处理器
   * @param target
   * @param response
   */
  removeResponse({
    target, item,
  }) {
    let find = this.find(target);
    if (find) {
      const { response } = find;
      find.response = response.filter(i => i !== item);
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.unbind();
  }

}

export {
  XTableKeyboard,
};
