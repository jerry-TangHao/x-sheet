import { Widget } from '../../libs/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../libs/Element';
import { DragPanel } from '../dragpanel/DragPanel';
import { XEvent } from '../../libs/XEvent';

class Alert extends Widget {

  constructor({
    title = '提示',
    message = '',
  }) {
    super(`${cssPrefix}-alert`);
    // 创建 UI
    this.closeEle = h('div', `${cssPrefix}-alert-close`);
    this.titleEle = h('div', `${cssPrefix}-alert-title`);
    this.contentEle = h('div', `${cssPrefix}-alert-content`);
    this.okEle = h('div', `${cssPrefix}-alert-ok`);
    this.buttonsEle = h('div', `${cssPrefix}-alert-buttons`);
    // 显示内容消息
    this.titleEle.html(title);
    this.contentEle.html(message);
    this.okEle.html('确定');
    // 添加UI
    this.buttonsEle.children(this.okEle);
    this.children(this.closeEle);
    this.children(this.titleEle);
    this.children(this.contentEle);
    this.children(this.buttonsEle);
    // 拖拽组件
    this.dragPanel = new DragPanel().children(this);
  }

  unbind() {
    const { okEle } = this;
    XEvent.unbind(okEle);
  }

  bind() {
    const { okEle } = this;
    XEvent.bind(okEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.close();
    });
  }

  open() {
    const { dragPanel } = this;
    dragPanel.open();
    this.bind();
  }

  close() {
    const { dragPanel } = this;
    dragPanel.close();
    this.destroy();
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
