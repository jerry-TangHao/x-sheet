import { h } from '../../libs/Element';
import { Constant, cssPrefix } from '../../const/Constant';
import { Widget } from '../../libs/Widget';
import { DragPanel } from '../dragpanel/DragPanel';
import { XEvent } from '../../libs/XEvent';

class Confirm extends Widget {

  constructor({
    title = '提示',
    message = '',
    ok = () => {},
    no = () => {},
  }) {
    super(`${cssPrefix}-confirm`);
    this.title = title;
    this.message = message;
    this.ok = ok;
    this.no = no;
    // 创建 UI
    this.closeEle = h('div', `${cssPrefix}-confirm-close`);
    this.titleEle = h('div', `${cssPrefix}-confirm-title`);
    this.contentEle = h('div', `${cssPrefix}-confirm-content`);
    this.okEle = h('div', `${cssPrefix}-confirm-button ${cssPrefix}-confirm-ok`);
    this.noEle = h('div', `${cssPrefix}-confirm-button ${cssPrefix}-confirm-no`);
    this.buttonsEle = h('div', `${cssPrefix}-confirm-buttons`);
    // 显示内容消息
    this.titleEle.html(title);
    this.contentEle.html(message);
    this.okEle.html('确定');
    this.noEle.html('取消');
    // 添加UI
    this.buttonsEle.children(this.noEle);
    this.buttonsEle.children(this.okEle);
    this.children(this.closeEle);
    this.children(this.titleEle);
    this.children(this.contentEle);
    this.children(this.buttonsEle);
    // 拖拽组件
    this.dragPanel = new DragPanel().children(this);
  }

  unbind() {
    const { okEle, noEle } = this;
    XEvent.unbind(okEle);
    XEvent.unbind(noEle);
  }

  bind() {
    const { okEle, noEle } = this;
    XEvent.bind(okEle, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.ok();
      this.close();
    });
    XEvent.bind(noEle, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.no();
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
  Confirm,
};
