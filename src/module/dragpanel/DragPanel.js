/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';

import { h } from '../../lib/Element';
import { SheetUtils } from '../../utils/SheetUtils';

let root = SheetUtils.Undef;
let instances = [];

/**
 * DragPanel
 * @author jerry
 * @date 2020/10/19
 */
class DragPanel extends Widget {

  /**
   * DragPanel
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-drag-panel`);
    instances.push(this);
    this.options = SheetUtils.copy({
      position: DragPanel.DRAG_PANEL_POSITION.CENTER,
    }, options);
    this.status = false;
    this.mask = h('div', `${cssPrefix}-drag-panel-mask`);
    this.content = h('div', `${cssPrefix}-drag-panel-content`);
    super.children(this.content);
    this.bind();
  }

  /**
   * 显示弹框
   */
  open() {
    if (this.status === false && root) {
      const { mask } = this;
      root.children(mask);
      root.children(this);
      this.dragPanelLocation();
      this.status = true;
    }
    return this;
  }

  /**
   * 关闭弹框
   */
  close() {
    if (this.status === true && root) {
      const { mask } = this;
      root.remove(this);
      root.remove(mask);
      this.status = false;
    }
    return this;
  }

  /**
   * 卸载事件
   */
  unbind() {
    const { mask } = this;
    XEvent.unbind(mask);
  }

  /**
   * 绑定事件
   */
  bind() {
    const { mask } = this;
    XEvent.bind(mask, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.close();
      e.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      if (evt1.button !== 0) return;
      const downEventXy = this.eventXy(evt1, this);
      XEvent.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const top = evt2.pageY - downEventXy.y;
        const left = evt2.pageX - downEventXy.x;
        this.offset({ top, left });
        evt2.stopPropagation();
      });
      evt1.stopPropagation();
    });
  }

  /**
   * 设置显示位置
   */
  dragPanelLocation() {
    const { options } = this;
    const { position } = options;
    const { width, height } = SheetUtils.viewPort();
    const box = this.box();
    switch (position) {
      case DragPanel.DRAG_PANEL_POSITION.LEFT:
        break;
      case DragPanel.DRAG_PANEL_POSITION.RIGHT:
        break;
      case DragPanel.DRAG_PANEL_POSITION.TOP:
        break;
      case DragPanel.DRAG_PANEL_POSITION.CENTER:
        this.offset({
          left: width / 2 - box.width / 2,
          top: height / 2 - box.height / 2,
        });
        break;
      default: break;
    }
    return this;
  }

  /**
   * 添加子元素
   * @param args
   * @returns {DragPanel}
   */
  children(...args) {
    this.content.children(...args);
    return this;
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    DragPanel.removeInstance(this);
  }

  /**
   * 删除实例
   * @param instance
   */
  static removeInstance(instance) {
    const filter = [];
    instances.forEach((item) => {
      if (item !== instance) {
        filter.push(item);
      }
    });
    instances = filter;
  }

  /**
   * 关闭所有实例
   * @param filter
   */
  static closeAll(filter = []) {
    instances.forEach((item) => {
      if (filter.indexOf(item) === -1) {
        item.close();
      }
    });
  }

  /**
   * 设置根节点
   * @param element
   */
  static setRoot(element) {
    if (element.el) {
      element = h(element.el);
    } else {
      element = h(element);
    }
    root = element;
  }

}
DragPanel.DRAG_PANEL_POSITION = {
  LEFT: 1,
  TOP: 2,
  RIGHT: 3,
  CENTER: 4,
};

export { DragPanel };
