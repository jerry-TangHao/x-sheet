import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';

class PlainInput extends Widget {

  constructor() {
    super(`${cssPrefix}-form-plain-input`);
    this.inputWrapEle = h('div', `${cssPrefix}-form-input-wrap`);
    this.inputInnerEle = h('div', `${cssPrefix}-form-input-inner`);
    this.inputEle = h('input', `${cssPrefix}-form-input-source`);
    this.inputInnerEle.children(this.inputEle);
    this.inputWrapEle.children(this.inputInnerEle);
    this.children(this.inputWrapEle);
    this.bind();
  }

  unbind() {
    const { inputEle } = this;
    XEvent.unbind(inputEle);
  }

  bind() {
    const { inputEle } = this;
    XEvent.bind(inputEle, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      this.setValue(inputEle.val());
    });
  }

  setValue(value) {
    this.inputEle.val(value);
    this.trigger(Constant.FORM_EVENT_TYPE.PLAIN_INPUT_CHANGE, {
      value: this.inputEle.val(),
    });
  }

  getValue() {
    return this.inputEle.val();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  PlainInput,
};
