import { Element, h } from './Element';
import { cssPrefix } from '../const/Constant';
import { XEvent } from './XEvent';

/**
 * Life
 */
class Life extends Element {

  onAttach() { }

}

/**
 * Widget
 */
class Widget extends Life {

  /**
   * Widget
   * @param className
   * @param nodeType
   */
  constructor(className = '', nodeType = "div") {
    if (typeof className === 'string') {
      super(nodeType, `${cssPrefix}-widget ${className}`);
    } else {
      super(className);
    }
  }

  /**
   * 计算鼠标在当前
   * 元素中的位置
   * @param event
   * @param ele
   * @returns {{x: number, y: number}}
   */
  eventXy(event, ele = this) {
    const { top, left } = ele.box();
    return {
      x: event.pageX - left,
      y: event.pageY - top,
    };
  }

  /**
   * 追加节点
   * 触发onAttach事件
   * @param widget
   */
  attach(widget) {
    this.children(widget);
    widget.onAttach(this);
  }

  /**
   * 查找最邻近
   * 的class元素
   * @param clazz
   */
  closestClass(clazz) {
    let node = this;
    while (!h(document.body).is(node)) {
      if (node.hasClass(clazz)) {
        return node;
      }
      node = node.parent();
    }
    return null;
  }

  /**
   * 销毁组件
   */
  destroy() {
    XEvent.unbind(this);
  }

}

const w = (className = '', nodeType = "div") => new Widget(className, nodeType);

export {
  Widget,
  w
};
