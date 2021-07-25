import { h } from '../../../libs/Element';
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../libs/Widget';
import { XEvent } from '../../../libs/XEvent';

class SearchInput extends Widget {

  constructor() {
    super(`${cssPrefix}-form-search-input`);
    this.inputWrapEle = h('div', `${cssPrefix}-form-input-wrap`);
    this.inputInnerEle = h('div', `${cssPrefix}-form-input-inner`);
    this.inputEle = h('input', `${cssPrefix}-form-input-source`);
    this.searchEle = h('div', `${cssPrefix}-form-input-search`);
    this.inputInnerEle.children(this.inputEle);
    this.inputWrapEle.children(this.inputInnerEle);
    this.children(this.inputWrapEle);
    this.children(this.searchEle);
    this.bind();
  }

  unbind() {
    const { searchEle, inputEle } = this;
    XEvent.unbind(searchEle);
    XEvent.unbind(inputEle);
  }

  bind() {
    const { searchEle, inputEle } = this;
    XEvent.bind(searchEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.setValue(inputEle.val());
    });
    XEvent.bind(inputEle, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      this.setValue(inputEle.val());
    });
  }

  getValue() {
    const { inputEle } = this;
    return inputEle.val();
  }

  setValue(value) {
    const { inputEle } = this;
    inputEle.val(value);
    this.trigger(Constant.FORM_EVENT_TYPE.SEARCH_INPUT_CHANGE, {
      value: inputEle.val(),
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  SearchInput,
};
