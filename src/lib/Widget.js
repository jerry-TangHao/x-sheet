/* global document */

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
   * @param $$rootFlag
   */
  constructor(className = '', nodeType = 'div', $$rootFlag = false) {
    if (typeof className === 'string') {
      super(nodeType, `${cssPrefix}-widget ${className}`);
    } else {
      super(className);
    }
    this.$$rootFlag = $$rootFlag;
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
   * 获取 root widget
   */
  getRootWidget() {
    let parent = this.data('parent');
    while (parent && !parent.$$rootFlag) {
      parent = parent.data('parent');
    }
    return parent;
  }

  /**
   * 绑定处理事件
   */
  bind() {

  }

  /**
   * 解绑事件处理
   */
  unbind() {
    XEvent.unbind(this);
  }

  /**
   * 追加节点
   * 触发onAttach事件
   * @param widget
   */
  attach(widget) {
    this.childrenNodes(widget);
    widget.parentWidget(this);
    widget.onAttach(this);
  }

  /**
   * 设置 parent widget
   * @param widget
   */
  parentWidget(widget) {
    if (widget) {
      this.data('parent', widget);
      return this;
    }
    return this.data('parent');
  }

  /**
   * 计算鼠标在当前
   * 元素中的位置
   * @param event
   * @param elem
   * @returns {{x: number, y: number}}
   */
  eventXy(event, elem = this) {
    const { top, left } = elem.box();
    return {
      y: event.clientY - top,
      x: event.clientX - left,
    };
  }

  /**
   * 销毁组件
   */
  destroy() {
    this.unbind();
    this.remove();
  }

}

const w = (className = '', nodeType = 'div') => new Widget(className, nodeType);

export {
  Widget,
  w,
};
