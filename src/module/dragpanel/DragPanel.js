/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';

import { h } from '../../lib/Element';
import { SheetUtils } from '../../utils/SheetUtils';

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
    super.childrenNodes(this.content);
    this.bind();
  }

  /**
   * 显示弹框
   */
  open() {
    const root = this.getRootWidget();
    const { mask } = this;
    if (this.status === false && root) {
      this.status = true;
      root.childrenNodes(mask);
      root.childrenNodes(this);
      this.dragPanelLocation();
    }
    return this;
  }

  /**
   * 关闭弹框
   */
  close() {
    const root = this.getRootWidget();
    if (this.status === true && root) {
      const { mask } = this;
      this.status = false;
      root.remove(this);
      root.remove(mask);
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
    XEvent.bind(mask, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      this.close();
      evt1.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      if (evt1.button !== 0) {
        return;
      }
      const root = this.getRootWidget();
      const box = root.box();
      const dxy = this.eventXy(evt1);
      XEvent.mouseMoveUp(h(document), (evt2) => {
        const top = evt2.pageY - box.top - dxy.y;
        const left = evt2.pageX - box.left - dxy.x;
        this.offset({
          top, left,
        });
        evt2.stopPropagation();
      });
      evt1.stopPropagation();
    });
  }

  /**
   * 设置显示位置
   */
  dragPanelLocation() {
    const root = this.getRootWidget();
    const { options } = this;
    const { position } = options;
    const rootBox = root.box();
    const elemBox = this.box();
    switch (position) {
      case DragPanel.DRAG_PANEL_POSITION.LEFT:
        break;
      case DragPanel.DRAG_PANEL_POSITION.RIGHT:
        break;
      case DragPanel.DRAG_PANEL_POSITION.TOP:
        break;
      case DragPanel.DRAG_PANEL_POSITION.CENTER:
        this.offset({
          left: rootBox.width / 2 - elemBox.width / 2,
          top: rootBox.height / 2 - elemBox.height / 2,
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
  childrenNodes(...args) {
    this.content.childrenNodes(...args);
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

}

DragPanel.DRAG_PANEL_POSITION = {
  LEFT: 1,
  TOP: 2,
  RIGHT: 3,
  CENTER: 4,
};

export { DragPanel };
