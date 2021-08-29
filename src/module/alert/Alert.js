import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { DragPanel } from '../dragpanel/DragPanel';
import { XEvent } from '../../lib/XEvent';
import { SheetUtils } from '../../utils/SheetUtils';

class Alert extends Widget {

  constructor(options) {
    super(`${cssPrefix}-alert`);
    this.options = SheetUtils.copy({
      message: '',
      title: '提示',
      closeDestroy: true,
    }, options);
    this.message = this.options.message;
    this.title = this.options.title;
    this.closeDestroy = this.options.closeDestroy;
    // 创建 UI
    this.closeEle = h('div', `${cssPrefix}-alert-close`);
    this.titleEle = h('div', `${cssPrefix}-alert-title`);
    this.contentEle = h('div', `${cssPrefix}-alert-content`);
    this.okEle = h('div', `${cssPrefix}-alert-ok`);
    this.buttonsEle = h('div', `${cssPrefix}-alert-buttons`);
    // 显示内容消息
    this.titleEle.html(this.title);
    this.contentEle.html(this.message);
    this.okEle.html('确定');
    // 添加UI
    this.buttonsEle.childrenNodes(this.okEle);
    this.childrenNodes(this.closeEle);
    this.childrenNodes(this.titleEle);
    this.childrenNodes(this.contentEle);
    this.childrenNodes(this.buttonsEle);
    // 拖拽组件
    this.dragPanel = new DragPanel()
      .childrenNodes(this)
      .parentWidget(this);
  }

  setTitle(title) {
    this.titleEle.html(title);
    return this;
  }

  setMessage(message) {
    this.message = message;
    this.contentEle.html(message);
    return this;
  }

  bind() {
    const { okEle } = this;
    XEvent.bind(okEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.close();
    });
  }

  unbind() {
    const { okEle } = this;
    XEvent.unbind(okEle);
  }

  open() {
    const { dragPanel } = this;
    dragPanel.open();
    this.bind();
    return this;
  }

  close() {
    const { closeDestroy, dragPanel } = this;
    dragPanel.close();
    if (closeDestroy) {
      this.destroy();
    }
    return this;
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.dragPanel.destroy();
  }

}

export {
  Alert,
};
