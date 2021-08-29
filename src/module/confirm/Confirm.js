import { h } from '../../lib/Element';
import { Constant, cssPrefix } from '../../const/Constant';
import { Widget } from '../../lib/Widget';
import { DragPanel } from '../dragpanel/DragPanel';
import { XEvent } from '../../lib/XEvent';
import { SheetUtils } from '../../utils/SheetUtils';

class Confirm extends Widget {

  constructor(options) {
    super(`${cssPrefix}-confirm`);
    this.options = SheetUtils.copy({
      title: '提示',
      message: '',
      no: () => {},
      ok: () => {},
    }, options);
    this.title = this.options.title;
    this.message = this.options.message;
    this.ok = this.options.ok;
    this.no = this.options.no;
    // 创建 UI
    this.closeEle = h('div', `${cssPrefix}-confirm-close`);
    this.titleEle = h('div', `${cssPrefix}-confirm-title`);
    this.contentEle = h('div', `${cssPrefix}-confirm-content`);
    this.okEle = h('div', `${cssPrefix}-confirm-button ${cssPrefix}-confirm-ok`);
    this.noEle = h('div', `${cssPrefix}-confirm-button ${cssPrefix}-confirm-no`);
    this.buttonsEle = h('div', `${cssPrefix}-confirm-buttons`);
    // 显示内容消息
    this.titleEle.html(this.title);
    this.contentEle.html(this.message);
    this.okEle.html('确定');
    this.noEle.html('取消');
    // 添加UI
    this.buttonsEle.childrenNodes(this.noEle);
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
